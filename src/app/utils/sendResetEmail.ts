import nodemailer from "nodemailer";
import config from "../config";

export const sendResetEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.NODE_ENV ==='production' ? 465 : 587, // Use 587 for STARTTLS
    secure: config.NODE_ENV==='production', // Set to true if using port 465 for SSL/TLS
    auth: {
      user: config.nodemailer_email as string,
      pass: config.nodemailer_pass as string,
    },tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
  });

  try {
    await transporter.sendMail({
      from: config.nodemailer_email as string,
      to,
      subject: "Reset Password | Online Voting App",
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
                  <h1>Welcome to Online Voting App</h1>
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
      `,
    });
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
};
