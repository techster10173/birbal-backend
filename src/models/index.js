const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firebaseId: {
    type: String,
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Advice',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Advice',
  }],
  saves: [{
    type: Schema.Types.ObjectId,
    ref: 'Advice',
  }],
}, {
  timestamps: true,
});

const AdviceSchema = new Schema({
  advice: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  origin: {
    type: String,
    enum: ['BIRBAL', 'EXTERNAL'],
    default: 'BIRBAL',
    required: true,
  },
  externalAdviceId: {
    type: String,
  },
}, {
  timestamps: true,
});


module.exports = {
  userSchema: model('User', UserSchema),
  adviceSchema: model('Advice', AdviceSchema)
}
