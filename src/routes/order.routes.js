import { Router } from "express";
import { 
    createorder, 
    updateorderstatus, 
    getpendingorders, 
    specificorders, 
    verifyPayment 
} from "../controllers/order.controller.js";
import verifyJWT from "../middlewares/Auth.middleware.js";

const orderRouter = Router();

// Payment Verification
orderRouter.post("/verify-payment", verifyPayment);

// Order Placement (Protected)
orderRouter.post("/placeorder", verifyJWT, createorder);

// Update Order Status (Protected)
orderRouter.put("/update-order-status", verifyJWT, updateorderstatus);

// Get Pending Orders
orderRouter.get("/get-pending-orders", getpendingorders);

// Get Specific Order by ID
orderRouter.get("/get-specific-order/:id", specificorders);

export default orderRouter;
