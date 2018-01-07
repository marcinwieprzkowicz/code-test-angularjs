import beerDetailTemplate from './ct.beer-detail.template.html';

angular.module('ct.beer-detail.component', []).component('ctBeerDetail', {
  template: beerDetailTemplate,
  bindings: {
    beer: '<'
  },
  controller: BeerDetailController
});

function BeerDetailController($scope) {
  const ctrl = this;
  ctrl.$onInit = function() {
  };
}
