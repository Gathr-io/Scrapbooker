const nodemailer = require('nodemailer');
const router = require('express').Router()
const {usersEvents} = require('../db/models')
const BitlyClient = require('bitly')
const bitly = BitlyClient(process.env.BITLYCONFIG)
const IP = '172.16.21.83'
module.exports = router

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.appUsername,
         pass: process.env.appPassword
     }
 });

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

router.post('/', (req, res, next) => {
  const organizer = req.body.organizer
  const event = req.body.event
  usersEvents.findAll({
    where: { eventId: req.body.id },
    include: [{ all: true }]
  })
  .then(participants => {
    participants.map(participant => {
      return bitly.shorten(`http://${IP}:8080/events/${participant.event.secret}/upload/${participant.user.userHash}`)
      .then( URL => {
        return transporter.sendMail({
        from: `${process.env.appUsername}`, // sender address
        to: `${participant.user.email}`, // list of receivers
        subject: `Scrappr: ${organizer.fullName} invites you to the <${event.name}> scrapbook`, // Subject line
        text: `${organizer.fullName} has invited you to contribute to the <${event.name}> scrapbook.\nPlease add your images here:\n\n${URL.data.url}`
      }, (error, info) => {
          if (error) {return console.log(error)}
          return console.log('Message sent: %s', info.messageId);
        })
      })
    })
  })
})
