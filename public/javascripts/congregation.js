var app = angular.module('opendoors');

app.controller("CongregationListCtrl", ngCRUD.readList('/api/congregation'));
app.controller("CongregationDetailCtrl", ngCRUD.read('/api/congregation')); // ngCRUD will add slug
app.controller("CongregationDeleteCtrl", ngCRUD.delete('/api/congregation', '/congregation'));
app.controller("CongregationCreateCtrl", ngCRUD.create('/api/congregation', '/congregation', {
  newObj: {
    parent: null, name: '', phone: [], social_media: [], address: []
  },
  addedScope: function($scope, $http) {
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });
  },
  preSave: function($scope, $http) {
    $scope.newObj.congregation = $scope.newObj.congregation._id;
  }
}));
app.controller("CongregationUpdateCtrl", ngCRUD.update('/api/congregation', '/', {
  addedScope: function($scope, $http, slug) {
    $http.get('/api/congregation')
      .success(function(data) {
        $scope.congregations = data;
      })
      .error(function(data) {
        console.log("Error: ", data);
      });

      // Get initial data for the congregation
      $http.get('/api/congregation/'+slug)
        .success(function(data) {
          $scope.newObj = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ', data);
        });
  },
  preSave: function($scope, $http) {
    if($scope.newObj.congregation)
      $scope.newObj.congregation = $scope.newObj.congregation._id;
  }
}));