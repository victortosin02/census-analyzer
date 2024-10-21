## CENSUS ANALYZER

The server are used to store the census data coming and then run analytics based on the household data inserted

## Author

- [@VictorOladejo](https://github.com/victortosin02)

## API Reference

route detail to add cenus data for analysis

```bash
  POST /api/add-census-data
```

## Documentation

- Node js
- Express
- Grid db
- Joi
- Morgan
- Cors

## Appendix

Any additional information goes here

## Contributing

Contributions are always welcome!

## Deployment

To deploy this project run

```bash
  npm run build
```

## Installation

Install project with npm

```bash
  npm install
```

## Feedback

If you have any feedback, please reach out to us at victortosin01@gmail.com

## Run Locally

Clone the project

```bash
  git clone https://github.com/victortosin02/census-analyzer.git
```
The server runs on localhost:4000. 

Go to the project directory

Build docker compose file

```bash
 docker-compose build
```

Run docker

```bash
 docker-compose up
```
To interact with the running GridDB container (griddb-server) and join it to the Docker cluster (myCluster).
Run this command:
```bash
 docker exec -it griddb-server gs_joincluster -c myCluster -u admin/admin
```

After running this command, proceed to postman or any api testing platform of your choice to start testing the API. Follow the steps belows while testing:

- Add the APi route http://localhost:4000/api/add-census-data with a POST method
- Proceed to select body and then form-data to upload a csv file.
- In the key field, type uploaded_file. You can change it to anything you want but ensure it is the exact name you have as a multer parameter in the censusAnalyzerRoutes.js code.
- Then proceed to upload your csv file ensuring it is the same expected input from the csv.js file becuase processing will be done based on this parameters extracted.
Upon hitting send, you will get a 201 reponse displaying the analyzed data.

## Tech Stack

Server: Node js, Express, Grid db
