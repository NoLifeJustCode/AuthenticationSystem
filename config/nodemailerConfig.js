//configure a nodemailer instance
const nodemailer=require('nodemailer')
const email=require('../dev.json').email
var mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email.id,
      pass: email.password
    }
  });
  

module.exports= mailer;