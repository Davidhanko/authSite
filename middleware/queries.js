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

async function getPostByID(id){
    const SQL = "SELECT posts.*, users.username FROM posts" +
        " JOIN users ON posts.author = users.id" +
        " WHERE posts.id = $1";
    const values = [id];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function createComment(author, post_commented, text){
    const SQL = "INSERT INTO comments (commenter, post_commented, text, date) VALUES ($1, $2, $3, 'NOW()') RETURNING *";
    const values = [author, post_commented, text];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function getCommentsByPostID(postID){
    const SQL = "SELECT comments.*, users.username FROM comments" +
        " JOIN users ON comments.commenter = users.id" +
        " WHERE comments.post_commented = $1";
    const values = [postID];
    const {rows} = await db.query(SQL, values);
    return rows;
}

async function upgradeUser(id){
    const SQL = "UPDATE users SET status = 'member' WHERE id = $1 RETURNING *";
    const values = [id];
    const {rows} = await db.query(SQL, values);
    return rows[0];
}

async function deleteComment(id){
    const SQL = "DELETE FROM comments WHERE id = $1";
    const values = [id];
    await db.query(SQL, values);
}

async function deletePost(id){
    const SQL = "DELETE FROM posts WHERE id = $1";
    const values = [id];
    await db.query(SQL, values);
}

async function deleteAllCommentsByPostID(id){
    const SQL = "DELETE FROM comments WHERE post_commented = $1";
    const values = [id];
    await db.query(SQL, values);
}

module.exports = {
    insertUser,
    getUserByUsername,
    getUserById,
    createPost,
    getPosts,
    getPostByID,
    createComment,
    getCommentsByPostID,
    upgradeUser,
    deleteComment,
    deletePost,
    deleteAllCommentsByPostID
}