import pool from '../config/dbConfig.js';


const createMetadata = async (fileId, metadata) => {
    const {fileName, size, fileType} = metadata
    const query = `
        INSERT INTO metadata (file_id, file_name, size, file_type, modified_at)
        VALUES ($1, $2, $3, $4, NOW());
    `;
    const values = [fileId, fileName, size, fileType];
    await pool.query(query, values);
};

const getMetadata = async (fileId) => {
    const query = `SELECT * FROM metadata WHERE file_id = $1;`;
    const values = [fileId];
    const { rows } = await pool.query(query, values);
    const metadata = rows[0]
    return metadata;
};

const updateMetadata = async (fileId, metadata) => {
    const { fileName, size, fileType } = metadata;
    let query = 'UPDATE metadata SET modified_at = NOW()';
    const values = [];
    let valueIndex = 1;

    if (fileName !== undefined) {
        query += `, file_name = $${valueIndex++}`;
        values.push(fileName);
    }

    if (size !== undefined) {
        query += `, size = $${valueIndex++}`;
        values.push(size);
    }

    if (fileType !== undefined) {
        query += `, file_type = $${valueIndex++}`;
        values.push(fileType);
    }

    query += ` WHERE file_id = $${valueIndex}`;
    values.push(fileId);

    await pool.query(query, values);
};


const removeMetadata = async (fileId) => {
    const query = `DELETE FROM metadata WHERE file_id = $1;`;
    const values = [fileId];
    await pool.query(query, values);
};

const getAllMetadata = async () => {
    const query = `SELECT * FROM metadata ORDER BY MODIFIED_AT;`;
    const { rows } = await pool.query(query);
    return rows;
};

export {createMetadata, getMetadata, updateMetadata, getAllMetadata, removeMetadata}