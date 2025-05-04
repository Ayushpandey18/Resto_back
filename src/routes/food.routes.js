import {Router} from "express"
import {addfood,getallfood,updatefood,deletefood, specificfood} from "../controllers/food.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const foodRouter=Router();
foodRouter.route("/add_food").post(upload.single("foodimage"),addfood);
foodRouter.route("/update/:id").put(upload.single("foodimage"),updatefood);
foodRouter.route("/delete-food/:id").delete(deletefood);
foodRouter.route("/get-all-food").get(getallfood);
foodRouter.route("/get-food/:id").get(specificfood);
export  {foodRouter};