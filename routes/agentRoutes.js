const express = require('express');
const router = express.Router();
const agentContoller = require('../controllers/agentController')

router.get('/login',agentContoller.getLogin)

router.post('/login',agentContoller.postLogin);

router.get('/', agentContoller.getAgenthome);

router.post('/update/:propertyId', agentContoller.postUpdateProperty);


module.exports = router;