export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
export const FILE_PARENT_DIR = './src/uploads';
export const UPLOAD_DIR = './uploads';
export const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.docx', '.mp4', '.mkv', '.mov', '.avi', '.mp3', '.xlsx', '.ppt', '.pptx', '.doc', '.odt'];
export const createFilesTableQuery = `
  CREATE TABLE IF NOT EXISTS files (
    file_id UUID PRIMARY KEY,
    file_path VARCHAR(200) NOT NULL
  );
`;

export const createMetadataTableQuery = `
  CREATE TABLE IF NOT EXISTS metadata (
    file_id UUID PRIMARY KEY,
    file_name VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id)
  );
`;