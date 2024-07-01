import nodemailer from 'nodemailer';

const sendEmail = async(reciverEmail ,text)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host:'smtp.gmail.com',
        port:587 ,
        secure: false,
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });
    const message = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: reciverEmail,
        subject: "Hello ✔",
        text: text
    })
    return message.messageId;
}

export default sendEmail;