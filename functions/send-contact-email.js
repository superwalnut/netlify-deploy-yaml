require('dotenv').config()
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_URL, MAILER_API_KEY, REFERRER, FROM_EMAIL } = process.env

const mailgun = require('mailgun-js')({ 
    apiKey: MAILGUN_API_KEY, 
    domain: MAILGUN_DOMAIN, 
    url: MAILGUN_URL });
const origin = `https://${REFERRER}`;

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Security, Referral'
  };

  if (event.httpMethod == 'OPTIONS') {
    // To enable CORS
    return {
      statusCode: 200, // <-- Important!
      headers,
      body: 'This was a preflight request!'
    };
  }
  
    if (event.headers?.Security !== MAILER_API_KEY) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "Not Allowed"
        })
      };
    }
  
    console.log('security is ok');
  
    if (event.httpMethod !== 'POST') {
      return { 
        statusCode: 405, 
        headers, 
        body: JSON.stringify({
          error: "Not Allowed"
        })
      };
    }
  
    console.log('post is ok');
  
    const data = JSON.parse(event.body)
    if (!data.message || !data.contactName || !data.contactEmail) {
      return { 
        statusCode: 422, 
        headers, 
        body: JSON.stringify({
          error: "Not Valid"
        })
      };
    }
  
    console.log('data is ok');
  
    const mailgunData = {
      from: FROM_EMAIL,
      to: data.contactEmail,
      subject: `You have a new inquiry from ${data.contactName}`,
      html: data.message
    }
  
    console.log('sending to mailgun');
  
    return mailgun.messages().send(mailgunData).then(() => ({
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true
      })
    })).catch(error => ({
      statusCode: 422,
      headers,
      body: JSON.stringify({
        error:  `Error: ${error}`
      })
    }))
}
