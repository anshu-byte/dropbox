import { uploadFile, readFile, deleteFile, updateFile, listAllFiles } from '../services/fileService.js';
const extractMetadata = (req) => {
  const metadataString = req.body.metadata || `{}`;
  const metadata = JSON.parse(metadataString);
  return metadata
}

const uploadFileController = async (req, res) => {
    try {
        const file = req.file;
        const metadata = extractMetadata(req);
        const result = await uploadFile(file, metadata);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Error in uploading file', error: error.message });
    }
};

const readFileController = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { fileData, metadata } = await readFile(fileId);
        
        res.setHeader('Content-Type', metadata['file_type']);
        res.setHeader('Content-Length', metadata['size']);
        res.setHeader('Content-Disposition', `inline; filename="${metadata['file_name']}"`);
        return res.status(200).send(fileData);
    } catch (error) {
        return res.status(500).json({ message: 'Error in retrieving file', error: error.message });
    }
};

const deleteFileController = async (req, res) => {
    try {
        const { fileId } = req.params;
        const result = await deleteFile(fileId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Error in deleting file', error: error.message });
    }
};

const updateFileController = async (req, res) => {
    try {
        const file = req.file;
        const { fileId } = req.params;
        const metadata = extractMetadata(req);
        const result = await updateFile(fileId, file, metadata);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Error in updating file', error: error.message });
    }
};

const listAllFilesController = async (req, res) => {
    try {
        const result = await listAllFiles();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Error in listing all files', error: error.message });
    }
};

export { uploadFileController, readFileController, deleteFileController, updateFileController, listAllFilesController };
