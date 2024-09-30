import express from 'express';
import addCensusData from '../controllers/censusAnalyzerController.js';
import multer from 'multer';

// Configure Multer for file uploads, storing files in the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route configuration with Multer to handle file uploads
router.post('/add-census-data', upload.single('uploaded_file'), addCensusData);

export default router;