import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "Production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "hamim.me01@gmail.com",
      pass: "eexb djfr nsjh nigi",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "hamim.me01@gmail.com", // sender address
    to, // list of receivers
    subject: "reset password | online voting app", // Subject line
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #dddddd;
            }
            .header h1 {
                margin: 0;
                color: #333;
            }
            .content {
                padding: 20px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
            }
            .content a {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 10px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                border-top: 1px solid #dddddd;
                margin-top: 20px;
                color: #777777;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            <div class="content">
                <h2>Hello,</h2>
                <h1>Welcome to online voting app</h1>
                <p>You requested to reset your password. Please click the button below to reset your password. This link will expire in 10 minutes.</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                <p>Thank you,<br>The Online Voting App Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Online Voting App. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `, // html body
  });
};
