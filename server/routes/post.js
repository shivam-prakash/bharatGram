const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin');

router.get('/allPosts', requireLogin, (req, res) => {
    console.log("inside all posts...");
    Post.find()
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json(posts);
        }).catch(err => {
            console.log(err);
        })
})

router.put('/like', requireLogin, (req, res) => {
    console.log('isnide likepost...' + req.body.user)
    console.log(req.body.id)
    Post.findByIdAndUpdate(req.body.id, {
        $push: { likes: req.body.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err) {
            res.status(422).json({ error: err });
        } else {
            console.log(result);
            res.json(result);
        }
    })

})

router.put('/unLike', requireLogin, (req, res) => {
    console.log('isnide Unlikepost...')
    Post.findByIdAndUpdate(req.body.id, {
        $pull: { likes: req.body.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        })

})
router.put('/comment', requireLogin, (req, res) => {
    console.log('isnide comment...')
    const comment = { text: req.body.text, postedBy: req.body.user._id }
    console.log(req.body.id)
    Post.findByIdAndUpdate(req.body.id, {
        $push: { comments: comment }
    }, {
        new: true,
        useFindAndModify: false
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err });
            } else {
                console.log(result)
                res.json(result);
            }
        })

})

router.get('/myPosts', requireLogin, (req, res) => {
    console.log("inside my posts...");
    console.log(req.body.user)
    Post.find({ postedBy: req.body.user._id })
        .populate("postedBy", "_id name")
        .then(myPost => {
            console.log(myPost)
            res.json(myPost)
        }).catch(err => {
            console.log(err);
        })
})
router.post('/createPost', requireLogin, (req, res) => {
    console.log("inside createpost...");
    console.log(req.body);
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        res.status(422).json("please send all the required fields");
    }
    const post = new Post({
        title: req.body.title,
        body: req.body.body,
        postedBy: req.body.user,
        photo: req.body.photo
    })
    post.save().then(savedUser => {
        res.json({ msg: "saved successfully" });
    }).catch(e => {
        console.log(e);
    })
})

router.delete('/deletePost/:postId', requireLogin, (req, res) => {
    console.log("delete post..." + req.params.postId)
    Post.findById(req.params.postId )
        .populate('postedBy','_id name ')
        .exec((err, post) => {
            if (err || !post) {
                res.status(422).json({ error: err })
            }
            console.log(post)
            if (post.postedBy._id.toString() === req.body.user._id.toString()) {
                post.remove()
                    .then(response => { res.json( response) })
                    .catch(err => console.log(err))
            }

        }
        )
})
module.exports = router;