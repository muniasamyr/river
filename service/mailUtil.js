const nodemailer = require('nodemailer');
module.exports.sendEmail = async function sendEmail(subjectMsg, htmlData, toEmail) {
      const resp =  await sendEmailNotification(subjectMsg, htmlData, toEmail);
      return resp;  
}

async function sendEmailNotification(subjectMsg, htmlData, toEmail) {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      host:"smtp.gmail.com",
      port:  465,
      secure: true, 
      auth: {
        user: 'rmuniasamy392@gmail.com',
        pass: 'jeyakumarr'
      }
    });
    var message = {
      from: "rmuniasamy392@gmail.com",
      to: toEmail,
      subject: subjectMsg,
      html: htmlData
    };
    let info = await transporter.sendMail(message);
    console.log('Preview URL: ', (info));
    return info;
  } catch (ex) {
    console.error(ex);
    return ex;
  }
};