exports.handler = async(context, event, callback) => {
  try {
    const {ACCOUNT_SID, AUTH_TOKEN} = context;
    const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
    const {phoneNumber, options = {}, isCleanUpResponse = false} = event;
    const lookupResult = await client.lookups.v1.phoneNumbers(phoneNumber).fetch(options);
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
  const result = {
    'Caller Id': lookupResult.callerName.caller_name,
    'Carrier Name': lookupResult.carrier.name,
    'Carrier Type': lookupResult.carrier.type,
    'isSpam': 
    lookupResult.addOns.results.nomorobo_spamscore.status === 'successful' && 
    lookupResult.addOns.results.nomorobo_spamscore.result.score === 1 ? 'true' : 'false',
    'Additional Info': lookupResult.addOns.results.ekata_reverse_phone.status === 'successful' ? 
    lookupResult.addOns.results.ekata_reverse_phone.result : 
    ''
  }

  return result;
}