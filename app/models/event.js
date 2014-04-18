var mongoose = require('mongoose'),
    slugs = require('mongoose-uniqueslugs'),
    RRule = require('rrule').RRule;

var eventSchema = new mongoose.Schema({
  congregation: {type: mongoose.Schema.Types.ObjectId, ref: 'Congregation'},
  name: {type: String, required: true},
  host: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
  permission: {
    type: String,
    required: true,
    enum: ['Private', 'Congregation', 'Public']
  },
  event_type: {type: String, required: true},
  room: String,
  desc: String,
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  rrule: String
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
slugs.enhanceSchema(eventSchema, {
  source: 'name'
});

// Register the model
var Event = mongoose.model('Event', eventSchema);
slugs.enhanceModel(Event, {});
module.exports = Event;