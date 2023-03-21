const { userSchema: User, adviceSchema: Advice} = require('../models');
const { Types } = require('mongoose');
const { auth } = require('firebase-admin')

async function signUp(req, res) {
  try {
    const user = await User.create({firebaseId: req.firebaseId, email: req.body.email})
    auth().setCustomUserClaims(req.firebaseId, { appId: user._id });
    return res.json(user)
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
    const advices = await Advice.find({ creator: new Types.ObjectId(authId) }, ["advice", "_id"]).skip(offset * limit).limit(limit);
  
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

async function remove(req, res) {
  const { authId } = req;

  try {
    await User.findByIdAndDelete(authId);
    return res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signUp,
  getSavedAdvice,
  getCreatedAdvice,
  remove,
};
