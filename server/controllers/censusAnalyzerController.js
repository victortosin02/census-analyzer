import { initGridDbTS, insert } from "../config/db.js";
import { responseHandler } from "../utils/responseHandler.js";
import { readCSV, processData } from "../utils/csv.js";

const addCensusData = async(req, res) => {
    try {
        // Initialize GridDB
        const { collectionDb } = await initGridDbTS();

        // Access the uploaded file from multer
        const uploadedFile = req.file;
        if (!uploadedFile) {
            return responseHandler(res, "No file uploaded", 400, false);
        }

        // Read and process the uploaded CSV file
        const readCSVResult = await readCSV(uploadedFile.path);
        const occupationStats = await processData(readCSVResult);

        // Prepare data for insertion
        const saveResults = [];
        for (const [occupation, stats] of Object.entries(occupationStats)) {
            const data = [
                occupation,
                stats.minIncome,
                stats.maxIncome,
                stats.minFamilySize,
                stats.maxFamilySize,
            ];

            // Save the processed data
            const saveStatus = await insert(data, collectionDb);

            // Only push the result if the insertion was successful
            if (saveStatus.status) {
                // Push the inserted data into the results
                saveResults.push({
                    occupation,
                    minIncome: stats.minIncome,
                    maxIncome: stats.maxIncome,
                    minFamilySize: stats.minFamilySize,
                    maxFamilySize: stats.maxFamilySize,
                });
            } else {
                // Collect errors for unsuccessful inserts
                console.error(`Error saving ${occupation}:`, saveStatus.error);
            }
        }

        // Check for unsuccessful insertions
        if (saveResults.length === 0) {
            return responseHandler(
                res,
                "No census data was saved.",
                400,
                false,
                "All insertions failed."
            );
        }

        // If all data is saved successfully
        return responseHandler(
            res,
            "Census data saved successfully",
            201,
            true,
            saveResults // Include the saved data in the response
        );
    } catch (error) {
        return responseHandler(
            res,
            "Error saving census data",
            400,
            false,
            error.message
        );
    }
};

export default addCensusData;