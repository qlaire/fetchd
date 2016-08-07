  app.config(function($stateProvider) {
    $stateProvider.state('dog', {
      url: '/dog/:dogId',
      templateUrl: 'js/dog/dog.html',
      resolve: {
        theDog: function(PetFactory, $stateParams) {
          return PetFactory.getDogById($stateParams.dogId);
        },
        theShelter: function (PetFactory) {
          
        }
      },
      controller: function(PetFactory, theDog, $scope, $log) {
        $scope.dog = theDog;
      }
    })
  });