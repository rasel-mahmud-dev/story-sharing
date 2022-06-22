import nodemailer from "nodemailer"
// const sgMail = require('@sendgrid/mail')

function gmailTransport(){
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASSWORD
    }
  })
}


function sendMail(mailOptions){

  // let {to, from, subject, html} = mailOptions
  
  return new Promise((s, e)=>{
    gmailTransport().sendMail(mailOptions, function(error, info){
        if (error) {
          e(Error("Mail send fail. please try again"))
        } else {
          s(info)
        }
      });
    })
  

  // sgMail.setApiKey("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")
  // const msg = {
  //   to: 'rasel.mahmud.dev@gmail.com', // Change to your recipient
  //   from: 'raselmr005@gmail.com', // Change to your verified sender
  //   subject: 'Look! I’m sending from SendGrid',
  //   text: 'Here’s the text version',
  //   html: 'And here’s the <strong>HTML</strong> version',
  // }
  //
  // sgMail.send(msg)
  //   .then((clientResponse: any) => {
  //     console.log(clientResponse)
  //     console.log('Email sent')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
  
}


export default sendMail