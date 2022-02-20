/**
 * This function will create a Studio Flow Execution
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback 
 * @returns Null (Work around error `Invalid Content-Type: application/json supplied`)
 */
exports.handler = async(context, event, callback) => {
  try {
    const {From, Body} = event;
    const {ACCOUNT_SID, AUTH_TOKEN, TWILIO_STUDIO_FLOW, TWILIO_PHONE_NUMBER} = context;
    const twilioClient = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

    // Get all the MediaUrl##'s Value from the Event
    const MEDIA_PREFIX = 'MediaUrl';
    const mediaURLs = Object.keys(event).filter((aKey) => aKey.includes(MEDIA_PREFIX)).map((aKey) => event[aKey]);
    const parameters = {
      mediaURLs,
      mediaURLsSize: mediaURLs.length,
      text: Body
    };

    // Create a Studio Flow Execution
    const execution = await twilioClient.studio
    .flows(TWILIO_STUDIO_FLOW)
    .executions
    .create({
      parameters,
      to: From,
      from: TWILIO_PHONE_NUMBER,
    });

    return callback(null, null);
  } catch(e) {
    return callback(e);
  }
};