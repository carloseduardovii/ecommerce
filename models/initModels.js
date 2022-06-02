//models
const { User } = require('./userModel');
const { Cart } = require('./cartModel');
const { Category } = require('./categoryModel');
const { Order } = require('./orderModel');
const { ProductImg } = require('./productImg');
const { inCart } = require('./productInCart');
const { Product } = require('./productModel');

// Establish your models relations inside this function
const initModels = () => {
  //1 User ==> many Product
  User.hasMany(Product);
  Product.belongsTo(User);

  //1 User ==> many Order
  User.hasMany(Order);
  Order.belongsTo(User);

  //1 User ==> 1 Cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  //1 Product ==> many productImg
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  //1 Category ==> 1 Product
  Category.hasOne(Product);
  Product.belongsTo(Category);

  //1 Cart ==> many inCart
  Cart.hasMany(inCart);
  inCart.belongsTo(Cart);

  //1 Product ==> 1 inCart
  Product.hasOne(inCart);
  inCart.belongsTo(Product);

  //1 Order ==> 1 Cart
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };
