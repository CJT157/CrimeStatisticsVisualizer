const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 3001;

require('dotenv').config();
const BigQuery = require('@google-cloud/bigquery');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.json({'success': 'Hello, World!'})
    performQuery(req.body).then(result => res.json(result));
});

const performQuery = async (attr) => {
    const bigquery = new BigQuery();

    let query = 
    `SELECT primary_type, ST_GeogPoint(longitude, latitude)
    AS point
    FROM \`project-334322.crimeset.crime\` 
    WHERE longitude IS NOT NULL`

    console.log(query);

    const options = { query: query };

    return bigquery.query(options)
    .then(results => {
        console.log('query done');
        console.log(results[0])
        return { results: results[0] }
    })
    .catch(err => console.error(err));
}

app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`)
})