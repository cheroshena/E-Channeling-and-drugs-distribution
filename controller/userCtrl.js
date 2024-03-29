const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const SelectDoc = require('../models/selectDocModel');
const Channel = require('../models/channelDocModel');
const Doctor = require('../models/doctorModel');
const CartPresc = require("../models/cartPrecsModel");
const OrderPresc = require("../models/orderPrescModel");
const Prescription = require("../models/prescriptionModel")



const uniqid = require('uniqid');
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { response } = require("express");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { exec } = require("child_process");




//Create User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists!!");
    }

});

//Login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });

    } else {
        throw new Error("Invalid Credentials");
    }

});

//Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken,
        },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });

    } else {
        throw new Error("Invalid Credentials");
    }

});


//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh Token present in Db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });

});

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //forbidden

});

//Update a User
const updatedUser = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true,
            }
        );
        res.json(updatedUser);

    } catch (error) {
        throw new Error(error);
    }
});

//Save User Address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        },
            {
                new: true,
            }
        );
        res.json(updatedUser);

    } catch (error) {
        throw new Error(error);
    }

});

//Get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers);

    }
    catch (error) {
        throw new Error(error)
    }
});

//Get a one User
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        });

    } catch (error) {
        throw new Error(error);
    }
});

//Delete a User
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });

    } catch (error) {
        throw new Error(error);
    }
});

//block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockusr);

    } catch (error) {
        throw new Error(error);
    }
});

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Unblocked!",
        });

    } catch (error) {
        throw new Error(error);
    }
});

//Update Password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        user.passwordChangedAt = Date.now();
        const resetToken = await user.createPasswordResetToken();
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

//Forgot Password
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now.<a href="http://localhost:3000/reset-password/${token}">Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);

    }
    catch (error) {
        throw new Error(error);
    }

});

//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//get wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);

    } catch (error) {
        throw new Error(error);
    }
});

//User Add to Cart
const userCart = asyncHandler(async (req, res) => {
    const { productId, quantity, price } = req.body;

    const { _id } = req.user;

    validateMongoDbId(_id);
    try {

        let newCart = await new Cart({
            userId: _id,
            productId,
            price,
            quantity
        }).save();
        res.json(newCart);
    }
    catch (error) {
        throw new Error(error);
    }
});

//Get User Cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id }).populate("productId");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

//remove Product From Cart
const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongoDbId(_id);
    try {
        const deleteProductFromCart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
        res.json(deleteProductFromCart);
    } catch (error) {
        throw new Error(error);
    }
})

//Update Product Quantity
const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantiy } = req.params;
    validateMongoDbId(_id);
    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId })
        cartItem.quantity = newQuantiy
        cartItem.save()
        res.json(cartItem);
    } catch (error) {
        throw new Error(error);
    }
})

//create order
const createOrder = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        totalPrice,
        totalPriceAfterDiscount,
        paymentInfo
    } = req.body;
    const { _id } = req.user;
    try {
        const order = await Order.create({
            shippingInfo,
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            paymentInfo,
            user: _id
        })
        res.json({
            order,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})

//create Channel
const createChannel = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        totalPrice,
        totalPriceAfterDiscount,
        paymentInfo
    } = req.body;
    const { _id } = req.user;
    try {
        const channel = await Channel.create({
            shippingInfo,
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            paymentInfo,
            user: _id
        })
        res.json({
            channel,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})

//get own order list
const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const orders = await Order.find({ user: _id }).populate("user").populate("orderItems.product")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//get own order list
const getAllOrders = asyncHandler(async (req, res) => {

    try {
        const orders = await Order.find().populate("user")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//get single order
const getSingleOrders = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const orders = await Order.findOne({ _id: id }).populate("orderItems.product")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//Update status in single order
const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const orders = await Order.findById(id)
        orders.orderStatus=req.body.status;
        await orders.save()
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//update channel status
const updateChannel = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const orders = await Channel.findById(id)
        orders.orderStatus=req.body.status;
        await orders.save()
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//get single Channel
const getSingleChannels = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const orders = await Channel.findOne({ _id: id }).populate("orderItems.doctor")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})


//get own Channel list
const getMyChannels = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const orders = await Channel.find({ user: _id }).populate("user").populate("orderItems.doctor")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//get own Channel list
const getAllChannels = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const orders = await Channel.find().populate("user")
        res.json({
            orders
        })
    } catch (error) {
        throw new Error(error)
    }
})

