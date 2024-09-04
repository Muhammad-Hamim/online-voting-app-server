import nodemailer from "nodemailer";
import config from "../config";

export const sendUserEmail = async (email: string, password: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: config.NODE_ENV === "production" ? 465 : 587,
      secure: config.NODE_ENV === "production",
      auth: {
        user: config.nodemailer_email as string,
        pass: config.nodemailer_pass as string,
      },
    });

    await transporter.sendMail({
      from: config.nodemailer_email as string,
      to: email,
      subject: "Welcome to the Online Voting App - Your Account Details",
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
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #007bff;
                  color: #ffffff;
                  border-radius: 8px 8px 0 0;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 20px;
                  text-align: left;
              }
              .content h2 {
                  font-size: 22px;
                  margin-bottom: 15px;
              }
              .content p {
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
              .credentials {
                  font-weight: bold;
                  font-size: 18px;
                  background-color: #f8f9fa;
                  padding: 10px;
                  border-radius: 5px;
                  margin-bottom: 20px;
              }
              
              .content > .button > a{
                  display: inline-block;
                  padding: 12px 25px;
                  margin-top: 15px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 5px;
                  text-align: center;
              }
              .footer {
                  text-align: center;
                  padding: 15px 0;
                  background-color: #f8f9fa;
                  color: #6c757d;
                  font-size: 14px;
                  border-radius: 0 0 8px 8px;
              }
              .footer p {
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to the Online Voting App</h1>
              </div>
              <div class="content">
                  <h2>Hello,</h2>
                  <p>We are excited to have you join the Online Voting App. Your account has been successfully created with the following credentials:</p>
                  <div class="credentials">
                      <p>Email: <span style="color: #007bff;">${email}</span></p>
                      <p>Password: <span style="color: #007bff;">${password}</span></p>
                  </div>
                  <p>To get started, please click the button below to log in. For security purposes, you may want to change your password after logging in. This link will expire in 24 hours.</p>
                  <div class="button">
                      <a href="${config.user_login_url}">Log In to Your Account</a>
                  </div>
                  <p>If you did not create this account or believe this is a mistake, please contact our support team immediately.</p>
                  <p>Best Regards,<br>The Online Voting App Team</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Online Voting App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Failed to send email:", error);
    // Optionally, handle or notify about the failure in other ways if needed
  }
};
