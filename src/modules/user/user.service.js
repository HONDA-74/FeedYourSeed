import { User } from "../../db/models/user.model.js"
import { Otp } from "../../db/models/otp.model.js"
import { sendEmailToVerify ,hash, messages } from '../../utils/index.js'
import { defaultImage } from "../../utils/global-variables.js"
import cloudinary from "../../utils/file upload/cloud-config.js"


export const getProfile = async (req,res,next)=>{
    const id = req.existUser._id
        const user = await User.findById(id)
        if (!user) {
            return next(new Error("User not found" , { cause : 404 }))
        }
        const userInfo = {
            userName : user.userName,
            email : user.email,
            age : user.age,
            phone : user.phone ,
            address : user.address ,
            image : user.image
        }
        return res.status(200).json({ success: true, message: 'User found successfully. ' , userInfo });
}

export const update = async (req,res,next) => {
    const id = req.existUser._id 
    const { first_name, last_name, age, email , phone , address} = req.body 
    let options = {}
    if(req.existUser.image.public_id == defaultImage.public_id ){
            options.folder = `feed_your_seed/users/${id}/profile-pic`
    }else{
            options.public_id = req.existUser.image.public_id
        }

    const updateFields = {}
    if (req.file) {
        const { secure_url , public_id } = await cloudinary.uploader.upload(req.file.path, options)
        updateFields.image = { secure_url, public_id }
    }
    if (first_name) updateFields.first_name = first_name
    if (last_name) updateFields.last_name = last_name
    if (age) updateFields.age = age
    if (phone) updateFields.phone = phone
    if (address) updateFields.address = address
    if (email) {
        const emailExisting = await User.findOne({ email })
        if (emailExisting) {
            return next(new Error('Email already exists', { cause: 400 }))
        }
        updateFields.email = email
        updateFields.isConfirmed = false
        sendEmailToVerify({email , id: req.existUser._id})
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return next(new Error('User not found', { cause: 404 }));
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
    })
}

export const updatePassword = async (req,res,next) => {
    const email = req.existUser.email
    const { otp, password } = req.body //cPassword

    const user = await User.findOne({ email })
    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
            return next(new Error('Invalid OTP', { cause: 400 }));
    }

    const otpExpiryTime = 5 * 60 * 1000; 
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

export const freeze = async (req,res,next) => {
    const freezed = await User.updateOne({ _id : req.existUser._id } , { isDeleted : true , deletedAt : Date.now() })
    if (!freezed) {
        return next(new Error("User not found" , {cause : 404} ) )
    }
    res.status(200).json({ success: true, message: "User freezed successfully"  });
}

export const hardDelete = async (req,res,next) => {
    const id = req.existUser._id

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
        return next(new Error('User not found', { cause: 404 }));
    }

    res.status(200).json({
        success: true,
        message: 'User account deleted successfully',
        })
}

export const uploadCloudProfilePic = async (req,res,next) => {
    const id = req.existUser._id
    let options = {}
    if(req.existUser.image.public_id == defaultImage.public_id ){
        options.folder = `feed_your_seed/users/${id}/profile-pic`
    }else{
        options.public_id = req.existUser.image.public_id
    }

    const updateFields = {}
    if (req.file) {
        const { secure_url , public_id } = await cloudinary.uploader.upload(req.file.path, options)
        updateFields.image = { secure_url, public_id }
    }

    const user =await User.findByIdAndUpdate(
        id, 
        updateFields,
        { new: true }
    )

    if(!user) next(new Error(messages.user.notFound , {cause : 403}))

    return res.status(200).json({success : true , message : messages.IMAGE.Updated  , user })
}
