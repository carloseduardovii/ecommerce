const { catchAsync } = require('../utils/catchAsync');

const productInCartExist = catchAsync(async (req, res, next) => {
  next();
});

const cartExist = catchAsync(async (req, res, next) => {
  next();
});

const protectProductOwner = catchAsync(async (req, res, next) => {
  next();
});

module.exports = { productInCartExist, cartExist, protectProductOwner };
