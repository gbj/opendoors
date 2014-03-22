var app = angular.module('opendoors', [])
  .config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/people', {
          templateUrl: '/partials/person_list',
          controller: "PersonListCtrl"
        })
        .when('/people/new', {
          templateUrl: '/partials/person_create',
          controller: "PersonCreateCtrl"
        })
        .when('/people/:slug', {
          templateUrl: '/partials/person_detail',
          controller: "PersonDetailCtrl"
        })
        .when('/people/:slug/edit', {
          templateUrl: '/partials/person_update',
          controller: "PersonUpdateCtrl"
        })
        .when('/people/:slug/delete', {
          templateUrl: '/partials/person_delete',
          controller: "PersonDeleteCtrl"
        })
        .otherwise({templateUrl: '/partials/404'});
      $locationProvider.html5Mode(true);
    }])
  .config(function($httpProvider) {
  // Authorization -- this will display a login view
  // if we get a 401 error (Unauthorized)
  $httpProvider.responseInterceptors.push(function($location) {
    return function(promise) {
      return promise.then(
        // Success: return the response
        function(res) {
          return res;
        },
        // Error: if 401 or 404, act
        function(res) {
          if(res.status === 401) {
            $location.url('/user/login');
          } else if (res.status === 404) {
            $location.url('/404')
          }
        }
      );
    }
  });
});
    
app.controller("PersonListCtrl",
  ['$scope', '$http',
  function ($scope, $http) {
    $scope.people = [];

    // When we load the page, GET the list of people
    $http.get('/api/people')
      .success(function(data) {
        $scope.people = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });

    $scope.quickdelete = function(slug) {
      $http.delete('/api/people/'+slug)
        .success(function(data) {
          $scope.people = data;
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
    }
  }
]);

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

    $scope.save = function(form) {
      console.log($scope.newObj);
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