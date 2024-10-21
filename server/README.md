## CENSUS ANALYZER

The server are used to store the census data coming and then run analytics based on the household data inserted

## Author

- [@VictorOladejo](https://github.com/victortosin02)

## API Reference

route detail to add cenus data for analysis

```bash
  GET /api/add-census-data
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
  npm run dev
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

## Tech Stack

Server: Node js, Express, Grid db
