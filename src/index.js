import connect_db from "./db/index.js";
import dotenv from 'dotenv'
import app from "./app.js";
dotenv.config({
  path:'./.env'
})
connect_db()
.then(()=>{
  console.log("Connected to database");
  app.listen(process.env.PORT||7000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
  })
})
.catch(err=>console.log("mongo error",err));