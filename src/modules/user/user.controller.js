import { Router } from "express";
import * as userServise from "./user.service.js"
import { asyncHandler } from "../../utils/index.js"
import { validation } from "../../middlewares/validation.middleware.js"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { isAuthorized } from "../../middlewares/authorization.middleware.js"
import { roles } from "../../utils/global-variables.js"
import { passwordUpdateSchema, updateSchema } from "./user.validation.js";
import { cloudUpload } from "../../utils/file upload/cloud-multer.js";
import { fileValidation } from "../../utils/global-variables.js";
const router = Router()

router.get(
    "/profile" , 
    authenticate , 
    isAuthorized(roles.USER , roles.ADMIN) ,
    asyncHandler( userServise.getProfile ) 
)

router.put(
    "/update" , 
    authenticate ,  
    isAuthorized(roles.USER , roles.ADMIN)  ,
    cloudUpload(fileValidation.IMAGES).single("image") ,
    validation(updateSchema) , 
    asyncHandler( userServise.update ) 
)

router.delete("/freeze" , authenticate , isAuthorized(roles.USER , roles.ADMIN)  ,asyncHandler( userServise.freeze ) )

router.delete("/hard-delete" , authenticate , isAuthorized(roles.ADMIN , roles.USER) , asyncHandler( userServise.hardDelete ))

router.put("/update-password" ,
        authenticate ,
        isAuthorized(roles.USER , roles.ADMIN)  ,
        validation(passwordUpdateSchema) ,
        asyncHandler( userServise.updatePassword ) 
    )

router.post("/profile-pic",
    authenticate ,
    isAuthorized(roles.USER , roles.ADMIN)  ,
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    asyncHandler(userServise.uploadCloudProfilePic)
) 

export default router