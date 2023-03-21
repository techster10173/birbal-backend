const express = require('express');
const UserController = require('./controllers/UserController');
const AdviceController = require('./controllers/AdviceController');
const { checkIfAuthenticated } = require('./middleware/auth');

const routes = express.Router();

routes.get('/user/create', checkIfAuthenticated, UserController.getCreatedAdvice);
routes.get('/user/save', checkIfAuthenticated, UserController.getSavedAdvice);
routes.put('/user/auth', checkIfAuthenticated, UserController.signUp);
routes.delete('/user', checkIfAuthenticated, UserController.remove);

routes.post('/advice/:adviceId', checkIfAuthenticated, AdviceController.actionManager);
routes.post('/advice/', checkIfAuthenticated, AdviceController.store);
routes.delete('/advice/:adviceId', checkIfAuthenticated, AdviceController.remove);
routes.get('/advice', checkIfAuthenticated, AdviceController.get);

module.exports = routes;
