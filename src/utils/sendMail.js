import nodemailer from "nodemailer";
import "dotenv/config";
import mustache from "mustache";
import fs from "fs"

const activation_url = process.env.ACTIVATION_URL;
const templateActivationEmail = fs.readFileSync('src/views/activationEmail.html', 'utf8');
const templateForgotPassword = fs.readFileSync('src/views/forgotPassword.html', 'utf8');
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const createEmail = (payload) => {
  payload.activation_url = activation_url;
  return {
    from: process.env.MAIL_FROM,
    to: payload.email,
    subject: "FlowContact - Activate Confirmation",
    html: mustache.render(templateActivationEmail, { ...payload }),
  };
};
const forgotPasswordEmail = (payload) => {
  return {
    from: process.env.MAIL_FROM,
    to: payload.email,
    subject: "FlowContact - Forgot Password",
    html: mustache.render(templateForgotPassword, { ...payload }),
  };
};

const sendEmail = (payload) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createEmail(payload), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email sent successfully: " + info.response);
        resolve(true);
      }
    });
  });
};
const sendEmailForgotPassword = (payload) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(forgotPasswordEmail(payload), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email forgot password sent successfully: " + info.response);
        resolve(true);
      }
    });
  });
};

export {sendEmail, sendEmailForgotPassword}
