const mailer = require("nodemailer");
const { EMAIL, PASS } = require("../config/env.config");

const sendMail = async (link,user,email) => {
  const transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Email Verification",  
    html: 
    `<p style="font-size: 20px">
      Hello ${user},<br>
      Here is your link for email verification:<br><br>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #5bc0de; text-decoration: none; font-weight : 600 ">
        Verify Email
      </a>
    </p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("Email Sent : " + info.response);
    }
  });
};

module.exports = { sendMail };