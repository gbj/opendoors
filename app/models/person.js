var mongoose = require('mongoose'),
    slugs = require('mongoose-uniqueslugs');

var personSchema = new mongoose.Schema({
  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  date: [{
    label: {type: String, required: true},
    value: {type: Date, required: true}
  }],
  email: [{
    preferred: Boolean,
    label: {type: String, required: true},
    value: {type: String, required: true}
  }],
  phone: [{
    preferred: Boolean,
    label: {type: String, required: true},
    value: {type: String, required: true}
  }],
  social_media: [{
    label: {type: String, required: true},
    value: {type: String, required: true},
  }],
  address: [{
    preferred: Boolean,
    label: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: String,
    zip: String
  }],
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
personSchema.virtual('name').get(function () {
  return (this.first_name+" "+this.last_name);
});
slugs.enhanceSchema(personSchema, {
  source: 'name'
})

// Register the model
var Person = mongoose.model('Person', personSchema);
slugs.enhanceModel(Person, {});
module.exports = Person;
