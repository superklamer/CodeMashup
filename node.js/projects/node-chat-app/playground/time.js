var moment = require('moment');

var date = moment();
console.log(date.format('h:mm a'))
console.log(moment(date).fromNow());
