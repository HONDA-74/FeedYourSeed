export const isAuthorized = (...roles) => {
    return (req,res,next) => {
        if (! roles.includes( req.existUser.role ) ) {
            console.log(roles , req.existUser.role);
            return next(new Error("You are not authorized" , {cause : 401}))
        }
        if(req.existUser.isComfirmed == false) {
            return next(new Error("Your email not verifyed yet" , {cause : 400}))
        }

        return next()
    }
}