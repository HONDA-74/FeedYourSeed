import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.model.js';

export const authenticate =async (req, res, next) => {
    try {
        
        const token = req.headers.token;
        if (!token) {
            return next(new Error("Access token is missing",{cause:401}))
        }
        const verifyedUSer = jwt.verify(token , process.env.JWT_SECRET)
        const existUser = await User.findById(verifyedUSer.userId)

        if(existUser.isDeleted == true ){
            return next(new Error("Your account is freezed, Login first" , { cause : 400 }))
        }

        if(existUser.deletedAt.getTime() > verifyedUSer.iat*1000 ){
            return next(new Error("Destroyed token" , { cause : 400 }))
        }

        req.existUser = existUser

        next()
    } catch ( error ) {
        return next( error )
    }
}
