import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import nodemailer from "nodemailer"



export const sendEmail =async ({to , subject , html}) => {
try {
    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        },
        pool: false,
    })
    console.log(process.env.EMAIL_USER);
    
    const info = await transporter.sendMail({
        from: `"Feed Your Seed" <${[process.env.EMAIL_USER]}> ` ,
        to,
        subject,
        html,
    })
    
    if(info.rejected.length>0) return false
    console.log('Email sent successfully:', info.response)
    return true
} catch (error) {
    console.error('Error sending email:', error.message)
    return false;
}
}


export const sendEmailToVerify = async ({email , id }) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname =  dirname(__filename);
    const verificationLink = `${process.env.WEP_URL}/auth/activate-account/${id}`;
    const htmlPath = path.join(__dirname, '../../templates/verify-email-template.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('{{verificationLink}}', verificationLink);
    
    const isSent = await sendEmail({
        to: email,
        subject: 'Verify your Email',
        html,
    })

    if (!isSent) {
        return next(new Error('Email not sent, please try again', { cause: 500 }));
    }

}

export const sendOtp = async ({email , otp}) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname =  dirname(__filename)
    const htmlPath = path.join(__dirname, '../../templates/otp.html')
    let html = fs.readFileSync(htmlPath, 'utf8')
    html = html.replace('{{otp}}' , otp)

    const isSent = await sendEmail({
        to: email,
        subject: 'OTP',
        html,
    })

    if (!isSent) {
        return next(new Error('Email not sent, please try again', { cause: 500 }));
    }
}


