Census Data Analytics Using GridDB, Docker, and Node.js
Introduction
In this project, we will concentrate on a census analytics system designed to ingest data from a source system, analyze it, generate insights from census data, and finally store the processed data in a target system. Census data, in this case, refers to the demographic information retrieved from a population at regular intervals, typically conducted by governments to gather information about the population's characteristics, such as age, gender, race, income, education level, household composition, and more.

The census analytics system has proven efficient, allowing census officials to upload census data from household enumeration and generate insights after processing this data. To narrow down the deliverables, this project seeks to analyze and calculate the minimum and maximum income and family size for each occupation and store the results in a GridDB database, leveraging stacks of technologies such as Node.js, Docker, and GridDB.

Methodology
The purpose of this project is to analyze sample data of households from an enumeration exercise, ingest the data, analyze it, and load the analyzed data into a database. To accomplish this, we will leverage Docker because it makes it easy to spin up all the required services.

Technologies Used:
The following stack of technologies was leveraged to efficiently analyze the census data:

JavaScript for programming
JDBC for database connectivity
GridDB for storing and managing data
Docker for containerization and application portability
Prerequisites
What You Need to Install:
Node.js
Docker Desktop
GridDB will be downloaded and installed in a Dockerfile in subsequent sections.

How to Follow Along
If you plan to code along while you read this article, you can grab the source code from the repository below:

Methodology
The purpose of this project is to analyze sample data of households from an enumeration exercise from a source system, analyze the ingested data and load analyzed data to a database. To accomplish this, we will be leveraging Docker because it makes it easy to spin up all the required services.

Technologies Used:
The following stack of technologies were leveraged on to efficiently analyze the census data: Java for programming

Javasccript for programming
JDBC for database connectivity
GridDB for storing and managing data
Docker For Containerization and Application Portability

Prerequisites
What you need to install:
NodeJS
Docker Desktop
Griddb will be downloaded and installed in a Dockerfile in consquent sections.

How to Follow Along
If you plan to code along yourself while you read this article, you can grab the source code from the repo below:

git clone https://github.com/victortosin02/census.git


Step 1: Create a Server Folder
We start by creating a server folder and initialize by running npm to generate a package.json file. You can name the folder anything you want but in my case I named it server:

npm i

Step 2: Install Required Packages
npm i express morgan joi uuid csv-parser multer griddb-node-api cors.
Additionally, as a nice to have, I installed nodemon to effect server restart when changes are registered during development. Below is the command tominstall nodemon:

npm i -D nodemon

