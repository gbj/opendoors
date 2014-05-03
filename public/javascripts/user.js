var app = angular.module('opendoors');

var changeLocation = function($scope, $location, url, forceReload) {
  $scope = $scope || angular.element(document).scope();
  if(forceReload || $scope.$$phase) {
    window.location = url;
  }
  else {
    //only use this if you want to replace the history stack
    //$location.path(url).replace();

    //this this if you want to change the URL and add it to the history stack
    $location.path(url);
    $scope.$apply();
  }
};

app.controller("LoginCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.username = "";
  $scope.password = "";
  $scope.save = function() {
    // Because AngularJS models don't play well with autocomplete, it's necessary to manually pull values from fields
    $scope.username = $("input[name='username']").val();
    $scope.password = $("input[name='password']").val();
    // End autocomplete fudge

    $http.post('/api/user/login', {
      username: $scope.username,
      password: $scope.password
    })
      .success(function(response) {
        console.log(response);
        if (response.error) {
          console.log(response.error);
        } else {
          changeLocation($scope, $location, '/', true);
        }
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
}]);

app.controller("RegisterCtrl", ngCRUD.create('/api/user/register', '/login', {
  addedScope: function($scope, $http) {
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });
  }
}));

app.controller("LogoutCtrl", ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
  $scope.logout = function() {
    $http.get('/api/user/logout')
      .success(function(response) {
        if (response.error) {
          console.log(response.error);
        } else {
          changeLocation($scope, $location, '/', true);
        }
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
  $scope.back = function() {
    $window.history.back();
  }
}]);