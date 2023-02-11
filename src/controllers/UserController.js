const { userSchema: User, adviceSchema: Advice} = require('../models');

async function store(req, res) {
  try {
    const { authId } = req;
    const userExists = await User.exists({ authId });

    if (userExists) {
      return res.json(userExists);
    }

    const user = await User.create({ authId })

    return res.json(user);
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
    const user = await User.exists({ authId });
    if(!user) return res.status(400).json({ error: 'User not exists' });
  
    const advices = await Advice.find({ creator: user._id }).limit(limit).skip(offset);
  
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
    const userWithAdvice = await User.findOne({authId}).populate('saves').limit(limit).skip(offset);
    return res.json(userWithAdvice.saves);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  store,
  getSavedAdvice,
  getCreatedAdvice,
};
