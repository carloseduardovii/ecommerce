//bookstores
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//models
const { User } = require('../models/userModel');
const { Product } = require('../models/productModel');
const { Order } = require('../models/orderModel');
const { Cart } = require('../models/cartModel');
const { inCart } = require('../models/productInCart');
const { Category } = require('../models/categoryModel');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { storage } = require('../utils/firebase');

dotenv.config({ path: './set.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  res.status(200).json({ users });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //const { user } = req;

  const user = await User.findOne({
    id,
    status: 'active',
  });
  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  user.profileImgUrl = url;

  res.status(200).json({ user });
});

const postUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  //console.log(req.file);

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  console.log(imgUploaded);
  const salt = await bcrypt.genSalt(12);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashPass,
    role,
    profileImgUrl: imgUploaded.metadata.fullPath,
  });

  newUser.password = undefined;

  res.status(200).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'active' } });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError('Your credentials are not valid', 400));

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const getUserProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const userProducts = await Product.findAll({
    where: { userId: sessionUser.id, status: 'active' },
  });

  //sessionUser;

  res.status(200).json({ userProducts });
});

const patchUserId = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { userName, email } = req.body;

  await user.update({ userName, email });

  res.status(200).json({ status: 'User was updated' });
});

const deleteUserId = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deactived' });

  res.status(200).json({ status: 'User was deactived' });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    attributes: ['id', 'totalPrice', 'createdAt'],
    include: [
      {
        model: Cart,
        attributes: ['id', 'status'],
        include: [
          {
            model: inCart,
            attributes: ['quantity', 'status'],
            include: [
              {
                model: Product,
                attributes: ['id', 'title', 'description', 'price'],
                include: [
                  {
                    model: Category,
                    attributes: ['name'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  res.status(200).json({ orders });
});

const getUserOrderId = catchAsync(async (req, res, next) => {
  const { order } = req;
  const { id } = req.params;

  const orderDetail = await Order.findOne({ where: { id, status: 'active' } });

  if (!order) {
    return next(new AppError('Sorry, this order has not found'));
  }

  res.status(200).json({ order, orderDetail });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
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
};
