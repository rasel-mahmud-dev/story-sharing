import nodemailer from "nodemailer"


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
          e(error)
        } else {
          s(info)
        }
      });
    })
  
}


export default sendMail