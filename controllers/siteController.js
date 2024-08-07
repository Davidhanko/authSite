const db = require('../middleware/queries');
const {validationResult} = require('express-validator');
const { DateTime } = require('luxon');


async function board(req, res){
    let posts = await db.getPosts();
    posts = posts.map(post => {
        post.date = DateTime.fromJSDate(post.date).toLocaleString(DateTime.DATETIME_MED);
        return post;
    })
    const currentUser = req.user;
    res.render('board', {posts: posts, currentUser: currentUser});
}

async function createPost(req, res){
    const currentUser = req.user;
    if(!currentUser){
        res.redirect('/login');
    }
    res.render('createPost');
}

async function profile(req, res){
const currentUser = req.user;
    if(!currentUser){
        res.redirect('/login');
    }
    res.render('profile', {currentUser: currentUser});
}



async function createPostSubmit(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('createPost', {errors: errors.array()});
    }
    const {title, content} = req.body;
    const currentUser = req.user;
    const author = currentUser.id;
    try{
        const newPost = await db.createPost(title, content, author);
        res.redirect('/board');
    }catch (error){
        console.log(error);
        res.redirect('/create/post');
    }
}

module.exports = {
    board,
    createPost,
    profile,
    createPostSubmit
}