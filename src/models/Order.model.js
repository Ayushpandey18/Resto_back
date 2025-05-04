import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const OrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});
const OrderSchema = new mongoose.Schema({
   orderedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true }); 
OrderSchema.plugin(mongooseAggregatePaginate)
export  const Order = mongoose.model('Order', OrderSchema);