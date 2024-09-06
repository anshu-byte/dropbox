import cron from 'node-cron';
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import {getAllFilePath} from '../models/fileModel.js'
import { UPLOAD_DIR } from '../utils/constants.js';

// eslint-disable-next-line no-undef
const cronExpression = process.env.CRON_EXPRESSION; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname,'..', UPLOAD_DIR);
const cleanup = async () => {
    console.log('Cleanup started');
    try {
        const filesToKeep = await getAllFilePath();
        const filesToKeepSet = new Set(filesToKeep.map(file => path.basename(file.file_path)));

        fs.readdir(uploadsDir, (error, filesInDir) => {
            if (error) {
                console.error('Error reading directory:', error);
                return;
            }

            filesInDir.forEach(file => {
                if (!filesToKeepSet.has(file)) {
                    const filePath = path.join(uploadsDir, file);
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            console.error(`Error deleting file ${file}:`, error);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
    finally {
        console.log('Cleanup completed');
    }
};
cron.schedule(cronExpression, cleanup);
