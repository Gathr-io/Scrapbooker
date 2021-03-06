const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/events', require('./events'))
router.use('/content', require('./content'))
router.use('/contacts', require('./contacts'))
router.use('/participants', require('./participants'))
router.use('/twilio', require('./twilio'))
router.use('/comments', require('./comments'))
router.use('/email', require('./email'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
