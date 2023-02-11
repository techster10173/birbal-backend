const {adviceSchema: Advice, userSchema: User} = require('../models');
const axios = require('axios').default;
const { Types } = require('mongoose');

async function actionManager(req, res){
    const { action } = req.query;
    switch (action) {
        case 'like':
            return like(req, res);
        case 'dislike':
            return dislike(req, res);
        case 'save':
            return save(req, res);
        case 'report':
            return report(req, res);
        case 'unsave':
            return unsave(req, res);
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}

async function like(req, res) {
    const authId = req.authId;
    const { adviceId } = req.params;

    try {
        const advice = await Advice.exists({_id: Types.ObjectId(adviceId)});

        if (!advice) {
            return res.status(400).json({ error: 'Advice not exists' });
        }
    
        await User.findOneAndUpdate({authId}, {
            $push: {
                likes: advice._id,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.json({
        message: "Advice liked",
    });
}

async function dislike(req, res) {
    const authId = req.authId;
    const { adviceId } = req.params;

    try {
        const advice = await Advice.exists({_id: Types.ObjectId(adviceId)});

        if (!advice) {
            return res.status(400).json({ error: 'Advice not exists' });
        }
    
        await User.findOneAndUpdate({authId}, {
            $push: {
                dislikes: advice._id,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.json({
        message: "Advice disliked",
    });
}

async function save(req, res) {
    const authId = req.authId;
    const { adviceId } = req.params;

    try {
        const advice = await Advice.exists({_id: Types.ObjectId(adviceId)});

        if (!advice) {
            return res.status(400).json({ error: 'Advice not exists' });
        }
    
        await User.findOneAndUpdate({authId}, {
            $push: {
                saves: advice._id,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.json({
        message: "Advice saved",
    });
}

async function unsave(req, res) {
    const authId = req.authId;
    const { adviceId } = req.params;

    try {
        const advice = await Advice.exists({_id: Types.ObjectId(adviceId)});

        if (!advice) {
            return res.status(400).json({ error: 'Advice not exists' });
        }
    
        await User.findOneAndUpdate({authId}, {
            $pull: {
                saves: advice._id,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.json({
        message: "Advice unsaved",
    });
}

async function store(req, res) {
    const { advice } = req.body;
    const authId = req.authId;

    try {
        const loggedUser = await User.findOne({authId});

        await Advice.create({
            advice,
            creator: loggedUser._id,
            origin: 'BIRBAL',
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Advice created' });
}

async function remove(req, res) {
    const authId = req.authId;
    const { adviceId } = req.params;

    const adviceIdObject = Types.ObjectId(adviceId);

    try{
        const user = await User.findOne({authId})
        await Advice.findOneAndDelete({ _id: adviceIdObject, creator: user._id });

        await User.updateMany({
            $pull: {
                likes: adviceIdObject,
                saves: adviceIdObject,
                dislikes: adviceIdObject,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Advice deleted' });
}

async function get(req, res) {
    const { authId } = req;

    try {
        const loggedUser = await User.findOne({authId});

        // const totalUsers = await User.count();
        const adviceCount = await Advice.count();
        const random = Math.floor(Math.random() * adviceCount)
    
        const advice = await Advice.findOne({
          
          $and: [
            { _id: { $nin: loggedUser.saves } },
            { _id: { $nin: loggedUser.likes } },
            { _id: { $nin: loggedUser.dislikes } },
            // {reports: { $size: { $lt: totalUsers * 0.95 }}},
          ],
        }).skip(random);

        if(advice && advice.length !== 0) return res.json(advice);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    

    try {
        const slipObj = await axios.get('https://api.adviceslip.com/advice');
        const { slip } = slipObj.data;

        const newAdvice = {
            advice: slip.advice,
            origin: 'EXTERNAL',
            externalAdviceId: slip.id,
        }

        await Advice.create(newAdvice);

        return res.json(newAdvice);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function report(req, res) {
    const { adviceId } = req.params;
    const { authId } = req;

    try{
        const user = await User.findOne({ authId });

        await Advice.findByIdAndUpdate(adviceId, {
            $push: { reports:  user._id},
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ message: 'Advice reported' });
}

module.exports = {
    store,
    actionManager,
    remove,
    get,
    report,
};

