import express from 'express'
import fileRoutes from './routes/fileRoutes.js'
import dotenv from 'dotenv'
import './services/cleanupService.js'

const app = express();
dotenv.config();
app.use(express.json());
app.use('/files', fileRoutes);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});