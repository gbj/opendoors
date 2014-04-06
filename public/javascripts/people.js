var app = angular.module('opendoors');

app.controller("PersonListCtrl", ngCRUD.readList('/api/people'));
app.controller("PersonDetailCtrl", ngCRUD.read('/api/people', {populate: 'congregation'})); // ngCRUD will add slug
app.controller("PersonDeleteCtrl", ngCRUD.delete('/api/people', '/people'));
app.controller("PersonCreateCtrl", ngCRUD.create('/api/people', '/people', {
  newObj: {
    first_name: '', last_name: '', date: [], email: [], phone: [], social_media: [], address: []
  },
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

app.controller("PersonUpdateCtrl", ngCRUD.update('/api/people', '/people', {
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
    
    // Get initial data for the person
    $http.get('/api/people/'+slug)
      .success(function(data) {
        $scope.newObj = data;
        console.log('newObj: ', data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
}));