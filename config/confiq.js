const fs = require('fs');
const key = fs.readFileSync('E:/graphql-intro/certs/key.pem');

module.exports = {
    secret: key
}