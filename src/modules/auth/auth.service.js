import { User } from "../../db/models/user.model.js"
import { Otp } from "../../db/models/otp.model.js"
import { hash , compareHash , generateToken, sendEmailToVerify, sendOtp, generateOtp, messages } from "../../utils/index.js"
import { generateHTML } from "../../templates/verify-page.js"


export const signup = async (req , res , next) => { 
    const { first_name , last_name , email , password , age , phone , address} = req.body
    
    const hashedPassword =await hash({password })
    const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
        phone ,
        address
    })

    //send email for verify
    sendEmailToVerify({email , id : newUser._id})

    await newUser.save()

    return res.status(201).json({success: true , message:messages.user.Created})
}

export const login = async (req,res,next) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) return next(new Error( 'Invalid cradinials ' , {cause : 400}))

    if(existingUser.isConfirmed == false)  return next(new Error( 'Email not activated yet pls activate it first and try again'  , {cause : 400}))

    if (existingUser.isDeleted == true ) {
        await User.updateOne({_id : existingUser._id } , {isDeleted : false  })
    }

    const matchPassword =await compareHash({password , hashedPassword: existingUser.password })

    if(!matchPassword) return next(new Error( 'Invalid credentials' , {cause : 400}))

    const token = generateToken( 
        { 
            payload : { userId : existingUser._id , email : existingUser.email , role : existingUser.role} ,
            option : { expiresIn: '1y' } 
        })

    res.status(200).json({ success : true , message: 'Login successful', token  , username : existingUser.userName})
}

export const verify = async (req, res, next) => {
    const { id } = req.params;

    const result = await User.findByIdAndUpdate({ _id: id }, { isConfirmed: true });

    if (!result) return next(new Error('User not found', { cause: 404 }));

    return res.status(200).send(generateHTML('success', 'Email is verified successfully.', 'You can now log in or continue to your account.'));
}


export const otpVerify = async (req,res,next ) => {
    const {email} = req.body
    
    const user =await User.findOne({email , isConfirmed : true , isDeleted : false})
    if(!user){
        return next(new Error("User not found" , {cause : 404}))
    }

    const savedOtp =await generateOtp({email})

    await sendOtp({ otp : savedOtp.otp , email })

    return res.status(200).json({ success : true , message: 'OTP send successfully' })
}

export const forgetPassword = async (req,res,next) => {
    const {email} = req.body
    
    const user =await User.findOne({email , isConfirmed : true , isDeleted : false })
    if(!user){
        return next(new Error("User not found" , {cause : 404}))
    }

    const savedOtp =await generateOtp({email})

    await sendOtp({ otp : savedOtp.otp , email })
    
    return res.status(200).json({ success : true , message: 'OTP send successfully' })
}

export const resetPassword = async (req,res,next) => {
    const { otp, password , email } = req.body //cPassword

    const user = await User.findOne({ email , isConfirmed : true , isDeleted : false })
    console.log(email);

    if (!user) {
        
        return next(new Error('User not found', { cause: 404 }));
    }
    
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
        return next(new Error('Invalid OTP', { cause: 400 }));
    }
    
    const otpExpiryTime = 10 * 60 * 1000; 
    if (Date.now() - otpRecord.createdAt > otpExpiryTime) {
        await Otp.deleteOne({ email, otp })
        return next(new Error('OTP has expired', { cause: 400 }))
    }
    
    const hashedPassword = await hash({password});
    
    user.password = hashedPassword;
    await user.save();
    
    await Otp.deleteOne({ email, otp });
    
    return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    })
}


