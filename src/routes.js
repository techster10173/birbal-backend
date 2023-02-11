const express = require('express');
const UserController = require('./controllers/UserController');
const AdviceController = require('./controllers/AdviceController');
const { checkIfAuthenticated } = require('./middleware/auth');

const routes = express.Router();
routes.use(checkIfAuthenticated)

routes.get('/user/create', UserController.getCreatedAdvice);
routes.get('/user/save', UserController.getSavedAdvice);
routes.post('/user', UserController.store);

routes.post('/advice/:adviceId', AdviceController.actionManager);
routes.post('/advice', AdviceController.store);
routes.delete('/advice/:adviceId', AdviceController.remove);
routes.get('/advice/', AdviceController.get);

module.exports = routes;
