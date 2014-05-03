var ngCRUD = {
  readList: function(api, opt) {
    return ['$scope', '$http',
      function ($scope, $http) {
        var options = opt || {};
        $scope.obj_list = [];

        // When we load the page, GET the list of objects
        $http.get(api, {
            params: {populate: options.populate ? options.populate : false}
          }) // populates refs with full objs
          .success(function(data) {
            if(options.callback) {
              $scope.obj_list = options.callback(data);
            } else {
              $scope.obj_list = data;
            }
          })
          .error(function(data) {
            console.log('Error: ', data);
          });

        $scope.quickdelete = function(slug) {
          $http.delete(api+'/'+slug)
            .success(function(data) {
              $scope.obj_list = data;
            })
            .error(function(data) {
              console.log('Error: ', data);
            });
        }
      }
    ];
  },
  read: function(api, opt) {
    return ['$scope', '$routeParams', '$http',
      function($scope, $routeParams, $http) {
        var options = opt || {};
        $scope.obj = undefined;

        $http.get(api+'/'+$routeParams.slug, {
            params: {populate: options.populate ? options.populate : false}
          }) // populates refs with full objs
          .success(function(data) {
            $scope.obj = data;
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ', data);
          });
      }
    ];
  },
  create: function(api, redirect_url, options) {
    return ['$scope', '$http', '$location',
      function($scope, $http, $location) {
        options = options || {};
        $scope.newObj = options.newObj || {};

        if(options.addedScope) {
          options.addedScope($scope, $http);
        }

        $scope.save = function(form) {
          $scope.buttonDisabled = true;

          if(options.preSave) {
            options.preSave($scope, $http);
          }
          $http.post(api, $scope.newObj)
            .success(function(response) {
              $scope.buttonDisabled = false;
              if (response.error) {
                console.log(response.error);
              } else if (response.obj) {
                $location.path(redirect_url+'/'+response.obj.slug);
              } else {
                $location.path(redirect_url);
              }
            })
            .error(function(data) {
              $scope.buttonDisabled = false;
              console.log('Error: ', data);
            });
        }
      }
    ];
  },
  update: function(api, redirect_url, options) {
    return ['$scope', '$http', '$location', '$routeParams',
      function($scope, $http, $location, $routeParams) {
        options = options || {};
        $scope.newObj = options.newObj || {};

        if(options.addedScope) {
          options.addedScope($scope, $http, $routeParams.slug);
        }

        $scope.save = function(form) {
          $scope.buttonDisabled = true;

          if(options.preSave) {
            options.preSave($scope, $http);
          }
          $http.put(api+'/'+$routeParams.slug, $scope.newObj)
            .success(function(response) {
              if (response.error) {
                console.log(response.error);
              } else if (response.obj) {
                $location.path(redirect_url+'/'+response.obj.slug);
              }
              $scope.buttonDisabled = false;
            })
            .error(function(data) {
              $scope.buttonDisabled = false;
              console.log('Error: ', data);
            });
        }
      }
    ];
  },
  delete: function(api, redirect_url) {
    return ['$scope', '$routeParams', '$http', '$location',
      function($scope, $routeParams, $http, $location) {
        $scope.obj = undefined;

        $http.get(api+'/'+$routeParams.slug)
          .success(function(data) {
            $scope.obj = data;
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ', data);
          });

        $scope.del = function() {
          $http.delete(api+'/'+$routeParams.slug)
            .success(function(data) {
              $location.path(redirect_url);
            })
            .error(function(data) {
              console.log('Error: ', data);
            });
        }
      }
    ]
  }
};