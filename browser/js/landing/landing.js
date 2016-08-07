app.config(function($stateProvider) {
  $stateProvider.state('landing', {
    url: '/',
    templateUrl: 'js/landing/landing.html',
    controller: function ($scope, $state) {
      $scope.fetchPets = function () {
        $state.go('home', {zip: $scope.zip});
      }
    }
  })
})