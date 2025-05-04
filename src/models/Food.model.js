import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const foodSchema = new Schema({
        foodphoto:{
            type: String,
            required:true
        },
        title:{
            type: String,
            required:true
        },
        description:{
            type: String, 
            required:true,
        },
        price:{
            type: Number,
            required:true
        },
        category:{
            type: String,
            required:true
        },
},{timestamps: true});
foodSchema.plugin(mongooseAggregatePaginate)
export const Food=mongoose.model("Food",foodSchema)