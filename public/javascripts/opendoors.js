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