var url = require('url');

function construct(model, args) {
    function F() {
        return model.apply(this, args);
    }
    F.prototype = model.prototype;
    return new F();
}
function populate(found_init, pop_string) {
  var found = found_init;
  var populates = pop_string;
  if(typeof pop_string === "string") {
    populates = pop_string.split(',');
  }
  if(populates.length > 0) {
    for(var ii in populates) {
      found = found.populate(populates[ii])
    }
  }
  return found;
}

module.exports = {
  readAll: function(model, options) {
    return (function(req, res) {
      // First, check for permission
      var permission = true;
      if(options && options.permission) {
        permission = !!req.user && options.permission(req.user);
      }
      
      if(permission) {
        // Parse URL for any fields in ?populate=...
        var populates = url.parse(req.url, true).query.populate || '';
        // Parse URL for any GET['congregation']
        var congregation = url.parse(req.url, true).query.congregation || false;

        // Get query from options
        var query = {};
        if(options && options.query) {
          query = options.query(req.user, congregation || req.user.congregation);
        }

        // Run the query and return results accordingly
        var found = populate(model.find(query), populates);
        found.exec(function(err, objects) {
          if(err) {
            next(err);
          } else {
            // If there's a filter to be applied, filter the list before returning JSON
            var list;
            if(options && options.filter) {
              list = objects.filter(options.filter(req.user));
            } else {
              list = objects;
            }
            res.json(list);
          }
        });
      } else {
        res.status(403);
        res.json({error: 'You do not have permission to access this resource.'});
      }
    });
  },
  read: function(model, options) {
    return (function(req, res) {
      var populates = url.parse(req.url, true).query.populate || '';
      // Search by slug or by ID
      var query = {$or: [{slug: req.params.slug}]};
      // If it matches a query for a valid ObjectID, add that to query
      if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({_id: req.params.slug});
      }
      var found = populate(model.findOne(query), populates);
      found.exec(function(err, obj) {
        if(err || obj === null) {
          res.status(404);
          res.send('404');
        } else {
          res.json(obj);
        }
      });
    });
  },
  create: function(model, options) {
    return (function(req, res) {
      // First, check for permission
      var permission = true;
      if(options && options.permission) {
        permission = !!req.user && options.permission(req.user);
      }
      
      if(permission) {
        var obj = construct(model, [req.body]);
        obj.validate(function(error) {
          if(error) {
            res.status(400);
            console.log(error);
            res.json({error: error});
          } else {
            obj.save(function(error, doc) {
              console.log("RESPONSE OBJECT: ", doc);
              res.json({obj: doc});
            });
          }
        });
      } else {
        res.status(403);
        res.json({error: 'You do not have permission to access this resource.'});
      }
    });
  },
  update: function(model, options) {
    return (function(req, res) {
      // First, check for permission
      var permission = true;
      if(options && options.permission) {
        permission = !!req.user && options.permission(req.user);
      }
      
      if(permission) {
        var obj = req.body;
        delete obj._id;
        model.findOneAndUpdate({slug: req.params.slug}, obj, function(err, doc) {
          if(err) {
            res.status(400);
            console.log(error);
            res.json({error: error});
          } else {
            console.log("RESPONSE OBJECT: ", doc);
            res.json({obj: doc});
          }
        });
      } else {
        res.status(403);
        res.json({error: 'You do not have permission to access this resource.'});
      }
    });
  },
  delete: function(model, options) {
    return (function(req, res) {
      // First, check for permission
      var permission = true;
      if(options && options.permission) {
        permission = !!req.user && options.permission(req.user);
      }
      
      if(permission) {
        model.findOneAndRemove({slug: req.params.slug}, function(err, doc) {
          if(err) {
            res.status(404);
            res.send('404');
          } else {
            if(err) {
              res.json(err);
            } else {
              model.find().exec(function(err, list) {
                if(err)
                  res.json(err);
                else
                  res.json(list);
              });
            }
          }
        });
      } else {
        res.status(403);
        res.json({error: 'You do not have permission to access this resource.'});
      }
    });
  }
}