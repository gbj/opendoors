var mongoose = require('mongoose'),
    slugs = require('mongoose-uniqueslugs');

var congregationSchema = new mongoose.Schema({
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  name: {type: String, required: true},
  color: {type: String},
  website: {type: String},
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
    label: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: String,
    zip: String,
  }],
  rooms: [{
    label: {type: String, required: true},
    value: {type: String, required: true},
  }]
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
slugs.enhanceSchema(congregationSchema, {
  source: 'name'
})

// Register the model
var Congregation = mongoose.model('Congregation', congregationSchema);
slugs.enhanceModel(Congregation, {});
module.exports = Congregation;