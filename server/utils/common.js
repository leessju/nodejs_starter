const moment = require('moment');

module.exports = {
  today: (format) => {
    return moment(new Date()).format(format);
  }
}