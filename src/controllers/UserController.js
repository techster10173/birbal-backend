const { userSchema: User, adviceSchema: Advice} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Types } = require('mongoose');

async function signUp(req, res) {
  try {
    const { email, password } = req.body;
    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(401).json(userExists);
    }

    const encryptedUserPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: encryptedUserPassword })

    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);

    return res
    .json({
      token
    })
  } catch(error){
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not exists' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);

    return res.json({
      token
    })
  } catch(error){
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getCreatedAdvice(req, res) {
  // Get all advices created by the user
  const { authId } = req;
  const { limit, offset } = req.query;

  try {
    const advices = await Advice.find({ creator: Types.ObjectId(authId) }, ["advice", "_id"]).skip(offset * limit).limit(limit);
  
    return res.json(advices);
  
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSavedAdvice(req, res) {
  const { authId } = req;
  const { limit, offset } = req.query;

  try {
    const userWithAdvice = await User.findById(authId).populate({
      path: 'saves',
      select: ['advice', '_id'],
      options: {
        skip: offset * limit,
        limit,
      }
    });
    return res.json(userWithAdvice?.saves || []);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signUp,
  login,
  getSavedAdvice,
  getCreatedAdvice,
};
