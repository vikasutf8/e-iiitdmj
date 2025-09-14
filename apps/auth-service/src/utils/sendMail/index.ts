import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER || "vikas998334@gmail.com",
    pass: process.env.SMTP_PASSWORD || "pjkv eouc jksv fxbg"
  },
});


console.log(transporter);



//render an EJS template
const renderEmailTemplate =async(templateName:string,data:Record<string,any>):Promise<string>=>{
    const templatePath = path.join(
        process.cwd(),
        "apps",
        "auth-service",
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    );

    return ejs.renderFile(templatePath, data);

}


//send an email using nodemailer

export const sendEmail = async (to:string,subject:string,templateName:string,data:Record<string,any>)=>{ 
    console.log(to,subject,templateName,data);
    try {
        const html = await renderEmailTemplate(templateName,data);
        await transporter.sendMail({
            from: `<${process.env.SMTP_USER || "vikas998334@gmail.com"}>`, 
            to,
            subject,
            html,
            
        });
        return true
    } catch (error) {
        console.log("send Mail error",error);
        return false;
    }   
}    