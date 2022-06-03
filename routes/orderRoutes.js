const express = require('express');

//controller
const {
  getUserOrders,
  getUserOrderId,
} = require('../controllers/userController');

//middlewares
const { protectToken, vendor } = require('../middlewares/usersMiddlewares');

const router = express.Router();

router.use(protectToken);

router.route('/').get(getUserOrders);
router.route('/:id').get(getUserOrderId);

module.exports = { ordersRouter: router };
