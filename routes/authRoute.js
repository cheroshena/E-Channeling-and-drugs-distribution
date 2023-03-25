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
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    chooseDoc,
    getUserChannel,
    emptyChannel,
    createChannel,
    getChannelList,
    updateChannelingStatus,
} = require("../controller/userCtrl");
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");

const router = express.Router();



router.post("/register",createUser);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword);

router.put("/password",authMiddleware,updatePassword);

router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.post("/cart",authMiddleware,userCart);
router.post("/channel",authMiddleware,chooseDoc);
router.post("/cart/applycoupon",authMiddleware,applyCoupon);
router.post("/cart/cash-order",authMiddleware,createOrder)
router.post("/channel/create-channel",authMiddleware,createChannel)

router.get("/all-users",getallUser);
router.get("/get-orders",authMiddleware,getOrders);
router.get("/get-channels",authMiddleware, getChannelList);
router.get("/refresh", handleRefreshToken);
router.get("/logout",logout);
router.get("/wishlist",authMiddleware, getWishlist);
router.get("/cart",authMiddleware, getUserCart);
router.get("/channel",authMiddleware, getUserChannel);
router.get("/:id",authMiddleware,isAdmin,getaUser);


router.delete("/empty-cart",authMiddleware,emptyCart);
router.delete("/empty-channel",authMiddleware,emptyChannel);
router.delete("/:id",deleteaUser);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware,saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus);
router.put("/channel/update-channel/:id",authMiddleware,isAdmin,updateChannelingStatus);



module.exports = router;