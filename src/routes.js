const express = require('express');
const UserController = require('./controllers/UserController');
const AdviceController = require('./controllers/AdviceController');
const { checkIfAuthenticated } = require('./middleware/auth');

const routes = express.Router();

routes.get('/user/create', checkIfAuthenticated, UserController.getCreatedAdvice);
routes.get('/user/save', checkIfAuthenticated, UserController.getSavedAdvice);
routes.post('/user/auth', UserController.login);
routes.put('/user/auth', UserController.signUp);

routes.post('/advice/:adviceId', checkIfAuthenticated, AdviceController.actionManager);
routes.post('/advice/', checkIfAuthenticated, AdviceController.store);
routes.delete('/advice/:adviceId', checkIfAuthenticated, AdviceController.remove);
routes.get('/advice', checkIfAuthenticated, AdviceController.get);

module.exports = routes;
