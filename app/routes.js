var url = require('url'),
    CRUD = require('./crud'),
    people = require('./models/person'),
    Person = people.Person,
    Relationship = people.Relationship,
    Congregation = require('./models/congregation'),
    Event = require('./models/event');

module.exports = function(app) {
  // API
  function readPersonListCSV(req, res) {
    var csvheader = [['First Name', 'Last Name']];
    function personToCSV(person) {
      return [person.first_name, person.last_name];
    }
    Person.find().sort('first_name').sort('last_name').exec(function(err, people) {
      if(err) {
        next("Oops! Something went wrong when we were searching for people!");
      } else {
        var list = csvheader.concat(people.map(personToCSV));
        console.log(people.map(personToCSV));
        console.log(list)
        res.csv(list);
      }
    });
  }

  // Authorization
  var passport = require('passport');
  var auth = function(req, res, next) {
    if(!req.isAuthenticated())
      res.send(401);
    else
      next();
  }
  app.get('/user/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });
  app.post('/user/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
  });
  app.post('/user/logout', function(req, res) {
    res.logOut();
    res.send(200);
  });

  // URLs
  

  // Backend -- API
  app.get('/api/people', CRUD.readAll(Person));
  app.post('/api/people', CRUD.create(Person));
  app.get('/api/people/:slug', CRUD.read(Person));
  app.put('/api/people/:slug', CRUD.update(Person));
  app.del('/api/people/:slug', CRUD.delete(Person));
  app.get('/api/people/:slug/relationships', function(req, res) {
    Person.findOne({slug: req.params.slug}).exec(function(err, obj) {
      if(err || obj === null) {
        res.status(404);
        res.send('404');
      } else {
        obj.relationships(function(err, relationships) {
          if(err) {
            res.status(404);
            res.send('404');
          } else {
            return res.json(relationships);
          }
        });
      }
    });
  });
  app.post('/api/people/relationships', CRUD.create(Relationship));
  app.del('/api/people/relationships/:slug', CRUD.delete(Relationship));
  app.put('/api/people/relationships/:slug', CRUD.update(Relationship));

  app.get('/api/congregation', CRUD.readAll(Congregation));
  app.post('/api/congregation', CRUD.create(Congregation));
  app.get('/api/congregation/:slug', CRUD.read(Congregation));
  app.put('/api/congregation/:slug', CRUD.update(Congregation));
  app.del('/api/congregation/:slug', CRUD.delete(Congregation));
  app.get('/api/congregation/:slug/members', function(req, res) {
    Congregation.findOne({slug: req.params.slug}).exec(function(err, obj) {
      if(err || obj === null) {
        res.status(404);
        res.send('404');
      } else {
        Person.find({congregation: obj.id}).exec(function(err, obj) {
          if(err || obj === null) {
            res.status(404);
            res.send('404');
          } else {
            res.json(obj);
          }
        });
      }
    });
  });

  app.get('/api/event', CRUD.readAll(Event));
  app.get('/api/event.fullcalendar.json', function(req, res) {
    var start = new Date(parseInt(url.parse(req.url, true).query.start)*1000), // from timestamp in seconds to milliseconds
        end = new Date(parseInt(url.parse(req.url, true).query.end)*1000); // from timestamp in seconds to milliseconds
    var events = [];
    Event.find(function(err, list) {
      for(var ii in list) {
        var obj = list[ii],
            occ = obj.occurrences(start, end);
        for(var jj in occ) {
          var o = occ[jj];
          events.push({
            id: o.slug,
            title: o.name,
            url: '/event/'+o.slug,
            start: o.start,
            end: o.end
          });
        }
      }
      res.json(events);
    });
  })
  app.post('/api/event', CRUD.create(Event));
  app.get('/api/event/:slug', CRUD.read(Event));
  app.put('/api/event/:slug', CRUD.update(Event));
  app.del('/api/event/:slug', CRUD.delete(Event));

  // Frontend -- Client
  // Jade partials
  app.get('/partials/*', function (req, res) {
    var name = req.params[0];
    res.render('partials/' + name);
  });
  // Everything else goes to Angular.js client router
  app.get('/*', function(req, res) { res.render('layout'); });
}