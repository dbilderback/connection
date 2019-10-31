const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const post = require("../../models/Post");
const profile = require("../../models/Profile");
const user = require("../../models/User");
const request = require("request");

// @route   Post api/posts
// @desc    Create a post
// @access  Private
router.post(
    "/", [
        auth, [
            check("text", "Text is required")
            .not()
            .isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            console.log(user);
            const newPost = new Post({
                text: req.body.text,
                name: user.firstname + " " + user.lastname,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();

            res.json(post);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   Get api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async(req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1,
        });
        if (!posts) {
            return res.status(404).json({
                msg: "There are no posts",
            });
        }
        return res.send(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   Get api/posts/:id
// @desc    Get all post for a user
// @access  Private
router.get("/:id", auth, async(req, res) => {
    try {
        const posts = await Post.findById(req.params.id);

        if (!posts) {
            return res.status(404).json({
                msg: "There are no posts for this user",
            });
        }
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "There are no posts for this user",
            });
        }
        res.status(500).send("Server Error");
    }
});

// @route   Get api/posts/user/:user_id
// @desc    Get all post for a user
// @access  Private
router.get("/user/:user_id", auth, async(req, res) => {
    try {
        const posts = await Post.find({
            user: req.params.user_id,
        }).sort({
            date: -1,
        });
        if (!posts) {
            return res.status(404).json({
                msg: "There are no posts for this user",
            });
        }
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "There are no posts for this user",
            });
        }
        res.status(500).send("Server Error");
    }
});

// @route   Put api/posts/:post_id
// @desc    Update a post
// @access  Private
router.put(
    "/:post_id", [
        auth, [
            check("text", "Text is required")
            .not()
            .isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            let post = await Post.findOneAndUpdate({
                user: req.user.id,
                _id: req.params.post_id,
            }, {
                text: req.body.text,
            }, {
                new: true,
            });

            if (!post) {
                return res.status(404).send("Not Found");
            } else {
                return res.status(200).send(post);
            }
        } catch (err) {
            console.log(err.message);
            if (err.message === "ObjectId") {
                return res.status(404).json({
                    msg: "Post Not Found",
                });
            }
            res.status(500).send("Server Error");
        }
    }
);

// @route   Delete api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: "Post Not Found",
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json("User Not Authorized");
        }

        await post.remove();
        res.json({
            msg: "Post Deleted",
        });
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "Post Not Found",
            });
        }
        res.send(500).send("Server Error");
    }
});

// @route   Put api/posts/likes/:id
// @desc    Like a post
// @access  Private
router.put("/likes/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0
        ) {
            return res.status(400).json({
                msg: "Post already like",
            });
        }

        post.likes.unshift({
            user: req.user.id,
        });

        await post.save();
        res.send(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "Post Not Found",
            });
        }
        res.send(500).send("Server Error");
    }
});

// @route   Put api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post.likes.filter(like => like.user.toString() === req.user.id).length >
            0
        ) {
            return res.status(400).json({
                msg: "Post has not been liked",
            });
        }

        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();
        res.send(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "Post Not Found",
            });
        }
        res.send(500).send("Server Error");
    }
});

// @route   Post api/posts/comment/:id
// @desc    Create a comment on a post
// @access  Private
router.post(
    "/comment/:id", [
        auth, [
            check("text", "Text is required")
            .not()
            .isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");

            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );
        console.log(comment);
        if (!comment) {
            resturn.res.status(404).json({
                msg: "Comment does not exist",
            });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "User not authorized ",
            });
        }

        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
        console.log(removeIndex);
        post.comments.splice(removeIndex, 1);

        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        if (err.message === "ObjectId") {
            return res.status(404).json({
                msg: "Post Not Found",
            });
        }
        res.send(500).send("Server Error");
    }
});

module.exports = router;