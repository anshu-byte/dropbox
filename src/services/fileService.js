import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { createMetadata, getMetadata, removeMetadata, getAllMetadata, updateMetadata } from '../models/MetadataModel.js';
import { createFilePath, getFilePath, removeFilePath, updateFilePath } from '../models/fileModel.js';
import pool from '../config/dbConfig.js';


const constructMetadata = (file, metadata) => {
    const {customName} = metadata
    const { originalname, mimetype, size } = file;
    return { fileName: customName || originalname, size, fileType: mimetype };
};

const uploadFile = async (file, metadata) => {
    const client = await pool.connect();
    const fileId = uuidv4();
    const {path } = file;

    try {
        metadata = constructMetadata(file, metadata)
        await client.query('BEGIN')
        await createFilePath(fileId, path);
        await createMetadata(fileId, metadata);
        await client.query('COMMIT')
        return { fileId };
    } catch (error) {
        await client.query('ROLLBACK')
        throw new Error(error.message);
    }
    finally {
        client.release();
    }
};

const readFile = async (fileId) => {
    try {
        const filePath = await getFilePath(fileId);
        if (!filePath) throw new Error('File data not found');
        
        const metadata = await getMetadata(fileId);
        await fs.access(filePath);
        const fileData = await fs.readFile(filePath);
        
        return { fileData, metadata };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteFile = async (fileId) => {
    const client = await pool.connect();
    try {
        const filePath = await getFilePath(fileId);
        if (!filePath) throw new Error('File data not found');
        await client.query('BEGIN')
        await removeMetadata(fileId);
        await removeFilePath(fileId);
        await client.query('COMMIT')
        return { message: 'File deleted successfully' };
    } catch (error) {
        await client.query('ROLLBACK')
        throw new Error( error.message);
    }
    finally {
        client.release();
    }
};

const handleUpdateFile = async (file, fileId, metadata) => {
    let message = ''
    const metadataIsEmpty = metadata && Object.keys(metadata).length > 0;
    metadata = constructMetadata(file || {}, metadata || {})
    if (file && metadataIsEmpty) {
            await updateFilePath(fileId, file.path);
            await updateMetadata(fileId, metadata);
            message = 'File and it\'s metadata updated successfully';
        }
    else {
        if (file) {
            await updateFilePath(fileId, file.path);
            await updateMetadata(fileId, metadata);
            message = 'File updated successfully';
        }
        if (metadataIsEmpty) {
            await updateMetadata(fileId, metadata);
            message = 'File metadata updated successfully';           
        }
    }
    return message
}

const updateFile = async (fileId, file, metadata) => {
    if (!fileId) throw new Error('File id isn\'t provided');
    const client = await pool.connect();
    try {
        let message = '';
        await client.query('BEGIN')
        message = await handleUpdateFile(file, fileId, metadata)
        await client.query('COMMIT')
        return { message: message };
    } catch (error) {
        await client.query('ROLLBACK')
        throw new Error(error.message);
    }
    finally {
        client.release();
    }
};

const listAllFiles = async () => {
    try {
        const metadata = await getAllMetadata();
        return metadata;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { uploadFile, readFile, deleteFile, listAllFiles, updateFile }