var app = angular.module('opendoors');

app.controller("CongregationListCtrl", ngCRUD.readList('/api/congregation'));
app.controller("CongregationDetailCtrl", ngCRUD.read('/api/congregation')); // ngCRUD will add slug
app.controller("CongregationDeleteCtrl", ngCRUD.delete('/api/congregation', '/congregation'));
app.controller("CongregationCreateCtrl", ngCRUD.create('/api/congregation', '/congregation', {
  newObj: {
    parent: null, name: '', phone: [], social_media: [], address: []
  },
}));
app.controller("CongregationUpdateCtrl", ngCRUD.update('/api/congregation', '/congregation'));