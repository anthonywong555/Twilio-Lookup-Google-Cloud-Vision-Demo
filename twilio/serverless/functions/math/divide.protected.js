/**
 * This driver will perform the divsion operation and return the result.
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback 
 * @returns 
 */
 exports.handler = async(context, event, callback) => {
  try {
    const {numerator, denominator} = event;
    return callback(null, {result: numerator / denominator});
  } catch(e) {
    return callback(e);
  }
};