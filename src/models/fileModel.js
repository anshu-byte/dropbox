import pool from '../config/dbConfig.js';

const createFilePath = async (fileId, filePath) => {
    const query = `
        INSERT INTO files (file_id, file_path)
        VALUES ($1, $2);
    `;
    const values = [fileId, filePath];
    await pool.query(query, values);
};


const getFilePath = async (fileId) => {
    const query = `SELECT file_path FROM files WHERE file_id = $1;`;
    const values = [fileId];
    const { rows } = await pool.query(query, values);
    const res  = rows[0]
    const filePath = res['file_path']
    return filePath;
};

const getAllFilePath = async () => {
    const query = `SELECT file_path FROM files;`;
    const { rows } = await pool.query(query);
    return rows;
};

const updateFilePath = async (fileId, filePath) => {
    const query = `
        UPDATE files
        SET file_path = $1
        WHERE file_id = $2;
    `;
    const values = [filePath, fileId];
    await pool.query(query, values);
};  

const removeFilePath = async (fileId) => {
    const values = [fileId];
    const firstQuery = `DELETE FROM files WHERE file_id = $1;`;
    await pool.query(firstQuery, values);
};

export {createFilePath, getFilePath, updateFilePath, removeFilePath, getAllFilePath}