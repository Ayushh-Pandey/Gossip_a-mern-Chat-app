const generateToken = require("../config/generateToken");
const { socketConnect } = require("../config/webSocketConnect");
const User = require("../models/userModel")
const bcrypt = require("bcrypt");

const userSignup = async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: '* feilds are required' })
    }
    const userExists = await User.find({ email: email });

    if (userExists.length > 0) {
        return res.status(400).json({ msg: 'email already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        pic: pic
    });
    await newUser.save();
    const token = generateToken(newUser._id)
    res.status(200).json({ token: token });
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: '* feilds are required' })
    }
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
        return res.status(400).json({ msg: 'wrong email' })
    }

    const match = await bcrypt.compare(password, userFound.password);
    if (!match) {
        return res.status(400).json({ msg: 'wrong password' })
    }
    const token = generateToken(userFound._id)
    
    res.status(200).json({
        _id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        pic: userFound.pic,
        token: token
    })
}

const getAllUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
}

module.exports = { userLogin, userSignup, getAllUsers };