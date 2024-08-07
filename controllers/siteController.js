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
    res.render('createPost' , {currentUser: currentUser});
}

async function profile(req, res){
const currentUser = req.user;
    if(!currentUser){
        res.redirect('/login');
    }
    res.render('profile', {currentUser: currentUser, errors: []});
}



async function createPostSubmit(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('createPost', {errors: errors.array(), currentUser: req.user});
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

async function post(req, res){
    try{
    const postId = req.params.id;
    const post = await db.getPostByID(postId);
    post.date = DateTime.fromJSDate(post.date).toLocaleString(DateTime.DATETIME_MED);
    const currentUser = req.user;
    let comments = await db.getCommentsByPostID(postId);
    comments = comments.map(comment => {
        comment.date = DateTime.fromJSDate(comment.date).toLocaleString(DateTime.DATETIME_MED);
        return comment;
    });
    res.render('post', {post: post, currentUser: currentUser, comments: comments});
    }
    catch (error){
        console.log(error);
        res.redirect('/board');
    }
}

async function createComment(req, res){
    const currentUser = req.user;
    if(currentUser === undefined){
        res.redirect('/login');
        return;
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('post', {errors: errors.array()});
    }
    const {comment} = req.body;
    const author = currentUser.id;
    const postId = req.params.id;
    try{
        const newComment = await db.createComment(author, postId, comment);
        res.redirect(`/site/post/${postId}`);
    }catch (error){
        console.log(error);
        res.redirect(`/site/post/${postId}`);
    }
}

async function deletePost(req, res){
    const postId = req.params.id;
    try{
        await db.deleteAllCommentsByPostID(postId);
        await db.deletePost(postId);
        res.redirect('/board');
    }catch (error){
        console.log(error);
        res.redirect('/board');
    }
}

async function deleteComment(req, res){
    const commentId = req.params.id;
    const postId = req.params.postId
    try{
        await db.deleteComment(commentId);
        res.redirect(`/site/post/${postId}`);
    }catch (error){
        console.log(error);
        res.redirect(`/site/post/${postId}`);
    }
}

module.exports = {
    board,
    createPost,
    profile,
    createPostSubmit,
    post,
    createComment,
    deletePost,
    deleteComment
}