const helper = require('@sendgrid/mail');

const sg = require('@sendgrid/mail').setApiKey(process.env.SENDGRID_API_KEY);

const crypto = require('crypto')

require('dotenv').config();

const sendPasswordResetEmailService = require('../services/sendPasswordResetEmail');
const sendRegisterEmailService = require('../services/sendRegisterEmail');

const database = require('../models/index');

const User = database.models.user;
const {
  updateUser,
  createUser
} = require('../services/user');

function generateResetToken() {
  return crypto.randomBytes(20).toString('hex')
}

function generateExpiryDate() {
  const now = new Date()
  return new Date(now.getTime() + 3600000).toISOString()
}

function sendForgotPasswordEmail(user) {
  const {
    email
  } = user;
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        email
      }
    }).then(retrievedUser => {
      if (!retrievedUser) return reject(new Error(`No user found with the email '${email}'`));
      const resetToken = generateResetToken();
      updateUser({
        id: retrievedUser.id,
        resetToken,
        resetExpires: generateExpiryDate()
      }, (err) => {
        if (err) {
          reject(err)
        }
      }).then((savedUser) => sendPasswordResetEmailService(savedUser));
      return resolve(retrievedUser)
    })
  });
}

function sendRegisterEmail(user) {
  const {
    email
  } = user;
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        email
      }
    }).then(retrievedUser => {
      if (retrievedUser) return reject(new Error(`A user already exists with email '${email}'.`));
      const registerToken = generateResetToken();
      createUser({
        email,
        registerToken,
        registerExpires: generateExpiryDate()
      }, (err) => {
        if (err) {
          reject(err)
        }
      }).catch((e) => {
        reject(e)
      }).then((savedUser) => {
        sendRegisterEmailService(savedUser)
        resolve(savedUser)
      });
    })
  });
}

function sendContactUsEmail(args) {
  const {
    email,
    firstName,
    message,
    lastName
  } = args
  const toEmail = new helper.Email(process.env.ACCOUNT_INFO_EMAIL, process.env.ACCOUNT_INFO_NAME);
  const fromEmail = new helper.Email(email, `${firstName} ${lastName}`);
  const subject = 'Contact Us Form Submission'
  const htmlEmail =
    `<html>
<head>
  <title>Contact Us Form Submission</title>
</head>
<body>
  <p>Contact Form Submission from ${firstName} ${lastName}</p>
<p>${message}</p>
</body>
</html>`

  const content = new helper.Content('text/html', htmlEmail)
  const mail = new helper.Mail()
  mail.setFrom(fromEmail)
  mail.setSubject(subject)
  mail.addContent(content)

  const personalization = new helper.Personalization()
  personalization.addTo(toEmail)
  mail.addPersonalization(personalization)

  return new Promise((resolve, reject) => {
    const request = sg.emptyRequest()
    request.body = mail.toJSON()
    request.method = 'POST'
    request.path = '/v3/mail/send'
    sg.API(request, (error, response) =>
      error ? reject(error) : resolve(response)
    )
    return resolve(args)
  })
}

function sendPartnerEmail(args) {
  const {
    email,
    firstName,
    message,
    lastName
  } = args
  const toEmail = new helper.Email(process.env.ACCOUNT_INFO_EMAIL, process.env.ACCOUNT_INFO_NAME);
  const fromEmail = new helper.Email(email, `${firstName} ${lastName}`);
  const subject = 'Become a Partner Form Submission'
  const htmlEmail =
    `<html>
<head>
  <title>Become a Partner Form Submission</title>
</head>
<body>
  <p>'Become a Partner' Form Submission from ${firstName} ${lastName}</p>
<p>${message}</p>
</body>
</html>`

  const content = new helper.Content('text/html', htmlEmail)
  const mail = new helper.Mail()
  mail.setFrom(fromEmail)
  mail.setSubject(subject)
  mail.addContent(content)

  const personalization = new helper.Personalization()
  personalization.addTo(toEmail)
  mail.addPersonalization(personalization)

  return new Promise((resolve, reject) => {
    const request = sg.emptyRequest()
    request.body = mail.toJSON()
    request.method = 'POST'
    request.path = '/v3/mail/send'
    sg.API(request, (error, response) =>
      error ? reject(error) : resolve(response)
    )
    return resolve(args)
  })
}

module.exports = {
  sendForgotPasswordEmail,
  sendRegisterEmail,
  sendContactUsEmail,
  sendPartnerEmail
};
