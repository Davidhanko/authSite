const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteController');
const {body} = require('express-validator');

router.get('/board', controller.board);
router.get('/create/post', controller.createPost);
router.get('/profile', controller.profile);



router.post('/create/post',
    body('title').isLength({min: 1}).withMessage('Title is required.').trim().escape(),
    body('content').isLength({min: 1}).withMessage('Content is required.').trim().escape(),
    controller.createPostSubmit);

router.get('/post/:id', controller.post);

router.post('/post/:id/comment',
body('comment').isLength({min: 1}).withMessage('Comment is required.').trim().escape(),
controller.createComment);

router.post('/delete/comment/:id/:postId', controller.deleteComment);
router.post('/delete/post/:id', controller.deletePost);

module.exports = router;