{
    "name": "grid-db-census-server",
    "version": "1.0.0",
    "description": "Backend for grid db census-server",
    "main": "server.js",
    "type": "module",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "nodemon server.js"
    },
    "keywords": [
        "census",
        "griddb",
        "griddb_node"
    ],
    "author": "Oladejo Victor",
    "license": "ISC",
    "dependencies": {
        "cors": "^2.8.5",
        "csv-parser": "^3.0.0",
        "express": "^4.18.2",
        "express-formidable-v2": "^2.2.1",
        "formidable": "^2.1.2",
        "griddb_node": "^0.8.4",
        "griddb-node-api": "^0.8.6",
        "joi": "^17.11.0",
        "morgan": "^1.10.0",
        "multer": "^1.4.5-lts.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}

Data Ingestion, Processing and Loading
From the implementation end after provisioning and configuring the server environment, we will server.js file where we create a port for running the server. At this section, we will create anoter db.js file which is responsible for implementation of store configuration, database and schema initialization and and varoius insertion and query functions for the database. 

Step 3: Create Server.js File
Create an server.js file and insert the following code:

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

If you installed nodemon as a dev dependency, you’ll need to add this line of code to the “scripts” section in your package.json file:

"dev": "nodemon index.js"

Step 4: Run the Application
Having installed the nodemon dependency, start the application by running npm run dev. 

Step 5: Setup the GridDB Database
After provisioning a server to run our application, I will proceed to create a config folder to configure all database connections to griddb which we shall leverage later on when uploading files, processing and inserting processed data to griddb. I shall start by provisoning a container name for this project and in this case I named it "census-data".

Below is the db.js code snippet responsible for implementing various database configuration and implemetation. Below is the code snippets for our database setup and implementation.

import griddb from "griddb-node-api";

const containerName = "census-data";

const initStore = async() => {
    const factory = griddb.StoreFactory.getInstance();
    try {
        // Connect to GridDB Cluster
        const store = await factory.getStore({
            host: "griddb-server",
            port: 10001,
            clusterName: "myCluster",
            username: "admin",
            password: "admin",
        });
        return store;
    } catch (e) {
        throw e;
    }
};

function initContainer() {
    const conInfo = new griddb.ContainerInfo({
        name: containerName,
        columnInfoList: [
            ["occupation", griddb.Type.STRING],
            ["minIncome", griddb.Type.LONG],
            ["maxIncome", griddb.Type.LONG],
            ["minFamilySize", griddb.Type.INTEGER],
            ["maxFamilySize", griddb.Type.INTEGER],
        ],
        type: griddb.ContainerType.COLLECTION,
        rowKey: true,
    });

    return conInfo;
}

async function createContainer(store, conInfo) {
    try {
        const collectionDB = await store.putContainer(conInfo);
        return collectionDB;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function initGridDbTS() {
    try {
        const store = await initStore();
        const conInfo = await initContainer();
        const collectionDb = await createContainer(store, conInfo);
        return { collectionDb, store, conInfo };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function containersInfo(store) {
    for (
        var index = 0; index < store.partitionController.partitionCount; index++
    ) {
        store.partitionController
            .getContainerNames(index, 0, -1)
            .then((nameList) => {
                nameList.forEach((element) => {
                    // Get container information
                    store.getContainerInfo(element).then((info) => {
                        if (info.name === containerName) {
                            console.log("Container Info: \n %s", info.name);
                            if (info.type == griddb.ContainerType.COLLECTION) {
                                console.log(" Type: Collection");
                            } else {
                                console.log(" Type: TimeSeries");
                            }
                            //console.log("rowKeyAssigned=%s", info.rowKey.toString());
                            console.log("  Column Count: %d", info.columnInfoList.length);
                            info.columnInfoList.forEach((element) =>
                                console.log(" Column (%s, %d)", element[0], element[1])
                            );
                        }
                    });
                });
                return true;
            })
            .catch((err) => {
                if (err.constructor.name == "GSException") {
                    for (var i = 0; i < err.getErrorStackSize(); i++) {
                        console.log("[%d]", i);
                        console.log(err.getErrorCode(i));
                        console.log(err.getMessage(i));
                    }
                } else {
                    console.log(err);
                }
            });
    }
}

/**
 * Insert data to GridDB
 */
async function insert(data, container) {
    try {
        let savedData = await container.put(data);

        console.log(savedData);
        return { status: true };
    } catch (err) {
        if (err.constructor.name == "GSException") {
            for (var i = 0; i < err.getErrorStackSize(); i++) {
                console.log("[%d]", i);
                console.log(err.getErrorCode(i));
                console.log(err.getMessage(i));
            }

            return { status: false, error: err.toString() };
        } else {
            console.log(err);
            return { status: false, error: err };
        }
    }
}

async function multiInsert(data, db) {
    try {
        await db.multiPut(data);
        return { ok: true };
    } catch (err) {
        console.log(err);
        return { ok: false, error: err };
    }
}

async function queryAll(conInfo, store) {
    const sql = `SELECT *`;
    const cont = await store.putContainer(conInfo);
    const query = await cont.query(sql);
    try {
        const rowset = await query.fetch();
        const results = [];

        while (rowset.hasNext()) {
            const row = rowset.next();
            results.push(row);
        }
        return { results, length: results.length };
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function queryByID(id, conInfo, store) {
    try {
        const cont = await store.putContainer(conInfo);
        const row = await cont.get(id);
        return row;
    } catch (err) {
        console.log(err, "here");
    }
}

// Delete container
async function dropContainer(store, containerName) {
    store
        .dropContainer(containerName)
        .then(() => {
            console.log("drop ok");
            return store.putContainer(conInfo);
        })
        .catch((err) => {
            if (err.constructor.name == "GSException") {
                for (var i = 0; i < err.getErrorStackSize(); i++) {
                    console.log("[%d]", i);
                    console.log(err.getErrorCode(i));
                    console.log(err.getMessage(i));
                }
            } else {
                console.log(err);
            }
        });
}

//Delete entry
const deleteByID = async(store, id, conInfo) => {
    try {
        const cont = await store.putContainer(conInfo);
        let res = await cont.remove(id);

        return [true, res];
    } catch (error) {
        return [false, error];
    }
};

const editByID = async(store, conInfo, data) => {
    try {
        const cont = await store.putContainer(conInfo);
        const res = await cont.put(data);
        return [true, ""];
    } catch (err) {
        return [false, err];
    }
};

export {
    initStore,
    initContainer,
    initGridDbTS,
    createContainer,
    insert,
    multiInsert,
    queryAll,
    dropContainer,
    containersInfo,
    containerName,
    queryByID,
    deleteByID,
    editByID,
};


Step 6: Read and process the census data
To start ingesting data, we need to upload census data so we can extract relevant data and commence processing of the data based on defined goals and objectives. In our case, we will be uplaoding an input.csv file that contains census data for households across various occupation. The parameters of concern are ssn, family size, occupation, and income. We will proceed by creating a utils folder and create a file called csv.js. This file will be responsible for reading and processing our csv file. The way we will have this setup will be usch that we will upload the file using multer. Below is our csv.js code snippet.

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

Step 7: Data Insertion to Griddb Database:
After reading the csv file and processing the data to derive the minimun and maximum family size and income per occupation in the census data, we will be creating a censusAnalyzerController.js that inserts the analytics performed into a griddb database based on the erstwile provision in our db.js file. The code below put into proper context what censusAnalyzerController.js does and why it is to central both to our analytics and data insertion.

import { initGridDbTS, insert, queryByID } from "../config/db.js";

import { responseHandler } from "../utils/responseHandler.js";
import { readCSV, processData } from "../utils/csv.js";

const addCensusData = async (req, res) => {
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


Step 8: Handling API Routes 
To handle data routing and ensure that we upload the csv file through the route created, we will leverage on the multer package to route the uploaded file and then ensure that the data from the uploaded file is read and processed using in the addCensusData function in our censusAnalyzerController.js. We will create a censusAnalyzerRoutes.js file and below is the code for proper context:

import express from 'express';
import addCensusData from '../controllers/censusAnalyzerController.js';
import multer from 'multer';

// Configure Multer for file uploads, storing files in the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route configuration with Multer to handle file uploads
router.post('/add-census-data', upload.single('uploaded_file'), addCensusData);

export default router;

Step 9: Testing our Application
To test our application, we need to make our application portable and ensure that both the griddb server and the application connects and communicate. Toa chieve this, we will create a docker-compose.yml file to establish a connection. Below is our docer compose file:

services:
  griddb-server:
    build:
      context: griddb-server
      dockerfile: Dockerfile
    container_name: griddb-server
    user: root
    expose:
      - "10001"
      - "10010"
      - "10020"
      - "10040"
      - "20001"
      - "41999"
    environment:
      NOTIFICATION_MEMBER: 1
      GRIDDB_CLUSTER_NAME: myCluster
    healthcheck:
      test: ["CMD", "gs_sh"]
      interval: 60s
      timeout: 20s
      retries: 5

  server:
    build:
      context: server
      dockerfile: Dockerfile
    container_name: census-analyzer
    expose:
      - "4000"
    ports:
      - "4000:4000"
    depends_on:
      - griddb-server
    links:
      - griddb-server

After putting every bits and pieces together, we shall proceed to run the command below to build and start our application:

docker-compose up --build

After the building and spinning up of our container, we shall run this command to ensure we join the GridDB node to the GridDB cluster. 

docker exec -it griddb-server gs_joincluster -c myCluster -u admin/admin

After running this command, we will proceed to postman or any api testing platform of your choice to start testing the API. Add the APi route http://localhost:4000/api/add-census-data with a POST method and proceed to select body and then form-data to upload a csv file. In the key field, type uploaded_file. You can change it to anything you want but ensure it is the exact name you have as a multer parameter in the censusAnalyzerRoutes.js code. Then proceed to upload your csv file ensuring it is the same expected input from the csv.js file becuase processing will be done based on this parameters extracted. AUpon hitting send, you will get a 201 reponse below:

{
    "success": true,
    "message": "Census data saved successfully",
    "data": {
        "occupation": "engineer",
        "minIncome": 1000000,
        "maxIncome": 9000000,
        "minFamilySize": 3,
        "maxFamilySize": 10
    }
}


Conclusion
In this project, we have successfully built a comprehensive census analytics system leveraging GridDB, Docker, and Node.js. Through this journey, we demonstrated how to set up and configure a scalable and efficient data processing pipeline capable of ingesting, analyzing, and storing census data. The combination of GridDB, Docker, and Node.js has proven to be a powerful stack for building scalable and efficient data analytics systems. By following the outlined steps and leveraging the provided Docker configurations, you can replicate and extend this solution to meet specific needs and handle various data analytics tasks. We encourage you to explore the code repository and experiment with the setup to gain a deeper understanding of the system. With these tools and methodologies, you are well-equipped to tackle complex data analytics challenges and derive actionable insights from vast datasets.