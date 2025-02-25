class AppError extends Error{
    constructor(){
        super();
    }
    creat(message,statuscode,statustext){
        this.message=message
        this.statuscode=statuscode
        this.statustext=statustext
        return this
    }
}
module.exports =new AppError()
