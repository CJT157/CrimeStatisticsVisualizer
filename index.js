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

app.post('/', (req, res) => {
    res.json({'success': 'Hello, World!'})
});


app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`)
})