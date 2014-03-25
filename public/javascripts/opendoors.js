var app = angular.module('opendoors', ['mgcrea.ngStrap', 'ngAnimate', 'ngRoute'])
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
        templateUrl: '/partials/people/person_list',
        controller: "PersonListCtrl",
        title: "People"
      })
      .when('/people/new', {
        templateUrl: '/partials/people/person_create',
        controller: "PersonCreateCtrl",
        title: "Add a Person"
      })
      .when('/people/:slug', {
        templateUrl: '/partials/people/person_detail',
        controller: "PersonDetailCtrl",
        title: "People"
      })
      .when('/people/:slug/edit', {
        templateUrl: '/partials/people/person_update',
        controller: "PersonUpdateCtrl",
        title: "Edit a Person"
      })
      .when('/people/:slug/delete', {
        templateUrl: '/partials/people/person_delete',
        controller: "PersonDeleteCtrl",
        title: "Delete a Person"
      })
      .when('/congregation', {
        templateUrl: '/partials/congregations/congregation_list',
        controller: 'CongregationListCtrl',
        title: "Congregations"
      })
      .when('/congregation/new', {
        templateUrl: '/partials/congregations/congregation_create',
        controller: 'CongregationCreateCtrl',
        title: "Add a Congregation"
      })
      .when('/:slug', {
        templateUrl: '/partials/congregations/congregation_detail',
        controller: 'CongregationDetailCtrl',
        title: "Congregations"
      })
      .when('/:slug/edit', {
        templateUrl: '/partials/congregations/congregation_update',
        controller: 'CongregationUpdateCtrl',
        title: "Edit a Congregation"
      })
      .when('/:slug/delete', {
        templateUrl: '/partials/congregations/congregation_delete',
        controller: 'CongregationDeleteCtrl',
        title: "Delete a Congregation"
      })
      .otherwise({templateUrl: '/partials/404', title: "Oh no!"});
    $locationProvider.html5Mode(true);
  }]);

app.run(function($rootScope, $route) {
  $rootScope.accessors = {
    getId: function(mongo_obj) {
      return mongo_obj._id;
    }
  }
  $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
      //Change page title, based on Route information
      $rootScope.title = $route.current.title;
    });
});