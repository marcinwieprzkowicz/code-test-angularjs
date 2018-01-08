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
  $scope.filterMaxlength = 50;

  ctrl.$onInit = function() {
    $scope.noMoreBeers = false;
    // fetch second page of beers without displaying it
    preLoadNextBatch(2);
  };

  $scope.loadMore = function() {
    $scope.awaitingResponse = true;
    page += 1;
    preLoadNextBatch(page + 1);
  };

  $scope.filterBeersList = function() {
    $scope.noMoreBeers = false;
    preLoadedBeers = [];
    ctrl.beers = [];

    preLoadNextBatch(1).then(function() { preLoadNextBatch(2); });
  };

  $scope.selectBeer = function(beerId) {
    const selectedBeerIndex = ctrl.beers.map(beer => {
      beer.isSelected = beer.id === beerId;
      return beer.id;
    }).indexOf(beerId);
    const selectedBeer = ctrl.beers[selectedBeerIndex];
    ctrl.onSelectBeer(selectedBeer);
  };

  // Pre-load the next batch of beers so we know when to disable button (also makes beers load immediately)
  function preLoadNextBatch(pageNumber) {
    ctrl.beers = ctrl.beers.concat(preLoadedBeers);

    // Scroll to bottom so you can see latest beers loaded
    $timeout(function() {
      const ul = $element.find('ul')[0];
      ul.scrollTop = ul.scrollHeight;
    });

    const getBeers = curryGetBeers(pageNumber, $scope.filterString, $httpParamSerializer);

    return getBeers($http).then(response => {
      if (response.data.length === 0) {
        $scope.noMoreBeers = true;
      }
      preLoadedBeers = response.data;
      $scope.awaitingResponse = false;
    }, response => {
      alert('Error getting beers');
    });
  }

}
