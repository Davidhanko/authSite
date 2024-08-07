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

async function createPost(title, content, author){
    const SQL = "INSERT INTO posts (title, message, author, date) VALUES ($1, $2, $3, 'NOW()') RETURNING *";
    const values = [title, content, author];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function getPosts(){
    const SQL = "SELECT posts.*, users.username FROM posts" +
        " JOIN users ON posts.author = users.id" +
        " ORDER BY posts.date DESC";
    const {rows} = await db.query(SQL);
    return rows;
}

module.exports = {
    insertUser,
    getUserByUsername,
    getUserById,
    createPost,
    getPosts
}