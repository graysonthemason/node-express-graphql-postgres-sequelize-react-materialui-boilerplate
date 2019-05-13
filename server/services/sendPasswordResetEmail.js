import sg from '@sendgrid/mail';

require('dotenv').config();

sg.setApiKey(process.env.SENDGRID_API_KEY);
sg.setSubstitutionWrappers('{{', '}}');

module.exports = (event) => {
  const {
    email,
    resetToken,
    firstName,
    fullName
  } = event
  if (!resetToken) {
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
  const subject = 'Reset your password'
  const html =
    `<html>
<head>
  <title>reset your password</title>
</head>
<body>
  <p>Hi {{firstName}},</p>
  <p><a href="http://${process.env.HOST}:${process.env.PORT}/#/reset?token=${resetToken}&email=${email}">Click here to reset your password.</a></p><p>This link will expire in 1hr.</p>
  <p>
  Thanks!</p>
  <p>
  The Dwell Team
  </p>
  </body>
</html>`

  const msg = {
    to,
    from,
    subject,
    text: `Hello {{firstName}},
    Please visit this link (http://${process.env.HOST}:${process.env.PORT}/#/reset?token=${resetToken}&email=${email}) to reset your password.
    Thanks!
    The Dwell Team`,
    html,
    substitutions: {
      firstName
    }
  };

  return sg.send(msg)
}
