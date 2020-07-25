
/**
 * configure kue for pareller jobs
 */
const kue=require('kue')
const queue=kue.createQueue();
const mailer=require('./nodemailerConfig');
// send mail
function sendMail(from,to,subject,text){
    var mailOptions = {
        from,
        subject,
        to,
        text
      };
    mailer.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
/**
 * process email jobs
 */
queue.process('email',function(job,done){
    let {from,to,subject,text}=job.data;
    sendMail(from,to,subject,text);
})
module.exports.queue=queue;
module.exports.sendMail=sendMail;