app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/results/:zip',
        templateUrl: 'js/home/home.html',
        controller: 'PetController',
        resolve: {
            thePets: function (PetFactory, $stateParams) {
                return PetFactory.getDogs($stateParams.zip);
            }
        }
    });
});

app.controller('PetController', function(PetFactory, $log, $scope, $state, thePets) {
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

    let changeHist = {};

    $scope.fetchPup = function(prop) {
        if (!changeHist[prop]) {
           $scope.pets.forEach(pet => {
               if (pet[prop] === $scope.fetch[prop]) {
                   pet.match++;
               }
           });
           changeHist[prop] = true;
        } else {
            $scope.pets.forEach(pet => {
                if (pet[prop] === $scope.fetch[prop]) {
                    pet.match++;
                } else {
                    if (pet.match > 0) {
                        pet.match--;
                    }
                }
            });
        }
        let bestNum = 0;
        $scope.pets.forEach(pet => {
            if (pet.match > bestNum) {
                bestNum = pet.match;
            }
        });
        $scope.pets.forEach(pet => {
            if (pet.match === bestNum) {
                pet.best = true;
            } else {
                pet.best = false;
            }
        })
    };

    $scope.goToDog = function(id) {
        $state.go('dog', {dogId: id});
    };

    $scope.pets = thePets;
    
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
        petObj.best = false;
        return petObj;
    };
    let dogInfo = function(dog) {
        let dogObj = {};
        dogObj.age = dog.age.$t;
        dogObj.size = dog.size.$t;
        dogObj.sex = dog.sex.$t;
        dogObj.breeds = Array.isArray(dog.breeds.breed) ? dog.breeds.breed.map(item => item.$t) : [dog.breeds.breed.$t];
        dogObj.name = dog.name.$t;
        dogObj.description = dog.description.$t;
        dogObj.photo = dog.media ? dog.media.photos.photo[2].$t : 'http://www.yellowknifeford.com/static/img/core/no_image_available.jpg';
        dogObj.shelterId = dog.shelterPetId.$t;
        return dogObj;
    }
    petf.getRandomPet = function() {
        return $http.jsonp(`http://api.petfinder.com/pet.getRandom?format=json&output=full&animal=dog&location=20121&key=${key}&callback=JSON_CALLBACK`)
        .then(res => res.data.petfinder);
    };
    petf.getDogById = function(id) {
        return $http.jsonp(`http://api.petfinder.com/pet.get?format=json&key=${key}&id=${id}&callback=JSON_CALLBACK`)
        .then(res => dogInfo(res.data.petfinder.pet));
    }
    petf.getDogs = function(zip) {
        return $http.jsonp(`http://api.petfinder.com/pet.find?format=json&key=${key}&count=100&location=${zip}&animal=dog&callback=JSON_CALLBACK`)
        .then(res => {
            let pets = res.data.petfinder.pets.pet.map(parsePet);
            return pets;
        });
    };
    
    return petf;
});