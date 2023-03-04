const nodemailer = require("nodemailer");

/* Password Reset Email link*/
let passwordResetEmail = async (email, title, content, link) => {
  try {
    var transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jagadees.vg@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "jagadees.vg@gmail.com",
      to: email,
      subject: title,
      html: `<p>${content}</p><p>Please click the below link to Reset your password, This link will be expired after 5 mins.</p><p>${JSON.stringify(
        link
      )}</p><p>Note: Don't share this link to anyone</p>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

/* Email Appointment Confirmation*/
let confirmationMail = async (content) => {
  try {
    var transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jagadees.vg@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "jagadees.vg@gmail.com",
      to: content[0].userEmail,
      subject: "Payment Confirmation",
      html: `<p>Dear <b>Mr/Mrs. ${content[0].userName} </b></P>
      <p> Your Payment for ${content[0].title} to ${content[0].provider} is successfull ,
       Please find below for your payment details: </p>
  <p><b>Payment Id: ${content[0]._id}</b></p>
  <p>Number: ${content[0].number}</p>
  <p>Amount: ₹${content[0].amount}</p>
  <p>Thanks for choosing Paytm Service.</p>`,
    };
    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  passwordResetEmail,
  confirmationMail,
};
