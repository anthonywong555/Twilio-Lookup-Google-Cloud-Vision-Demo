/**
 * This driver will perform OCR, using Google Vision, on MMS.
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback 
 * @returns 
 */
exports.handler = async(context, event, callback) => {
  try {
    const {mediaURL} = event;
    
    // Load Google Creds from Assets
    const googleCreds = JSON.parse(Runtime.getAssets()['/google-creds.json'].open());
    const {project_id, private_key, client_email} = googleCreds;
    const vision = require('@google-cloud/vision');

    // Specifies the location of the api endpoint
    const clientOptions = {
      credentials: {
        client_email,
        private_key
      },
      projectId: project_id
    };

    // Creates a client
    const client = new vision.ImageAnnotatorClient(clientOptions);

    // Performs text detection on the image file
    const [result] = await client.textDetection(mediaURL);
    const labels = result.textAnnotations;

    // Returns all text from the MMS.
    const allText = labels[0].description;

    return callback(null, allText);
  } catch(e) {
    return callback(e);
  }
};