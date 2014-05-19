var app = angular.module('opendoors');

// Servie to redirect and login when permission is denied (403 error)
app.value('redirectToUrlAfterLogin', { url: '/' });
app.factory('appAuth', function ($location,  redirectToUrlAfterLogin) {
  return {
    saveAttemptUrl: function() {
      if($location.path().toLowerCase() != '/login') {
        redirectToUrlAfterLogin.url = $location.path();
      }
      else
        redirectToUrlAfterLogin.url = '/';
    },
    loginRedirectUrl: function() {
      return redirectToUrlAfterLogin.url;
    }
  };
});

app.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('securityInterceptor');
})
.provider('securityInterceptor', function() {
  this.$get = function($location, $q, $injector) {
    return function(promise) {
      var appAuth = $injector.get('appAuth');
      return promise.then(null, function(response) {
        if(response.status === 401 || response.status == 403) {
          appAuth.saveAttemptUrl();
          $location.path('/login');
        }
        return $q.reject(response);
      });
    };
  };
});

// User Admin
app.controller("UserListCtrl", ngCRUD.readList('/api/user', {populate: 'congregation'}));
app.controller("UserDetailCtrl", ngCRUD.read('/api/user', {populate: 'congregation'})); // ngCRUD will add slug
app.controller("UserDeleteCtrl", ngCRUD.delete('/api/user', '/users'));
app.controller("UserCreateCtrl", ngCRUD.create('/api/user', '/users', {
  newObj: {},
  addedScope: function($scope, $http) {
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });

    $http.get('/api/people')
      .success(function(data) {
        $scope.people = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });
  }
}));

app.controller("UserUpdateCtrl", ngCRUD.update('/api/user', '/users', {
  addedScope: function($scope, $http, slug) {
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });

    $http.get('/api/people')
      .success(function(data) {
        $scope.people = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });
    
    // Get initial data for the user
    $http.get('/api/user/'+slug)
      .success(function(data) {
        $scope.newObj = data;
        console.log('newObj: ', data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
}));

// Registration and Login
var changeLocation = function($scope, $location, url, forceReload) {
  $scope = $scope || angular.element(document).scope();
  if(forceReload || $scope.$$phase) {
    window.location = url;
  }
  else {
    $location.path(url);
    $scope.$apply();
  }
};

app.controller("LoginCtrl", ['$scope', '$http', '$location', 'appAuth', function($scope, $http, $location, appAuth) {
  $scope.username = "";
  $scope.password = "";
  $scope.error = null;

  $scope.save = function() {
    $scope.buttonDisabled = true;

    // Because AngularJS models don't play well with autocomplete, it's necessary to manually pull values from fields
    $scope.username = $("input[name='username']").val();
    $scope.password = $("input[name='password']").val();
    // End autocomplete fudge

    $http.post('/api/user/login', {
      username: $scope.username,
      password: $scope.password
    })
      .success(function(response) {
        $scope.buttonDisabled = false;
        console.log(response);
        if (response.error) {
          console.log(response.error);
        } else {
          changeLocation($scope, $location, appAuth.loginRedirectUrl(), true);
        }
        
      })
      .error(function(data) {
        $scope.buttonDisabled = false;
        $scope.error = data;
      });
  }
}]);

app.controller("RegisterCtrl", ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.error = null;
  $scope.newObj = {};
  
  $http.get('/api/congregation')
    .success(function(data) {
      $scope.congregations = data;
    })
    .error(function(data) {
      console.log("Error: ", data);
    });

  $scope.save = function(form) {
    // Because AngularJS models don't play well with autocomplete, it's necessary to manually pull values from fields
    $scope.newObj.username = $("input[name='username']").val();
    $scope.newObj.password = $("input[name='password']").val();
    // End autocomplete fudge
  
    $scope.buttonDisabled = true;

    $http.post('/api/user/register', $scope.newObj)
      .success(function(response) {
        $scope.buttonDisabled = false;
        changeLocation($scope, $location, '/', true);
      })
      .error(function(data) {
        $scope.buttonDisabled = false;
        if(data.name === 'BadRequestError') {
          $scope.error = { general: data.message };
        } else if (data.name === 'ValidationError') {
          $scope.error = {};
          for(var key in data.errors) {
            $scope.error[key] = true;
            console.log($scope.error);
          }
        }
      });
  }
}]);

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