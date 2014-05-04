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
    enum: ['Private', 'Staff', 'Congregation', 'Public']
  },
  event_type: {type: String, required: true},
  room: String,
  desc: String,
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  rrule: {
    freq: Number,
    interval: Number,
    until: Date
  }
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
eventSchema.method('occurrences', function(start, end) {
  var evn = this;
  if(JSON.stringify(this.rrule) != '{}') {
    var rule = new RRule({
      freq: this.rrule.freq,
      interval: this.rrule.interval,
      dtstart: this.start,
      until: this.rrule.until
    });
    var occs = rule.between(start, end);
    var ret = occs.map(function(occ) {
      evnt = evn.toObject();
      evnt.end = new Date(occ.getTime() + (evnt.end - evnt.start)).toString();
      evnt.start = occ.toString();
      return evnt;
    });
    return ret;
  } else {
    return [evn.toObject()];    
  }
});
slugs.enhanceSchema(eventSchema, {
  source: 'name'
});

// Register the model
var Event = mongoose.model('Event', eventSchema);
slugs.enhanceModel(Event, {});
module.exports = Event;