var mongoose = require('mongoose'),
    passportLocal = require('passport-local-mongoose'),
    slugs = require('mongoose-uniqueslugs');

var AccountSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  congregation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Congregation',
    required: true
  },
  role: {
    type: String,
    enum: ['Super-Admin', 'Admin', 'Staff', 'Member']
  }
});
AccountSchema.virtual('name').get(function () {
  return (this.first_name+" "+this.last_name);
});

slugs.enhanceSchema(AccountSchema, {
  source: 'name'
})

AccountSchema.plugin(passportLocal);

var Account =  mongoose.model('Account', AccountSchema);
slugs.enhanceModel(Account, {});

module.exports = Account;
