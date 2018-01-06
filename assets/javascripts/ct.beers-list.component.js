import beersListTemplate from './ct.beers-list.template.html';
import './ct.get-beers.constant.js';

angular.module('ct.beers-list.component', ['ct.get-beers.constant']).component('ctBeersList', {
  template: beersListTemplate,
  bindings: {
    beers: '='
  }
});
