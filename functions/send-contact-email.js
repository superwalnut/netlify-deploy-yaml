require('dotenv').config()
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_URL, MAILER_API_KEY, REFERRER, FROM_EMAIL } = process.env

const mailgun = require('mailgun-js')({ 
    apiKey: MAILGUN_API_KEY, 
    domain: MAILGUN_DOMAIN, 
    url: MAILGUN_URL });

exports.handler = async (event) => {
  if (!event.headers.referrer.includes(REFERRER)) {
    // process the function
     return {
       statusCode: 401,
       body: JSON.stringify('Unauthorized')
     }
  }

  if (!event.headers?.security === MAILER_API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify('Unauthorized')
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const data = JSON.parse(event.body)
  if (!data.message || !data.contactName || !data.contactEmail) {
    return { statusCode: 422, body: 'Name, email, and message are required.' }
  }

  const mailgunData = {
    from: FROM_EMAIL,
    to: data.contactEmail,
    subject: `You have a new inquiry from ${data.contactName}`,
    html: data.message
  }
  return mailgun.messages().send(mailgunData).then(() => ({
    statusCode: 200,
    body: "Your message was sent successfully! We'll be in touch."
  })).catch(error => ({
    statusCode: 422,
    body: `Error: ${error}`
  }))
}
