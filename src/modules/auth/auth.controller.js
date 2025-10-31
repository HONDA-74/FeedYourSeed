import { Router } from "express";
import * as authService from "./auth.service.js"
import { asyncHandler } from "../../utils/index.js"
import { validation } from "../../middlewares/validation.middleware.js"
import { signupSchema , loginSchema, otpSchema, forgetPasswordSchema, resetPasswordSchema } from "./auth.validation.js"
const router = Router()

router.post("/register" , validation( signupSchema ) , asyncHandler(authService.signup) )

router.post("/login"  , validation( loginSchema ) , asyncHandler(authService.login) )

router.get("/activate-account/:id" , asyncHandler(authService.verify) )

router.post("/otp-verify" , validation(otpSchema) ,asyncHandler( authService.otpVerify ) )

router.post("/forget-password" , validation(forgetPasswordSchema), asyncHandler( authService.forgetPassword ) )

router.put("/reset-password" , validation(resetPasswordSchema) , asyncHandler( authService.resetPassword ) )

export default router