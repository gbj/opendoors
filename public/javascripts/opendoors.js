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
        controller: "PersonListCtrl",
        title: "People"
      })
      .when('/people/new', {
        templateUrl: '/partials/person_create',
        controller: "PersonCreateCtrl",
        title: "Add a Person"
      })
      .when('/people/:slug', {
        templateUrl: '/partials/person_detail',
        controller: "PersonDetailCtrl",
        title: "People"
      })
      .when('/people/:slug/edit', {
        templateUrl: '/partials/person_update',
        controller: "PersonUpdateCtrl",
        title: "Edit a Person"
      })
      .when('/people/:slug/delete', {
        templateUrl: '/partials/person_delete',
        controller: "PersonDeleteCtrl",
        title: "Delete a Person"
      })
      .when('/congregation', {
        templateUrl: '/partials/congregation_list',
        controller: 'CongregationListCtrl',
        title: "Congregations"
      })
      .when('/congregation/new', {
        templateUrl: '/partials/congregation_create',
        controller: 'CongregationCreateCtrl',
        title: "Add a Congregation"
      })
      .when('/:slug', {
        templateUrl: '/partials/congregation_detail',
        controller: 'CongregationDetailCtrl',
        title: "Congregations"
      })
      .when('/:slug/edit', {
        templateUrl: '/partials/congregation_update',
        controller: 'CongregationUpdateCtrl',
        title: "Edit a Congregation"
      })
      .when('/:slug/delete', {
        templateUrl: '/partials/congregation_delete',
        controller: 'CongregationDeleteCtrl',
        title: "Delete a Congregation"
      })
      .otherwise({templateUrl: '/partials/404', title: "Oh no!"});
    $locationProvider.html5Mode(true);
  }]);

app.run(function($rootScope, $route) {
  $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
      //Change page title, based on Route information
      $rootScope.title = $route.current.title;
    });
});