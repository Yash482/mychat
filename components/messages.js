const moment = require('moment');
// for correct time

function formatMessage(username, text) {
    return {
        username : username,
        text : text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;