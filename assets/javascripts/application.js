import './application.scss';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

angular.module('codetest', [
  uirouter
])
.config(function($urlRouterProvider, $locationProvider, $stateProvider, $httpProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('application', {
    url: '/',
    template: require('./application.template.html')
  });
});
