import {Router} from "express"
import {registerUser,
    loginUser,
    logoutuser,
    refreshAccessToken,
    changeCurrentPassword,
    getcurrentuser,
    getordrerhistory} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/Auth.middleware.js";
const userRouter=Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
    userRouter.route("/logout").post(verifyJWT,logoutuser);
    userRouter.route("/refresh-token").post(refreshAccessToken);
    userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
    userRouter.route("/current-user").get(verifyJWT,getcurrentuser)
    userRouter.route("/order-history").get(verifyJWT,getordrerhistory)
export default userRouter;