'use strict';

// Required packages
const express = require("express");
require('dotenv').config();
const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}...`);
});
