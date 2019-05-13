import sg from '@sendgrid/mail';

require('dotenv').config();

sg.setApiKey(process.env.SENDGRID_API_KEY);
sg.setSubstitutionWrappers('{{', '}}');

module.exports = (event) => {
  const {
    email,
    registerToken,
    firstName,
    fullName
  } = event
  if (!registerToken) {
    console.log("DO_ERROR: No Register Token provided")
    return null
  }
  const to = {
    name: fullName,
    email
  }
  const from = {
    name: process.env.ACCOUNT_INFO_NAME,
    email: process.env.ACCOUNT_INFO_EMAIL
  }
  const subject = 'Email confirmation'
  const html =
    `<html>
<head>
  <title>Confirm your email address</title>
</head> 
<body>
  <p>Hi {{firstName}},</p>
  <p><a href="http://${process.env.HOST}:${process.env.PORT}/#/confirm?token=${registerToken}&email=${email}">Click here to confirm your email address.</a></p><p>This link will expire in 1hr.</p>
  <p>
  Thanks!</p>
  </body>
</html>`

  const msg = {
    to,
    from,
    subject,
    html,
    substitutions: {
      firstName
    }
  };

  return sg.send(msg)
}
