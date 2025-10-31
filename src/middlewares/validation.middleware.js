export const validation = (schema) => {
    return (req,res,next) => {
        const result = schema.validate(req.body , {abortEarly: false})
        if(result.error){
            let messages = result.error.details.map( (obj) => obj.message )
            return next(new Error(messages , {cause : 400}))
        }
        return next()
    }
}



