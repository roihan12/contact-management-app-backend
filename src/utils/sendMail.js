import nodemailer from "nodemailer";
import "dotenv/config";
import mustache from "mustache";
import fs from "fs"

const activation_url = process.env.ACTIVATION_URL;
const template = fs.readFileSync('src/views/activationEmail.html', 'utf8');
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
    html: mustache.render(template, { ...payload }),
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

export {sendEmail}
