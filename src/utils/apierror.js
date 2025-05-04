// Suggested code may be subject to a license. Learn more: ~LicenseLog:2036528963.
class apierror extends Error{
    constructor(message="something went wrong",statusCode,errors=[],stack=""){
        super(message);
        this.statusCode=statusCode;
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export default apierror;