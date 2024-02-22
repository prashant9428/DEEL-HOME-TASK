const errorHandler = (error,req,res,next)=>{
    console.log("Error",error)
    let statusId = 0
    let status = error.status || 500;
    let message = error.message || "something went wrong";
 
    res.status(status).json({
       statusId,
       status: status,
       message: message,
     });
 }
 
 module.exports = errorHandler;