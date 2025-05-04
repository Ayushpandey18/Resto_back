import { Order } from '../models/Order.model.js';
import async_Handler  from '../utils/asyncHandler.js'; 
import { Food } from '../models/Food.model.js';
import {User} from '../models/User.model.js'
import { apiresponse } from '../utils/apiresponse.js';
import Razorpay from "razorpay";
import crypto from "crypto";
export const verifyPayment = async_Handler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    // Create HMAC to verify Razorpay signature
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Find the order and update its payment status
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = "Paid";
    order.paymentId = razorpay_payment_id;
    await order.save();

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
    });
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createorder = async_Handler(async (req, res) => {
    try {
        const { items, deliveryAddress } = req.body;
        const userId = req.user._id;

        // Fetch food items
        const foodItems = await Food.find({ '_id': { $in: items.map(item => item.item) } });

        if (!foodItems.length) {
            return res.status(400).json({ success: false, message: "Invalid food items" });
        }

        // Create a food map for lookup
        const foodMap = new Map(foodItems.map(food => [food._id.toString(), food]));

        // Calculate total amount
        const totalAmount = items.reduce((acc, item) => {
            const food = foodMap.get(item.item.toString());
            return food ? acc + (food.price * item.quantity) : acc;
        }, 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid order amount" });
        }

        // Step 1: Create the order in the database
        const order = await Order.create({
            orderedby: userId,
            items,
            totalAmount,
            deliveryAddress,
        });

        // Step 2: Generate Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `order_rcptid_${order._id}`,
        });

        // Step 3: Attach order ID to user history
        await User.findByIdAndUpdate(userId, { $push: { orderHistory: order._id } });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
            razorpayOrder,  // Send Razorpay order details to frontend
        });
    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
const updateorderstatus=async_Handler(async (req,res)=>{
    const { id } = req.params;
        const { status } = req.body; 
        if (!['Pending', 'Shipped', 'Delivered', 'Canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        if (!order) return res.status(404).json({ message: 'Order not found' });

        return res.status(201).json(
            new apiresponse(200,"Order updated successfully",order)
        )
})
const getpendingorders = async_Handler(async (req, res) => {
    const orders = await Order.find({ status: 'Pending' })
        .populate({
            path: 'items.item',
            model: 'Food', 
        });

    if (!orders || orders.length === 0) {
        return res.status(404).json(
            new apiresponse(404, "No pending orders found")
        );
    }

    return res.status(200).json(
        new apiresponse(200, "Pending orders fetched successfully", orders)
    );
});
const specificorders=async_Handler(async (req,res)=>{
    const { id } = req.params
    const orders = await Order.findById(id).populate({
        path: 'items.item',
        model: 'Food', 
    });
    if(!orders){
        return res.status(404).json(
            new apiresponse(404,"order not found")
        )}
        return res.status(201).json(
            new apiresponse(200,"order fetched success",orders)
        )
})
export{
   createorder,
   updateorderstatus,
   getpendingorders,
   specificorders
}
