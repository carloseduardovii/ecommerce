//bookstores

//models
const { Product } = require('../models/productModel');
const { Category } = require('../models/categoryModel');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const postProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity, categoryId } = req.body;
  const { sessionUser } = req;

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    categoryId,
    userId: sessionUser.id,
  });

  res
    .status(201)
    .json({ status: 'Product have been created successfully', newProduct });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    include: [{ model: Category, attributes: ['id', 'name'] }],
  });

  res.status(201).json({ products });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const product = await Product.findOne({ where: { id } });

  sessionUser.id;

  res.status(200).json({ product });
});

const patchProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price, quantity } = req.body;

  const product = await Product.findOne({ where: { id } });

  await product.update({ title, description, price, quantity });

  res
    .status(200)
    .json({ status: 'Product have been updated successfully', product });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id } });

  await product.update({ status: 'deactived' });

  res
    .status(200)
    .json({ status: 'Product have been deleted successfully', product });
});

module.exports = {
  postProduct,
  getAllProducts,
  getProductById,
  patchProduct,
  deleteProduct,
};
