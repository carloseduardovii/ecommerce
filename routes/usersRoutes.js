const express = require('express');
const { body } = require('express-validator');

// Middlewares
const {
  protectToken,
  admin,
  vendor,
  userExists,
  protectAccountOwner,
} = require('../middlewares/usersMiddlewares');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

// Controller
const {
  getAllUsers,
  getUserById,
  postUser,
  login,
  getUserProducts,
  patchUserId,
  deleteUserId,
  getUserOrders,
  getUserOrderId,
  checkToken,
} = require('../controllers/userController');

//utils
const { upload } = require('../utils/multer');

const router = express.Router();

router
  .route('/')
  .post(
    upload.single('profileImg'),
    createUserValidations,
    checkValidations,
    postUser
  );

router.post('/login', login);

// Apply protectToken middleware
//router.use(protectToken);

router.route('/').get(getAllUsers);
router.route('/:id').get(getUserById);
router.route('/me').get(vendor, getUserProducts);
router.route('/orders').get(getUserOrders);

router
  .route('/:id')
  .get(userExists, getUserById)
  .patch(userExists, protectAccountOwner, patchUserId)
  .delete(userExists, protectAccountOwner, deleteUserId);

router.route('/orders/:id').get(getUserOrderId);

router.get('/check-token', checkToken);

module.exports = { usersRouter: router };
