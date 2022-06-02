//models
const { Category } = require('../models/categoryModel');
const { User } = require('../models/userModel');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll();

  res.status(200).json({ categories });
});

const postCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { sessionUser } = req;

  if (name.length === 0) {
    return next(new AppError('Name category cannot be empty', 400));
  }

  const newCategory = await Category.create({
    name,
  });

  res.status(200).json({ status: 'Category has been created', newCategory });

  sessionUser.id;
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newName } = req.body;

  const category = await Category.findOne({ where: { id, status: 'active' } });

  if (!category) {
    return next(new AppError('Category not exist', 404));
  }

  if (newName.length === 0) {
    return next(new AppError('New name category cannot be empty', 400));
  }

  await category.update({ name: newName });

  res.status(200).json({
    status: 'Category has been updated with new category name',
    category,
  });
});

module.exports = { getAllCategories, postCategory, updateCategory };
