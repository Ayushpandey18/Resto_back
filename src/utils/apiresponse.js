class apiresponse{
    constructor(statusCode,message="",data=null,errors=[]){
        this.statusCode=statusCode
        this.success=statusCode<400;
        this.message=message;
        this.data=data;
        this.errors=errors;
    }
}
export {apiresponse,

};