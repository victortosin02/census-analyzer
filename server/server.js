import express from 'express';
import censusAnalyzerRoutes from './routes/censusAnalyzerRoutes.js';

const app = express();

// Mounting routes at '/api'
app.use('/api', censusAnalyzerRoutes);

// Test API route directly in server.js
app.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});