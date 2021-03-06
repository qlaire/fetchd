app.directive('ball', function($state) {
  return {
    restrict: 'E',
    scope: {
      pet: '='
    },
    link: function(scope, elem, attrs) {
      
      scope.$watch('pet.match', function(newVal, oldVal) {
        let newHeight = Math.pow(newVal + 1, 2) * 30;
        if (newHeight > 480) {newHeight = 480}
        if (newVal > 0 && newVal > oldVal) {
          elem.css('height', newHeight + 'px');
          elem.css('width', newHeight + 'px');
        }
      });

      scope.$watch('pet.best', function (newVal, oldVal) {
        if (newVal) {
          elem.addClass('wiggle-ball');
        } else {
          elem.removeClass('wiggle-ball');
        }
      });

      
    }
  };
});