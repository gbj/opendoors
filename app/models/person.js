var mongoose = require('mongoose'),
    slugs = require('mongoose-uniqueslugs');

var moment = require('moment');
moment().format();

var personSchema = new mongoose.Schema({
  congregation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Congregation',
    required: true
  },
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
personSchema.virtual('age').get(function() {
  var birthday = null;
  for(var ii in this.date) {
    var date = this.date[ii];
    if(date.label === "Birthday" || date.label === "birthday") {
      birthday = moment(date.value);
    }
  }
  if(birthday) {
    var now = moment();
    var age = now.diff(birthday, 'years');
    if(age < 2) {
      age = now.diff(birthday, 'months')+' months old';
    } else {
      age = age+' years old';
    }
    return age;
  } else {
    return null;
  }
});
slugs.enhanceSchema(personSchema, {
  source: 'name'
})

// Register the model
var Person = mongoose.model('Person', personSchema);
slugs.enhanceModel(Person, {});
module.exports = Person;
