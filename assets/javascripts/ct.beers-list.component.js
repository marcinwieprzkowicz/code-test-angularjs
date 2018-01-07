import beersListTemplate from './ct.beers-list.template.html';
import './ct.get-beers.constant.js';

angular.module('ct.beers-list.component', ['ct.get-beers.constant']).component('ctBeersList', {
  template: beersListTemplate,
  bindings: {
    beers: '<'
  },
  controller: BeersListController
});

function BeersListController($scope, $element, $attrs, $httpParamSerializer, $http, curryGetBeers) {
  const ctrl = this;
  let page = 1;
  let preLoadedBeers = [];

  ctrl.$onInit = function() {
    // fetch second page of beers without displaying it
    preLoadNextBatch();
  };

  $scope.loadMore = function() {
    page += 1;
    preLoadNextBatch();
  };

  // Pre-load the next batch of beers so response is fast and we know when to disable button
  function preLoadNextBatch() {
    ctrl.beers = ctrl.beers.concat(preLoadedBeers);
    const getBeers = curryGetBeers(page + 1, $httpParamSerializer);
    getBeers($http).then(response => {
      if (response.data.length === 0) {
        $scope.noMoreBeers = true;
      }
      preLoadedBeers = response.data;
    });
  }
}
