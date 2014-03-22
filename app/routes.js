var Person = require('./models/person');

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
  function readPersonList(req, res) {
    Person.find().sort('first_name').sort('last_name').exec(function(err, people) {
      if(err) {
        next("Oops! Something went wrong when we were searching for people!");
      } else {
        res.json(people);
      }
    });
  }
  function readPerson(req, res) {
    Person.findOne({slug: req.params.slug}).exec(function(err, person) {
      if(err) {
        res.status(404);
      } else {
        res.json(person);
      }
    });
  }
  function createPerson(req, res) {
    var person;
    console.log("POST: ", req.body);
    person = new Person(req.body);
    console.log(person);
    person.validate(function(error) {
      if(error) {
        res.json({error : error });
      } else {
        person.save(function(error, doc) {
          res.json({obj: doc});
        });
      }
    });
  }
  function updatePerson(req, res) {
    var person;
    console.log("PUT: ", req.body);
    var obj = req.body;
    delete obj._id;
    Person.findOneAndUpdate({slug: req.params.slug}, obj, function(err, doc) {
      if(err) {
        throw err;
      } else {
        res.json({obj: doc});
      }
    });
  }
  function deletePerson(req, res) {
    Person.findOneAndRemove({slug: req.params.slug}, function(err, doc) {
      if(err) {
        res.status(404);
      } else {
        if(err) {
          res.json(err);
        } else {
          Person.find().exec(function(err, people) {
            if(err)
              res.json(err);
            else
              res.json(people);
          });
        }
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
  app.get('/partials/*', function (req, res) {
    var name = req.params[0];
    res.render('partials/' + name);
  });

  app.get('/api/people', readPersonList);
  app.get('/api/people.csv', readPersonListCSV);
  app.post('/api/people', createPerson);
  app.get('/api/people/:slug', readPerson);
  app.put('/api/people/:slug', updatePerson);
  app.del('/api/people/:slug', deletePerson);

  // Angular.js
  app.get('/*', function(req, res) { res.render('layout'); });
}