const db = require('./pool')

async function insertUser(firstname, lastname, username, password){
    const SQL = "INSERT INTO users (first_name, last_name, username, password, status, join_date) VALUES ($1, $2, $3, $4, 'outsider', 'NOW()') RETURNING *";
    const values = [firstname, lastname, username, password];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function getUserByUsername(username){
    const SQL = "SELECT * FROM users WHERE username = $1";
    const values = [username];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function getUserById(id){
    const SQL = "SELECT * FROM users WHERE id = $1";
    const values = [id];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

module.exports = {
    insertUser,
    getUserByUsername,
    getUserById
}