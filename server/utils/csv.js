// Use import statements for ES modules
import fs from 'fs';
import csv from 'csv-parser';

// Function to read CSV file
export const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Function to process data and calculate min and max values
export const processData = async(data) => {
    const occupationStats = {};

    data.forEach((row) => {
        const occupation = row.occupation;
        const familySize = parseInt(row.family_size, 10);
        const income = parseInt(row.income, 10);

        if (!occupationStats[occupation]) {
            occupationStats[occupation] = {
                minIncome: income,
                maxIncome: income,
                minFamilySize: familySize,
                maxFamilySize: familySize,
            };
        } else {
            occupationStats[occupation].minIncome = Math.min(
                occupationStats[occupation].minIncome,
                income
            );
            occupationStats[occupation].maxIncome = Math.max(
                occupationStats[occupation].maxIncome,
                income
            );
            occupationStats[occupation].minFamilySize = Math.min(
                occupationStats[occupation].minFamilySize,
                familySize
            );
            occupationStats[occupation].maxFamilySize = Math.max(
                occupationStats[occupation].maxFamilySize,
                familySize
            );
        }
    });
    console.log('Processed Occupation Stats:', occupationStats);

    return occupationStats;
};