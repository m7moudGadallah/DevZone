const dotenv = require('dotenv');

const configEnv = `${__dirname}/../../.env`;
dotenv.config({ path: configEnv }); // Load environment variables

module.exports = {};
