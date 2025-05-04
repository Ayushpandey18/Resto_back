import async_Handler from "../utils/asyncHandler.js"
import {Food} from "../models/Food.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiresponse } from "../utils/apiresponse.js"
import mongoose from "mongoose"
const addfood=async_Handler(async(req,res)=>{
    const {title,price,description,category}=req.body
    if([title,price,description,category].some((field)=>field?.trim()==="")){
        return res.status(401).json(
            new apiresponse(401,"All fields are required")
        )
    }
    console.log(req.file)
    const foodLocalPath=req.file?.path
    if(!foodLocalPath){
        return res.status(401).json(
            new apiresponse(401,"Photo upload failed")
        )
    }
    const foodphoto=await uploadOnCloudinary(foodLocalPath)
    if(!foodphoto){
        return res.status(500).json(
            new apiresponse(500,"Photo upload failed")
        )
    }
    const createdfood= await Food.create({
        title,
        price,
        description,
        category,
        foodphoto : foodphoto.url
    })
return res.status(201).json(
    new apiresponse(201,"user created successfully",createdfood)
)
})
const updatefood=async_Handler(async(req,res)=>{
    const {id}=req.params;
    const {title,price,description,category}=req.body
    if([title,price,description,category].some((field)=>field?.trim()==="")){
        return res.status(401).json(
            new apiresponse(401,"All fields are required")
        )
    }
    console.log(req.file)
    const foodLocalPath=req.file?.path
    if(!foodLocalPath){
        return res.status(401).json(
            new apiresponse(401,"Photo upload failed")
        )
    }
    const foodphoto=await uploadOnCloudinary(foodLocalPath)
    if(!foodphoto){
        return res.status(500).json(
            new apiresponse(500,"Photo upload failed")
        )
    }
    const result = await Food.findByIdAndUpdate(id, req.body, {
        new: true 
     });
     if (!result) {
        return response.status(404).json(new apiresponse(404, "Item not found"));
    }
return res.status(201).json(
    new apiresponse(201,"user created successfully",result)
)
})
const getallfood=async_Handler(async(req,res)=>{
    const food = await Food.find({});
    if (!food) {
        return res.status(404).json(new apiresponse(404, "No items yet"));
    }
return res.status(201).json(
    new apiresponse(201,"food fetched successfully",food)
)
})
const deletefood=async_Handler(async(req,res)=>{
    const { id } = req.params;
        const result = await Food.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json(new apiresponse(404, "Item not found"));
        }
        res.status(200).json(new apiresponse(200, "Item deleted successfully"));
})
const specificfood=async_Handler(async(req,res)=>{
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
        return res.status(404).json(new apiresponse(404, "Item not found"));
    }
        res.status(200).json(new apiresponse(200, "Item deleted successfully",food));
})
export {
   addfood,
   updatefood,
   getallfood,
   deletefood,
   specificfood
};
