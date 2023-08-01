import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();
class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
            
        })
        // this.transporter.set("oauth2_provision_cb", (user, renew, callback) => {
        //     let accessToken = userTokens[user];
        //     if (!accessToken) {
        //       return callback(new Error("Unknown user"));
        //     } else {
        //       return callback(null, accessToken);
        //     }
        //   });
    }

    async sendActivation(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER_GMAIL,
            to,
            subject: 'Activation of the account for ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>To confirm your account go by link: </h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new MailService();