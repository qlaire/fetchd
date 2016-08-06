app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'PetController'
    });
});

app.controller('PetController', function(PetFactory, $log, $scope) {
    $scope.fetch = {
        hasShots: null,
        goodCats: null,
        altered: null,
        housetrained: null,
        specialNeeds: null,
        goodDogs: null,
        goodKids: null,
        age: null,
        size: null, 
        sex: null,
        isMix: null
    };

    $scope.fetchPup = function(prop) {
        $scope.pets.forEach(pet => {
            if (pet[prop] === $scope.fetch[prop]) {
                pet.match++;
            }
        });
    };
    
    PetFactory.getDogs()
    .then(pets => {
       $scope.pets = pets;
    })
    .catch($log.error);
    
});

app.factory('PetFactory', function($http) {
    let petf = {};
    let key = '7d3265fe905ec9edfc62e71de0254a00';
    let parsePet = function(pet) {
        let petObj = {};
        petObj.hasShots = false;
        petObj.goodCats = true;
        petObj.altered = false;
        petObj.housetrained = false;
        petObj.specialNeeds = false;
        petObj.goodDogs = true;
        petObj.goodKids = true;
        if (Array.isArray(pet.options.option)) {
            pet.options.option.forEach((opt) => {
                switch (opt.$t) {
                    case 'hasShots':
                        petObj.hasShots = true;
                        break;
                    case 'noCats':
                        petObj.goodCats = false;
                        break;
                    case 'altered':
                        petObj.altered = true;
                        break;
                    case 'housetrained':
                        petObj.housetrained = true;
                        break;
                    case 'specialNeeds':
                        petObj.specialNeeds = true;
                        break;
                    case 'noDogs':
                        petObj.goodDogs = false;
                        break;
                    case 'noKids':
                        petObj.goodKids = false;
                        break;
                    default:
                        break;
                }
            });
        }
        petObj.age = pet.age.$t;
        petObj.size = pet.size.$t;
        petObj.id = pet.id.$t;
        petObj.sex = pet.sex.$t;
        petObj.isMix = pet.mix.$t === 'yes' ? true : false;
        petObj.match = 0;
        return petObj;
    };
    petf.getRandomPet = function() {
        return $http.jsonp(`http://api.petfinder.com/pet.getRandom?format=json&output=full&animal=dog&location=20121&key=${key}&callback=JSON_CALLBACK`)
        .then(res => res.data.petfinder);
    };
    petf.getDogById = function(id) {
        return $http.jsonp(`http://api.petfinder.com/pet.get?format=json&key=${key}&id=${id}&callback=JSON_CALLBACK`)
        .then(res => res.data.petfinder);
    }
    petf.getDogs = function() {
        return $http.jsonp(`http://api.petfinder.com/pet.find?format=json&key=${key}&count=100&location=10008&animal=dog&callback=JSON_CALLBACK`)
        .then(res => {
            let pets = res.data.petfinder.pets.pet.map(parsePet);
            return pets;
        });
    };
    
    return petf;
});