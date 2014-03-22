function construct(model, args) {
    function F() {
        return model.apply(this, args);
    }
    F.prototype = model.prototype;
    return new F();
}

module.exports = {
  readAll: function(model) {
    return (function(req, res) {
      model.find().exec(function(err, list) {
        if(err) {
          next(err);
        } else {
          res.json(list);
        }
      });
    });
  },
  read: function(model) {
    return (function(req, res) {
      model.findOne({slug: req.params.slug}).exec(function(err, obj) {
        if(err || obj === null) {
          res.status(404);
          res.send('404');
        } else {
          res.json(obj);
        }
      });
    });
  },
  create: function(model) {
    return (function(req, res) {
      var obj = construct(model, [req.body]);
      obj.validate(function(error) {
        if(error) {
          res.json({error : error });
        } else {
          obj.save(function(error, doc) {
            res.json({obj: doc});
          });
        }
      });
    });
  },
  update: function(model) {
    return (function(req, res) {
      var obj = req.body;
      delete obj._id;
      model.findOneAndUpdate({slug: req.params.slug}, obj, function(err, doc) {
        if(err) {
          throw err;
        } else {
          res.json({obj: doc});
        }
      });
    });
  },
  delete: function(model) {
    return (function(req, res) {
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
    });
  }
}