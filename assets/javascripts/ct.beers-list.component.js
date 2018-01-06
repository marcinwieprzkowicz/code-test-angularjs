import beersListTemplate from './ct.beers-list.template.html';
import './ct.get-beers.constant.js';

angular.module('ct.beers-list.component', ['ct.get-beers.constant']).component('ctBeersList', {
  template: beersListTemplate,
  bindings: {
    beers: '='
  },
  controller: BeersListController
});

function BeersListController($scope, $element, $attrs, $httpParamSerializer, $http, curryGetBeers) {
  // Copying the beers list is not very nice, but I can't $scope.broadcast to this component because that happens
  // before this component is instantiated. I'm sure there's a better way...
  $scope.beers = $scope.$parent.beers.slice();
  this.page = 1;
  this.preLoadedBeers = [];

  // Pre-load the next batch of beers so response is fast and we know when to disable button
  // I am using arrow operator functions so I have access to this without using .bind(),
  // but I don't like defining this utility function first before the main logic. Maybe bind is better.
  const preLoadNextBatch = () => {
    const getBeers = curryGetBeers(this.page + 1, $httpParamSerializer);
    getBeers($http).then(response => {
      if (response.data.length === 0) {
        $scope.noMoreBeers = true;
      }
      $scope.beers = $scope.beers.concat(this.preLoadedBeers);
      this.preLoadedBeers = response.data;
    });
  };

  // fetch second page of beers without displaying it
  preLoadNextBatch();

  $scope.loadMore = () => {
    this.page += 1;
    preLoadNextBatch();
  };

}
