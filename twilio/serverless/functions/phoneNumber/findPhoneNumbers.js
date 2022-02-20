const { call } = require('@google-cloud/vision/build/src/helpers');

exports.handler = async(context, event, callback) => {
  try {
    const {findPhoneNumbersInText} = require('libphonenumber-js');
    const {text = '', defaultCountry = 'US'} = event;
    const cleanText = text.replace(/[\n\t\r]/g," ");
    // LibphoneNumber breaks when it see one of special characters.
    let results = findPhoneNumbersInText(
      cleanText, 
      defaultCountry
    );
    
    results = results.map((aResult) => aResult.number.number);
    return callback(null, {results, size: results.length});
  } catch(e) {
    return callback(e);
  }
};