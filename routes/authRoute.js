const express = require("express");
const {
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
    //emptyCart,
    //applyCoupon,
    createOrder,
    //getOrders,
    //updateOrderStatus,
    chooseDoc,

    //emptyChannel,
    //createChannel,
    //getChannelList,
    //updateChannelingStatus,
    userprescCart,
    getUserPrescCart,
    emptyPrescCart,
    createPrescOrder,
    getPrescOrders,
    updatePrescOrderStatus,
    getAllOrders,
    getAllChannels,
    //getChannelByUserId,
    //getOrderByUserId,
    removeProductFromCart,
    updateProductQuantityFromCart,
    getUserSelectDoc,
    removeDoctorFromSelectdoc,
    createChannel,
    getMyOrders,
    getMyChannels,
    getMonthWiseOrderIncome,

    getYearlyTotalOrders,
    getSingleOrders,
    getSingleChannels,
    updateOrder,
    updateChannel
} = require("../controller/userCtrl");
const { checkout, paymentVerification, checkoutdoc, paymentVerificationdoc } = require("../controller/paymentCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


const router = express.Router();



router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/channel/checkoutdoc", authMiddleware, checkoutdoc);
router.post("/order/paymentVerification",authMiddleware,paymentVerification);
router.post("/channel/paymentVerification",authMiddleware,paymentVerificationdoc);
router.post("/cartprescription", authMiddleware, userprescCart);
router.post("/selectdoc", authMiddleware, chooseDoc);
//router.post("/cart/applycoupon",authMiddleware,applyCoupon);//
router.post("/cart/create-order", authMiddleware, createOrder)
router.post("/channel/create-channel", authMiddleware, createChannel);
//router.post("/channel/create-channel",authMiddleware,createChannel)
router.post("/cartprescription/create-prescriptionchannel", authMiddleware, createPrescOrder)

router.get("/all-users", getallUser);
router.get("/getmyorders",authMiddleware,getMyOrders);
router.get("/getmychannels",authMiddleware,getMyChannels);
router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);

router.get("/getyearlyorders", authMiddleware, getYearlyTotalOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isAdmin, getSingleOrders);
router.put("/updateOrder/:id", authMiddleware, isAdmin, updateOrder);
//router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.get("/get-prescorders", authMiddleware, getPrescOrders);
//router.get("/get-channels",authMiddleware, getChannelList);
router.get("/getallchannels", authMiddleware, isAdmin, getAllChannels);
router.get("/getaChannel/:id", authMiddleware, isAdmin, getSingleChannels);
router.put("/updateChannel/:id", authMiddleware, isAdmin, updateChannel);
//router.post("/getchannelbyuser/:id", authMiddleware, isAdmin, getChannelByUserId);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/cartprescription", authMiddleware, getUserPrescCart);
router.get("/selectdoc", authMiddleware, getUserSelectDoc);
router.get("/:id", authMiddleware, isAdmin, getaUser);




//router.delete("/empty-cart",authMiddleware,emptyCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantiy", authMiddleware, updateProductQuantityFromCart);
//router.delete("/empty-selectdoc",authMiddleware,emptyChannel);
router.delete("/delete-doctor-selectdoc/:selectdocItemId", authMiddleware, removeDoctorFromSelectdoc);
router.delete("/empty-cartprescription", authMiddleware, emptyPrescCart);
router.delete("/:id", deleteaUser);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
//router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus);
//router.put("/channel/update-channel/:id",authMiddleware,isAdmin,updateChannelingStatus);
router.put("/Prescription-order/update-order/:id", authMiddleware, isAdmin, updatePrescOrderStatus);



module.exports = router;