const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "thanhdinhtien2003@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

module.exports = async (to, subject, content) => {
  const info = await transporter.sendMail({
    from: '"<Matching Queue> 👻" <thanhdinhtien2003@gmail.com>',
    to,
    subject,
    html: content,
  });
  return info
}