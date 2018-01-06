import './application.scss';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

import './ct.get-beers.constant.js';

angular.module('codetest', [
  uirouter,
  'ct.get-beers.constant'
])
.config(function($urlRouterProvider, $locationProvider, $stateProvider, $httpProvider, $httpParamSerializerProvider, curryGetBeers) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('application', {
    url: '/',
    template: require('./application.template.html'),
    resolve: {
      beersList: curryGetBeers(1, 10, $httpParamSerializerProvider.$get())
    }
  });
});
