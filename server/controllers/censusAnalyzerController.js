import { initGridDbTS, insert, queryByID } from "../config/db.js";

import { responseHandler } from "../utils/responseHandler.js";
import { readCSV, processData } from "../utils/csv.js";

const addCensusData = async(req, res) => {
    try {
        // Initialize GridDB
        const { collectionDb, store, conInfo } = await initGridDbTS();

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

            // If save is successful, query by ID to return data
            if (saveStatus.status) {
                const result = await queryByID(occupation, conInfo, store);
                let returnData = {
                    occupation: result[0],
                    minIncome: result[1],
                    maxIncome: result[2],
                    minFamilySize: result[3],
                    maxFamilySize: result[4],
                };
                // If all data saved successfully
                return responseHandler(
                    res,
                    "Census data saved successfully",
                    201,
                    true,
                    returnData
                );
                // saveResults.push({ data: returnData, status: saveStatus });
            } else {
                console.error(`Error saving ${occupation}:`, saveStatus.error);
                saveResults.push({
                    occupation,
                    status: false,
                    error: saveStatus.error,
                });
            }
        }

        // Check for unsuccessful insertions
        const unsuccessfulSaves = saveResults.filter((result) => !result.status);
        if (unsuccessfulSaves.length > 0) {
            return responseHandler(
                res,
                "Some census data could not be saved",
                400,
                false,
                unsuccessfulSaves.map(
                    (result) => `${result.occupation}: ${result.error}`
                )
            );
        }
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