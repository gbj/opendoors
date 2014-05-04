var app = angular.module('opendoors', ['mgcrea.ngStrap', 'ngAnimate', 'ngRoute', 'ui.calendar'])
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
            $location.url('/login?error');
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
      .when('/404', {templateUrl: '/partials/404', title: "Oh no!"})
      // Index
      .when('/', {
        templateUrl: '/partials/index', 
        controller: "IndexCtrl",
        title: "Home"
      })
      // Users
      .when('/login', {
        templateUrl: '/partials/user/login',
        controller: "LoginCtrl",
        title: "Login"
      })
      .when('/register', {
        templateUrl: '/partials/user/register',
        controller: "RegisterCtrl",
        title: "Create a New Account"
      })
      .when('/logout', {
        templateUrl: '/partials/user/logout',
        controller: "LogoutCtrl",
        title: "Logout"
      })
      // User Admin
      .when('/users', {
        templateUrl: '/partials/user/user_list',
        controller: "UserListCtrl",
        title: "Users"
      })
      .when('/users/new', {
        templateUrl: '/partials/user/register',
        controller: "UserCreateCtrl",
        title: "Add a User"
      })
      .when('/users/:slug', {
        templateUrl: '/partials/user/user_detail',
        controller: "UserDetailCtrl",
        title: "Users"
      })
      .when('/users/:slug/edit', {
        templateUrl: '/partials/user/user_update',
        controller: "UserUpdateCtrl",
        title: "Edit a User"
      })
      .when('/users/:slug/delete', {
        templateUrl: '/partials/user/user_delete',
        controller: "UserDeleteCtrl",
        title: "Delete a User"
      })
      // People
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
      // Events
      .when('/event', {
        templateUrl: '/partials/events/event_list',
        controller: "EventListCtrl",
        title: "Events"
      })
      .when('/event/new', {
        templateUrl: '/partials/events/event_create',
        controller: "EventCreateCtrl",
        title: "Add an Event"
      })
      .when('/event/:slug', {
        templateUrl: '/partials/events/event_detail',
        controller: "EventDetailCtrl",
        title: "Events"
      })
      .when('/event/:slug/edit', {
        templateUrl: '/partials/events/event_update',
        controller: "EventUpdateCtrl",
        title: "Edit an Event"
      })
      .when('/event/:slug/delete', {
        templateUrl: '/partials/events/event_delete',
        controller: "EventDeleteCtrl",
        title: "Delete an Event"
      })
      // Congregations
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
  $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
      //Change page title, based on Route information
      $rootScope.title = $route.current.title;
    });
});

app.controller("IndexCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  if(user && user.congregation) {
    $scope.username = user.username;
    $scope.congregation = {};
    $http.get('/api/congregation/'+user.congregation)
      .success(function(data) {
        $scope.congregation = data;
      })
      .error(function(err) {
        console.log(err);
      });
  } else {
    $location.url('/login');
  }
}]);

app.controller("NavCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  if(user && user.congregation) {
    $scope.username = user.username;
    $scope.congregation = {};
    $http.get('/api/congregation/'+user.congregation)
      .success(function(data) {
        $scope.congregation = data;
      })
      .error(function(err) {
        console.log(err);
      });
  }
}]);