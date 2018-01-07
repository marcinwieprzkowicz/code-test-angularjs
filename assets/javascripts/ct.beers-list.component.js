import beersListTemplate from './ct.beers-list.template.html';
import './ct.get-beers.constant.js';

angular.module('ct.beers-list.component', ['ct.get-beers.constant']).component('ctBeersList', {
  template: beersListTemplate,
  bindings: {
    beers: '<',
    onSelectBeer: '<'
  },
  controller: BeersListController
});

function BeersListController($scope, $element, $timeout, $httpParamSerializer, $http, curryGetBeers) {
  const ctrl = this;
  let page = 1;
  let preLoadedBeers = [];

  ctrl.$onInit = function() {
    // fetch second page of beers without displaying it
    preLoadNextBatch();
  };

  $scope.loadMore = function() {
    $scope.awaitingResponse = true;
    page += 1;
    preLoadNextBatch();
  };

  $scope.selectBeer = function(beerId) {
    $scope.isSelected = true;
    const selectedBeerIndex = ctrl.beers.map(beer => beer.id).indexOf(beerId);
    const selectedBeer = ctrl.beers[selectedBeerIndex];
    ctrl.onSelectBeer(selectedBeer);
  };

  // Pre-load the next batch of beers so we know when to disable button (also makes beers load immediately)
  function preLoadNextBatch() {
    ctrl.beers = ctrl.beers.concat(preLoadedBeers);

    // Scroll to bottom so you can see latest beers loaded
    $timeout(function() {
      const ul = $element.find('ul')[0];
      ul.scrollTop = ul.scrollHeight;
    });

    const getBeers = curryGetBeers(page + 1, $httpParamSerializer);

    getBeers($http).then(response => {
      if (response.data.length === 0) {
        $scope.noMoreBeers = true;
      }
      preLoadedBeers = response.data;
      $scope.awaitingResponse = false;
    });
  }
}
