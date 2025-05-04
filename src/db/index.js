import  mongoose from "mongoose";
import { DB_name } from "../constants.js";
const connect_db=async ()=>{
    try {
        console.log(process.env.MONGODB_URI);
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
        console.log("\nMongo Db connected:",connectionInstance.connection.host);
    } catch (err) {
        console.log("Error:",err);
        process.exit(1);
    }
}
export default connect_db;