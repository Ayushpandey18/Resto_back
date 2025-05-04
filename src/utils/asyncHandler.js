// const async_Handler=(fn)=>async (req,res,next)=>{
// try {
//     await fn(req,res,next);
// } catch (error) {
//     res.status(500).json({success: false,  
//         message:error.message})
// }
// }
const async_Handler=(request_handler)=>{return (req,res,next)=>{
    Promise.resolve(request_handler(req,res,next)).catch((err)=>next(err));
}
}
export default async_Handler;
