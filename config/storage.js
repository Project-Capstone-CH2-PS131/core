const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  keyFilename: 'cloud-storage.json',
});

module.exports = storage;
