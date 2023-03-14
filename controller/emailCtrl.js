const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'onlyproject108@gmail.com',
        pass: 'xfljomwuhzdvxsap'
      },
    });

    let info = await transporter.sendMail({
      from: '"Hey 👻" <onlyproject108@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.htm,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    if (res && res.status) {
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    if (res && res.status) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

module.exports = sendEmail;
