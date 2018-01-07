import beerDetailTemplate from './ct.beer-detail.template.html';

angular.module('ct.beer-detail.component', []).component('ctBeerDetail', {
  template: beerDetailTemplate,
  bindings: {
    beer: '<'
  },
  controller: BeerDetailController
});

function BeerDetailController($scope, $element) {
  const ctrl = this;
  ctrl.$onInit = function() {
  };

  ctrl.$onChanges = function() {
    $scope.isImageLoaded = false;

    $element.find('img').bind('load', function() {
      $scope.$apply(function() {
        $scope.isImageLoaded = true;
      });
    });
  };
}
