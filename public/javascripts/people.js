var app = angular.module('opendoors');

var ngCRUD = {
  readList: function(api) {
    return ['$scope', '$http',
    function ($scope, $http) {
      $scope.obj_list = [];

      // When we load the page, GET the list of people
      $http.get(api)
        .success(function(data) {
          $scope.obj_list = data;
          console.log(data);
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
  ]
  }
};

app.controller("PersonListCtrl", ngCRUD.readList('/api/people'));

app.controller("PersonDetailCtrl",
  ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $scope.person = undefined;
    console.log($routeParams);

    $http.get('/api/people/'+$routeParams.slug)
      .success(function(data) {
        $scope.person = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
]);

app.controller("PersonCreateCtrl",
  ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.newObj = {
      first_name: '',
      last_name: '',
      date: [],
      email: [],
      phone: [],
      social_media: [],
      address: []
    };

    $scope.congregations = undefined;
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });

    $scope.save = function(form) {
      $scope.newObj.congregation = $scope.newObj.congregation._id;
      $http.post('/api/people/', $scope.newObj)
        .success(function(response) {
          if (response.error) {
            console.log(response.error);
          } else if (response.obj) {
            $location.path('/people/'+response.obj.slug);
          }
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);

app.controller("PersonUpdateCtrl",
  ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {
    $scope.newObj = undefined;

    $scope.congregations = undefined;
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });

    // Get initial data for the person
    $http.get('/api/people/'+$routeParams.slug)
      .success(function(data) {
        $scope.newObj = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.save = function(form) {
      console.log($scope.newObj);
      $http.put('/api/people/'+$scope.newObj.slug, $scope.newObj)
        .success(function(response) {
          if(response.error) {
            console.log(response.error)
          } else {
            $location.path('/people/'+response.obj.slug);
          }
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);

app.controller("PersonDeleteCtrl",
  ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    console.log($routeParams);
    $scope.person = undefined;

    $http.get('/api/people/'+$routeParams.slug)
      .success(function(data) {
        $scope.person = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.del = function() {
      $http.delete('/api/people/'+$routeParams.slug)
        .success(function(data) {
          $location.path('/people');
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);