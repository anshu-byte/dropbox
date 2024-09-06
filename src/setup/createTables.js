/* eslint-disable no-undef */
import pkg from 'pg';
import dotenv from 'dotenv';
import { createFilesTableQuery, createMetadataTableQuery } from '../utils/constants.js';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

export async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(createFilesTableQuery);
    console.log('Files table is ready or already exists.');

    await client.query(createMetadataTableQuery);
    console.log('Metadata table is ready or already exists.');
  } catch (err) {
    console.error('Error creating tables', err);
    throw err; 
  } finally {
    client.release();
    pool.end();
  }
}
