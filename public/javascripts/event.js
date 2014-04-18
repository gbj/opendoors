var app = angular.module('opendoors');

app.controller("EventListCtrl", ['$scope', '$http', '$filter',
  function ($scope, $http, $filter) {
    $scope.obj_list = [];
    $scope.eventSources = [$scope.obj_list];

    // When we load the page, GET the list of events
    $http.get('/api/event')
      .success(function(data) {
        for(var ii in data) {
          var obj = data[ii];
          $scope.obj_list.push({
            id: obj.id,
            title: obj.name,
            url: '/event/'+obj.slug,
            start: new Date(obj.start),
            end: new Date(obj.end)
          })
        }
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
]);
app.controller("EventDetailCtrl", ngCRUD.read('/api/event', {
  populate: ['congregation', 'host']
}));
app.controller("EventDeleteCtrl", ngCRUD.delete('/api/event', '/event'));
app.controller("EventCreateCtrl", ngCRUD.create('/api/event', '/event', {
  newObj: {
    start: new Date().setMinutes(0),
    end: new Date(new Date().setTime(new Date().getTime() + (60*60*1000))).setMinutes(0)
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

app.controller("EventUpdateCtrl", ngCRUD.update('/api/event', '/event', {
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
    $http.get('/api/event/'+slug)
      .success(function(data) {
        $scope.newObj = data;
        console.log('newObj: ', data);
      })
      .error(function(data) {
        console.log('Error: ', data);
      });
  }
}));