var CRUD = require('./crud'),
    Person = require('./models/person'),
    Congregation = require('./models/congregation');

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

  // Frontend -- Client
  // Jade partials
  app.get('/partials/*', function (req, res) {
    var name = req.params[0];
    res.render('partials/' + name);
  });
  // Everything else goes to Angular.js client router
  app.get('/*', function(req, res) { res.render('layout'); });
}