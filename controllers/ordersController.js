//models
const { Product } = require('../models/productModel');
const { inCart } = require('../models/productInCart');
const { Cart } = require('../models/cartModel');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await Cart.findAll({
    where: { status: 'active' },
    include: [
      {
        model: inCart,
        attributes: ['productId', 'quantity'],
        include: [
          { model: Product, attributes: ['title', 'description', 'price'] },
        ],
      },
    ],
  });

  res.status(200).json({ carts });
});

const postProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const { sessionUser } = req;

  // Validate that the productp has enough stock for the cart
  const product = await Product.findOne({ where: { id: productId } });

  if (!product) {
    return next(new AppError('Product not found un your order', 404));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(
        `There are only ${product.quantity} units of this product available`,
        400
      )
    );
  }

  // Fetch current active cart, if it doesn't exist, create a new one
  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  // Create new cart if it doesn't exist
  if (!cart) {
    const newCart = await Cart.create({ userId: sessionUser.id });

    // Add product to the cart
    await inCart.create({ cartId: newCart.id, productId, quantity });
  } else {
    // User already has a cart
    // Validate if product already exists in the cart
    const productInCart = await inCart.findOne({
      where: { cartId: cart.id, productId, status: 'active' },
    });

    // Send error if it exists
    if (productInCart) {
      return next(
        new AppError('This product already exists in your order', 400)
      );
    }

    // Add product to current cart
    await inCart.create({ cartId: cart.id, productId, quantity });
  }

  res.status(201).json({ status: 'Your product has been added successfully' });
});

const patchProductToCart = catchAsync(async (req, res, next) => {
  const { productId, newQuantity } = req.body;
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: 'active' },
    userId: sessionUser.id,
  });

  if (!cart) {
    return next(new AppError('', 400));
  }

  const productInCart = await inCart.findOne({
    where: { status: 'active', cartId: cart.id, productId },
    include: [{ model: Product }],
  });

  if (!productInCart) {
    return next(new AppError('This product not exists in your cart', 404));
  }

  if (newQuantity < 0 || newQuantity > productInCart.product.quantity) {
    return next(new AppError(`${productInCart.product.quantity}`, 400));
  }

  if (newQuantity === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  } else if (newQuantity > 0) {
    await productInCart.update({ quantity: newQuantity });
  }

  res.status(200).json({ status: 'success' });
});

const postPurchaseCart = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success' });
});

const deleteProductFromCart = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllCarts,
  postProductToCart,
  patchProductToCart,
  postPurchaseCart,
  deleteProductFromCart,
};
