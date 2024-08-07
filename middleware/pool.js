const {Pool} = require("pg");
require('dotenv').config({ path: './dotenv.env' })


const pool = new Pool({
    connectionString:  process.env.SQLSTRING
})

module.exports = pool;