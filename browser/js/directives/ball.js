app.directive('ball', function() {
  return {
    restrict: 'E',
    scope: {
      pet: '='
    },
    link: function(scope, elem, attrs) {
      
      scope.$watch('pet.match', function(newVal, oldVal) {
        let oldHeight = elem.css('height');
        let newHeight = (newVal + 1) * 15;
        console.log('the new height', newHeight);
        if (newVal > 0 && newVal > oldVal) {
          elem.css('height', newHeight + 'px');
          elem.css('width', newHeight + 'px');
        }
      });
    }
  };
});