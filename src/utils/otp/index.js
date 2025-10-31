import { Otp } from "../../db/models/otp.model.js"
import otpGenerator from "otp-generator"

export const generateOtp = ({email}) => {
    const otp = otpGenerator.generate(5 ,{digits : true , upperCaseAlphabets : false , lowerCaseAlphabets : false , specialChars : false })
    const savedOtp = Otp.create({email , otp })
    return savedOtp
}