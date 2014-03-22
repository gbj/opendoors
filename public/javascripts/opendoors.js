var app = angular.module('opendoors', [])
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

app.config(['$routeProvider', '$locationProvider', '$httpProvider',
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
      .when('/congregation')
      .when('/congregation/new')
      .when('/:slug')
      .when('/:slug/edit')
      .when('/:slug/delete')
      .otherwise({templateUrl: '/partials/404'});
    $locationProvider.html5Mode(true);
  }]);