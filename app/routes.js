var url = require('url'),
    passport = require('passport'),
    CRUD = require('./crud'),
    people = require('./models/person'),
    Person = people.Person,
    Relationship = people.Relationship,
    Congregation = require('./models/congregation'),
    Account = require('./models/account'),
    Event = require('./models/event');

module.exports = function(app) {
  // Authorization
  app.post('/api/user/register', function(req, res) {
    Account.register(new Account({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username : req.body.username,
      congregation: req.body.congregation
    }), req.body.password, function(err, account) {
      if (err) {
        res.status(400);
        console.log(err);
        res.json(err);
      }

      passport.authenticate('local')(req, res, function () {
        res.status(200);
        res.send('OK');
      });
    });
  });
  app.post('/api/user', function(req, res) {
    Account.register(new Account({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username : req.body.username,
      congregation: req.body.congregation
    }), req.body.password, function(err, account) {
      if (err) {
        res.status(400);
        console.log(err);
        res.json(err);
      }
    });
  });
  app.post('/api/user/login', passport.authenticate('local'), function(req, res) {
    res.send('OK');
  });
  app.get('/api/user/logout', function(req, res) {
    req.logout();
    res.send('OK');
  });
  app.get('/api/user', CRUD.readAll(Account));
  app.get('/api/user/:slug', CRUD.read(Account));
  app.put('/api/user/:slug', CRUD.update(Account));
  app.del('/api/user/:slug', CRUD.delete(Account));

  // URLs
  

  // Backend -- API
  app.get('/api/people', CRUD.readAll(Person, {
    permission: function(user) {
      return !!user;
    },
    query: function(user) {
      return {congregation: user.congregation};
    }
  }));
  app.post('/api/people', CRUD.create(Person));
  app.get('/api/people/:slug', CRUD.read(Person, {
    permission: function(user, obj) {
      return (user.congregation == obj.congregation);
    }
  }));
  app.put('/api/people/:slug', CRUD.update(Person, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin' || (user.role == 'Admin' && user.congregation == obj.congregation));
    }
  }));
  app.del('/api/people/:slug', CRUD.delete(Person, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin' || (user.role == 'Admin' && user.congregation == obj.congregation));
    }
  }));
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
  app.put('/api/congregation/:slug', CRUD.update(Congregation, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin' || (user.role == 'Admin' && user.congregation == obj.congregation));
    }
  }));
  app.del('/api/congregation/:slug', CRUD.delete(Congregation, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin' || (user.role == 'Admin' && user.congregation == obj.congregation));
    }
  }));
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

  app.get('/api/event', CRUD.readAll(Event, {
    query: function(user, congregation) {
      return {congregation: congregation};
    },
    filter: function(user) {
      return function(obj) {
        if(!user) {
          return (obj.permission == 'Public');
        } else {
          return (user.role == 'Super-Admin' || user.id == event.host || obj.permission == 'Public'
                  || (user.role == 'Admin' && user.congregation == obj.congregation)
                  || (user.role == 'Staff' && user.congregation == obj.congregation && obj.permission == 'Staff')
                  || (user.role == 'Member' && user.congregation == obj.congregation && obj.permission == 'Member'));
        }
      }
    }
  }));
  app.get('/api/event.fullcalendar.json', function(req, res) {
    var start = new Date(parseInt(url.parse(req.url, true).query.start)*1000), // from timestamp in seconds to milliseconds
        end = new Date(parseInt(url.parse(req.url, true).query.end)*1000); // from timestamp in seconds to milliseconds
    var events = [];
    Event.find(function(err, objects) {
      // Check for permissions
      var user = req.user;
      var list = objects.filter(function(obj) {
        if(!user) {
          return (obj.permission == 'Public');
        } else {
          return (user.role == 'Super-Admin' || user.id == event.host || obj.permission == 'Public'
                  || (user.role == 'Admin' && user.congregation == obj.congregation)
                  || (user.role == 'Staff' && user.congregation == obj.congregation && obj.permission == 'Staff')
                  || (user.role == 'Member' && user.congregation == obj.congregation && obj.permission == 'Member'));
        }
      });
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
  app.put('/api/event/:slug', CRUD.update(Event, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin'
              || (user.role == 'Admin' && user.congregation == obj.congregation)
              || (user.id == event.host));
    }
  }));
  app.del('/api/event/:slug', CRUD.delete(Event, {
    permission: function(user, obj) {
      return (user.role == 'Super-Admin'
              || (user.role == 'Admin' && user.congregation == obj.congregation)
              || (user.id == event.host));
    }
  }));

  // Frontend -- Client
  // Jade partials
  app.get('/partials/*', function (req, res) {
    var name = req.params[0];
    res.render('partials/' + name, {user: req.user });
  });
  // Everything else goes to Angular.js client router
  app.get('/*', function(req, res) { res.render('layout', { user : req.user }); });
}