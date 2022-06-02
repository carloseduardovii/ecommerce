const express = require('express');

//controllers
const {
  getAllCategories,
  postCategory,
  updateCategory,
} = require('../controllers/categoriesController');

//middlewares
const { protectToken, admin } = require('../middlewares/usersMiddlewares');

const router = express.Router();

router.route('/').get(getAllCategories);

router.use(protectToken);

router.route('/').post(admin, postCategory);
router.route('/:id').patch(admin, updateCategory);

module.exports = { categoriesRouter: router };
