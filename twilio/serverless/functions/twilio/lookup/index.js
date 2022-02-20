/**
 * This driver will perform a Twilio Lookup.
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback 
 * @returns 
 */
exports.handler = async(context, event, callback) => {
  try {
    const {ACCOUNT_SID, AUTH_TOKEN} = context;
    const twilioClient = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
    const {phoneNumber, options = {}, isCleanUpResponse = false} = event;
    const lookupResult = await twilioClient.lookups.v1.phoneNumbers(phoneNumber).fetch(options);
    const result = isCleanUpResponse ? cleanUpResponse(lookupResult) : lookupResult;
    return callback(null, result);
  } catch(e) {
    return callback(e);
  }
};

/**
 * This method will clean up the result from lookup.
 * @param {JSON} lookupResult 
 */
const cleanUpResponse = (lookupResult) => {
  // Twilio Serverless doesn't support Optional Chaining.
  const result = {
    'Phone Number': lookupResult.phoneNumber,
    'Caller Id': 
    lookupResult.callerName ? lookupResult.callerName.caller_name : '',
    'Country Code': lookupResult.countryCode,
    'Carrier Name': 
    lookupResult.carrier ? lookupResult.carrier.name : '',
    'Carrier Type': 
    lookupResult.carrier ? lookupResult.carrier.type : '',
  }

  // Add Add-Ons Results
  if(lookupResult.addOns && lookupResult.addOns.results) {
    if(lookupResult.addOns.results.nomorobo_spamscore) {
      result['isSpam'] = lookupResult.addOns.results.nomorobo_spamscore.status === 'successful' && 
      lookupResult.addOns.results.nomorobo_spamscore.result.score === 1 ? 'true' : 'false';
    }

    if(lookupResult.addOns.results.ekata_reverse_phone && lookupResult.addOns.results.ekata_reverse_phone.status === 'successful') {
      result['Additional Info'] = lookupResult.addOns.results.ekata_reverse_phone.result;
    }
  }

  return JSON.stringify(result, null, 4);
}