import './application.scss';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

import './ct.get-beers.constant.js';
import './ct.beers-list.component.js';

angular.module('codetest', [
  uirouter,
  'ct.get-beers.constant',
  'ct.beers-list.component'
])
.config(function($urlRouterProvider, $locationProvider, $stateProvider, $httpProvider, $httpParamSerializerProvider, curryGetBeers) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('application', {
    url: '/',
    template: require('./application.template.html'),
    resolve: {
      beersList: curryGetBeers(1, $httpParamSerializerProvider.$get())
    },
    controller: function($scope, beersList) {
      this.beers = beersList.data;
    },
    controllerAs: 'codetest'
  });
});
