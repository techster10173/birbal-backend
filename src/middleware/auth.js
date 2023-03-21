const { initializeApp } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
const { getAuth } = require('firebase-admin/auth')
const adminCredential = require('../../admin.json');

const app = initializeApp({
  credential: credential.cert(adminCredential),
});

const checkIfAuthenticated = async (req, res, next) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  try{
    const user = await getAuth(app).verifyIdToken(authToken);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.firebaseId = user.uid;

    if(user.appId){
      req.authId = user.appId;
    }
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({error});
  }
};

module.exports = {
  checkIfAuthenticated,
}