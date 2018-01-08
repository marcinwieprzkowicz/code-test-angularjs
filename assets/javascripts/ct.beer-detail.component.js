import beerDetailTemplate from './ct.beer-detail.template.html';

angular.module('ct.beer-detail.component', []).component('ctBeerDetail', {
  template: beerDetailTemplate,
  bindings: {
    beer: '<'
  },
  controller: BeerDetailController
});

function BeerDetailController($scope, $element, $timeout) {
  const ctrl = this;
  // there is only one image to choose from at this point
  const imgJq = $element.find('img');

  ctrl.$onInit = function() {
    imgJq.on('load', onBeerImageLoaded);
    $scope.beerSelected = false;
  };

  ctrl.$onChanges = function(changes) {
    if (angular.isUndefined(changes.beer.currentValue)) {
      return;
    }

    $scope.beerSelected = true;

    // if image is not cached then turn on spinner until it loads
    if (!imgJq[0].complete) {
      $scope.isImageLoaded = false;
      // If image times out, go ahead and show the rest of the content
      $timeout(function() {
        displayBeerImage();
      }, 3000);
    }
  };

  function onBeerImageLoaded() {
    displayBeerImage();
  }

  function displayBeerImage() {
    $scope.$apply(function() {
      $scope.isImageLoaded = true;
    });
  }

  ctrl.$onDestroy = function() {
    imgJq.off('load', onBeerImageLoaded);
  };

}
