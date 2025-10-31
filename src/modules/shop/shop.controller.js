import { Router } from "express";
import * as shopService from "./shop.service.js"
import { asyncHandler } from "../../utils/index.js";
import { authenticate } from "../../middlewares/auth.middleware.js"
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/global-variables.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { addToCartSchema, deleteSchema, plantSchema, searchSchema, updatetSchema } from "./shop.validation.js";
import { cloudUpload } from "../../utils/file upload/cloud-multer.js";
import { fileValidation } from "../../utils/global-variables.js";
const router = Router()

router.get("/products"  , authenticate ,isAuthorized(roles.USER , roles.ADMIN) , asyncHandler(shopService.getProducts) )

router.get("/product/:id" , authenticate ,isAuthorized(roles.USER , roles.ADMIN) , asyncHandler(shopService.getProduct) )

router.post(
    "/addProduct" ,
    authenticate  ,
    isAuthorized(roles.ADMIN) , 
    cloudUpload(fileValidation.IMAGES).single("image") , 
    validation(plantSchema) , 
    asyncHandler(shopService.addProduct) 
)

router.get("/search" , authenticate , isAuthorized(roles.USER) , validation(searchSchema) , asyncHandler(shopService.search ) )

router.put("/update" , authenticate , isAuthorized(roles.ADMIN) , validation(updatetSchema) , asyncHandler( shopService.updateProduct ) )

router.delete("/delete" , authenticate , isAuthorized(roles.ADMIN) ,validation(deleteSchema) , asyncHandler(shopService.deleteProduct ))

router.put("/add-to-cart" , authenticate , isAuthorized(roles.USER) , validation(addToCartSchema) , asyncHandler(shopService.addToCart) )

router.delete("/remove-from-cart" , authenticate , isAuthorized(roles.USER) , asyncHandler(shopService.removeFromCart))

router.get("/my-cart" , authenticate , isAuthorized(roles.USER) , asyncHandler(shopService.getCart))

export default router