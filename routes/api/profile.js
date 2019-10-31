const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// @route   GET api/profile/me
// @desc    Route to get current user's profile
// @access  Private
router.get("/me", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["name", "avatar"]);
        console.log(profile);
        if (!profile) {
            return res.status(400).json({
                msg: "There is no profile for this user",
            });
        }
        res.json(profile);
    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
    "/", [
        auth, [
            check("status", "Status is required")
            .not()
            .isEmpty(),
            check("skills", "Skills are required")
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

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({
                user: req.user.id,
            });
            if (profile) {
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id,
                }, {
                    $set: profileFields,
                }, {
                    new: true,
                });
                return res.json(profile);
            }

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async(req, res) => {
    try {
        const profiles = await Profile.find().populate("user", [
            "firstname",
            "lastname",
            "avatar",
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["firstname", "lastname", "avatar"]);

        if (!profile)
            return res.status(400).json({
                msg: "Profile not found",
            });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                msg: "Profile not found",
            });
        }
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private

router.delete("/", auth, async(req, res) => {
    try {
        //Mark Posts as User Deleted
        await Post.updateMany({ user: req.user.id }, { userdeleted: true });

        //Remove Profile
        await Profile.findOneAndRemove({
            user: req.user.id,
        });

        //Remove User
        await User.findOneAndRemove({
            _id: req.user.id,
        });
        res.json({
            msg: "User deleted",
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/profile/experience
// @desc    Add profile Experience
// @access  Private

router.put(
    "/experience", [
        auth, [
            check("title", "Title is required")
            .not()
            .isEmpty(),
            check("company", "Company is required")
            .not()
            .isEmpty(),
            check("from", "From is required")
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

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            });
            console.log(profile);
            profile.experience.unshift(newExp);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   PUT api/profile/experience/:exp_id
// @desc    Update profile Experience
// @access  Private

router.put(
    "/experience/:exp_id", [
        auth, [
            check("title", "Title is required")
            .not()
            .isEmpty(),
            check("company", "Company is required")
            .not()
            .isEmpty(),
            check("from", "From is required")
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

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const updExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            let exp = await Profile.findOneAndUpdate({
                user: req.user.id,
                "experience._id": req.params.exp_id,
            }, {
                $set: {
                    "experience.$.title": title,
                    "experience.$.company": company,
                    "experience.$.location": location,
                    "experience.$.from": from,
                    "experience.$.to": to,
                    "experience.$.current": current,
                    "experience.$.description": description,
                },
            });

            if (!exp) {
                return res.status(404).send("Not FOund");
            } else {
                return res.status(200).send(exp);
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete user experience
// @access  Private
router.delete("/experience/:exp_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/profile/education
// @desc    Add profile Education
// @access  Private

router.put(
    "/education", [
        auth, [
            check("school", "School is required")
            .not()
            .isEmpty(),
            check("degree", "Degree is required")
            .not()
            .isEmpty(),
            check("fieldofstudy", "Field of Study is required")
            .not()
            .isEmpty(),
            check("from", "From is required")
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

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            });
            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   PUT api/profile/education/:edu_id
// @desc    Update profile Education
// @access  Private

router.put(
    "/education/:edu_id", [
        auth, [
            check("school", "School is required")
            .not()
            .isEmpty(),
            check("degree", "Degree is required")
            .not()
            .isEmpty(),
            check("fieldofstudy", "Field of study is required")
            .not()
            .isEmpty(),
            check("from", "From is required")
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

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const updExp = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            let edu = await Profile.findOneAndUpdate({
                user: req.user.id,
                "education._id": req.params.edu_id,
            }, {
                $set: {
                    "education.$.school": school,
                    "education.$.degree": degree,
                    "education.$.fieldofstudy": fieldofstudy,
                    "education.$.from": from,
                    "education.$.to": to,
                    "education.$.current": current,
                    "education.$.description": description,
                },
            });

            if (!edu) {
                return res.status(404).send("Not Found");
            } else {
                return res.status(200).send(edu);
            }
            //await exp.save();
            //res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete user education
// @access  Private
router.delete("/education/:edu_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", async(req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: {
                "user-agent": "node.js",
            },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: "No  Github profile found",
                });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;