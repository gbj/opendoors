var mongoose = require('mongoose'),
    slugs = require('mongoose-uniqueslugs');

var moment = require('moment');
moment().format();

// Person model
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
  relationships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Relationship',
  }]
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
personSchema.virtual('name').get(function () {
  return (this.first_name+" "+this.last_name);
});
personSchema.virtual('age').get(function() {
  var birthday = null;
  var obj = {age: null, formatted: null};
  var now = moment();
  for(var ii in this.date) {
    var date = this.date[ii];
    if(date.label === "Birthday") {
      birthday = moment(date.value);
    }
  }
  if(birthday) {
    obj.age = now.diff(birthday, 'years');
  }
  if(obj.age < 2) {
    obj.formatted = now.diff(birthday, 'months')+' months old';
  } else {
    obj.formatted = obj.age+' years old';
  }
  return obj;
});
slugs.enhanceSchema(personSchema, {
  source: 'name'
})

// Relationship model
var relationshipSchema = new mongoose.Schema({
  person_a: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  person_b: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  label: {type: String, required: true}
});

// Register the models
var Person = mongoose.model('Person', personSchema),
    Relationship = mongoose.model('Relationship', relationshipSchema);
slugs.enhanceModel(Person, {});
module.exports = {
  Person: Person,
  Relationship: Relationship
};
