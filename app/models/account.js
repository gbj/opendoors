var mongoose = require('mongoose'),
    passportLocal = require('passport-local-mongoose');

var AccountSchema = new mongoose.Schema({
  congregation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Congregation',
    required: true
  }
});

AccountSchema.plugin(passportLocal);

var Account =  mongoose.model('Account', AccountSchema);

module.exports = Account;