//Graph Chart Order income
const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date();
    let endDate = "";
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1)
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear()


    }
    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        }, {
            $group: {
                _id: {
                    month: "$month"
                }, amount: { $sum: "$totalPriceAfterDiscount" }, count: { $sum: 1 }

            }
        }
    ])
    res.json(data)
})





//Total Orders in year 
const getYearlyTotalOrders = asyncHandler(async (req, res) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date();
    let endDate = "";
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1)
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear()


    }
    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        }, {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$totalPriceAfterDiscount" }

            }
        }
    ])
    res.json(data)
})


//Empty Cart////////////////////////////////////////////////////////////////////////////
/* Comment on
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id })
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

//Apply Coupon 
const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate("products.product");
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true });
    res.json(totalAfterDiscount)

});

//createOrder
const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        if (!COD) throw new Error("Create cash order faild");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmout = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount;
        } else {
            finalAmout = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmout,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });

    } catch (error) {
        throw new Error(error);
    }
});

//Get Order List
const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userorders = await Order.findOne({ orderby: _id }).populate("products.product").populate("orderby").exec();
        res.json(userorders);

    } catch (error) {
        throw new Error(error);
    }
});

//Get all order admin
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find().populate("products.product").populate("orderby").exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all order by User Id//////////////////////////////////////////////////////////////////
const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const userorders = await Order.findOne({ orderby: id }).populate("products.product").populate("orderby").exec();
        res.json(userorders);

    } catch (error) {
        throw new Error(error);
    }
});

//Update Order 
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }

});
*/
///////User Choose doctor for channeling
const chooseDoc = asyncHandler(async (req, res) => {
    const { doctorId, quantity } = req.body;

    const { _id } = req.user;

    validateMongoDbId(_id);
    try {

        let newChodos = await new SelectDoc({
            userId: _id,
            doctorId,
            quantity
        }).save();
        res.json(newChodos);
    }
    catch (error) {
        throw new Error(error);
    }
});

//Get channel and View 
const getUserSelectDoc = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const chodos = await SelectDoc.find({ userId: _id }).populate("doctorId");
        res.json(chodos);
    } catch (error) {
        throw new Error(error);
    }
});

//remove the select doctors in slect doctor page
const removeDoctorFromSelectdoc = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { selectdocItemId } = req.params;
    validateMongoDbId(_id);
    try {
        const deleteDoctorFromSelectdoc = await SelectDoc.deleteOne({ userId: _id, _id: selectdocItemId })
        res.json(deleteDoctorFromSelectdoc);
    } catch (error) {
        throw new Error(error);
    }
})

