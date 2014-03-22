var app = angular.module('opendoors');

app.controller("CongregationListCtrl",
  ['$scope', '$http',
  function ($scope, $http) {
    $scope.people = [];

    // When we load the page, GET the list of people
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.people = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.quickdelete = function(slug) {
      $http.delete('/api/congregation/'+slug)
        .success(function(data) {
          $scope.people = data;
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);

app.controller("CongregationDetailCtrl",
  ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $scope.Congregation = undefined;
    console.log($routeParams);

    $http.get('/api/congregation/'+$routeParams.slug)
      .success(function(data) {
        $scope.Congregation = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
]);

app.controller("CongregationCreateCtrl",
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
      console.log($scope.newObj);
      $http.post('/api/congregation/', $scope.newObj)
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

app.controller("CongregationUpdateCtrl",
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

    // Get initial data for the Congregation
    $http.get('/api/congregation/'+$routeParams.slug)
      .success(function(data) {
        $scope.newObj = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.save = function(form) {
      console.log($scope.newObj);
      $http.put('/api/congregation/'+$scope.newObj.slug, $scope.newObj)
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

app.controller("CongregationDeleteCtrl",
  ['$scope', '$routeParams', '$http', '$location',
  function($scope, $routeParams, $http, $location) {
    console.log($routeParams);
    $scope.Congregation = undefined;

    $http.get('/api/congregation/'+$routeParams.slug)
      .success(function(data) {
        $scope.Congregation = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.del = function() {
      $http.delete('/api/congregation/'+$routeParams.slug)
        .success(function(data) {
          $location.path('/people');
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);