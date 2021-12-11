/**
 * Initialize imports for express server
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 3001;

require('dotenv').config();
const BigQuery = require('@google-cloud/bigquery');

// 
const app = express();

// Allow us to take JSON input from requests
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

// Listen to /query for incoming post requests
app.post('/query', (req, res) => {
    performQuery(req.body).then(result => res.json(result));
});

/**
 * Interfaces with BigQuery to gather appropriate data
 * @param {Array} attr - Array of elements with indices corresponding to the top left and bottom right points
 * @returns {Object} containing results of query.
 */
const performQuery = async (attr) => {
    const bigquery = new BigQuery();

    // Build query to retrieve crimes within specified area
    let query = 
    `SELECT primary_type, longitude, latitude
    FROM \`project-334322.chicago_crime_set.crime_set\` 
    WHERE latitude IS NOT NULL 
    AND longitude >= ${attr[0].location.lng} AND latitude >= ${attr[1].location.lat}
    AND longitude <= ${attr[1].location.lng} AND latitude <= ${attr[0].location.lat}`

    const options = { query: query };

    // Send sql query to the backend
    return bigquery.query(options)
    .then(results => {
        console.log('query done');
        return { results: results[0] }
    })
    .catch(err => console.error(err));
}

/**
 * Listens for requests on specified port
 */
app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`)
})