///////////////Empty Channel///////////////////////////////////////////////////////
/*const emptyChannel = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const chodos = await SelectDoc.findOneAndRemove({ orderby: user._id })
        res.json(chodos);
    } catch (error) {
        throw new Error(error);
    }
});

//Create Channel
const createChannel = asyncHandler(async (req, res) => {
    const { COD } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        if (!COD) throw new Error("Your channeling faild");
        const user = await User.findById(_id);
        let userChannel = await SelectDoc.findOne({ orderby: user._id });


        let newOrder = await new Channel({
            doctors: userChannel.doctors,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                channelingNo: "Processing",
                status: "Processing",
                created: Date.now(),

            },
            orderby: user._id,
            orderStatus: "Processing",
            channelNo: "Processing",
        }).save();
        let update = userChannel.doctors.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.doctor._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Doctor.bulkWrite(update, {});
        res.json({ message: "success" });


    } catch (error) {
        throw new Error(error);
    }
});

//Get Channel List
const getChannelList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userchannels = await Channel.findOne({ orderby: _id }).populate("doctors.doctor").populate("orderby").exec();
        res.json(userchannels);

    } catch (error) {
        throw new Error(error);
    }
});

//Get all order admin
const getAllChannels = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Channel.find().populate("doctors.doctor").populate("orderby").exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all order by User Id
const getChannelByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const userchannels = await Channel.findOne({ orderby: id }).populate("doctors.doctor").populate("orderby").exec();
        res.json(userchannels);

    } catch (error) {
        throw new Error(error);
    }
});

//Update Channeling Status 
const updateChannelingStatus = asyncHandler(async (req, res) => {
    const { status, channelingNo } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateChannelingStatus = await Channel.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                channelNo: channelingNo,
                paymentIntent: {
                    status: status,
                    channelingNo: channelingNo,
                },
            },
            { new: true }
        );
        res.json(updateChannelingStatus);
    } catch (error) {
        throw new Error(error);
    }

});*/
//////////////////////////////////////////////////////////////////////////////////////////

//user add to cart his prescription
const userprescCart = asyncHandler(async (req, res) => {
    const { cartpresc } = req.body;

    const { _id } = req.user;

    validateMongoDbId(_id);
    try {
        let prescriptions = []
        const user = await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart = await CartPresc.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cartpresc.length; i++) {
            let object = {};
            object.prescription = cartpresc[i]._id;
            object.count = cartpresc[i].count;
            prescriptions.push(object);
        }
        let newCart = await new CartPresc({
            prescriptions,

            orderby: user?._id,
        }).save();
        res.json(newCart);
    }
    catch (error) {
        throw new Error(error);
    }
});

//Get User Prescription Cart
const getUserPrescCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const prescriptioncart = await CartPresc.findOne({ orderby: _id }).populate("prescriptions.prescription");
        res.json(prescriptioncart);
    } catch (error) {
        throw new Error(error);
    }
});

//Empty Prescription Cart
const emptyPrescCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const prescriptioncart = await CartPresc.findOneAndRemove({ orderby: user._id })
        res.json(prescriptioncart);
    } catch (error) {
        throw new Error(error);
    }
});

//create Prescription Order
const createPrescOrder = asyncHandler(async (req, res) => {
    const { COD } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        if (!COD) throw new Error("Your Prescription Order faild");
        const user = await User.findById(_id);
        let userPrescCart = await CartPresc.findOne({ orderby: user._id });


        let newOrder = await new OrderPresc({
            prescriptions: userPrescCart.prescriptions,
            paymentIntent: {
                id: uniqid(),
                method: "COD",

                status: "Processing",
                created: Date.now(),

            },
            orderby: user._id,
            orderStatus: "Processing",

        }).save();
        let update = userPrescCart.prescriptions.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.prescription._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Prescription.bulkWrite(update, {});
        res.json({ message: "success" });


    } catch (error) {
        throw new Error(error);
    }
});

//Get Order List
const getPrescOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userprescorders = await OrderPresc.findOne({ orderby: _id }).populate({
            path: "prescriptions.prescription",
            model: "Prescription",
        })
            .exec();
        res.json(userprescorders);

    } catch (error) {
        throw new Error(error);
    }
});

//Update Order 
const updatePrescOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateOrderStatus = await OrderPresc.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }

});

module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    chooseDoc,
    getUserSelectDoc,
    userprescCart,
    getUserPrescCart,
    emptyPrescCart,
    createPrescOrder,
    getPrescOrders,
    updatePrescOrderStatus,
    removeProductFromCart,
    updateProductQuantityFromCart,
    removeDoctorFromSelectdoc,
    createOrder,
    createChannel,
    getMyOrders,
    getMyChannels,
    getMonthWiseOrderIncome,
    getYearlyTotalOrders,
    getAllOrders,
    getAllChannels,
    getSingleOrders,
    getSingleChannels,
    updateOrder,
    updateChannel,
};