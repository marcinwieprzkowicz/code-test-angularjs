import './ct.get-beers.constant.js';

describe('curryGetBeers utility function', function () {
  let $httpBackend;
  let $q;
  let $httpParamSerializer;
  let curryGetBeers;
  let $http;

  beforeEach(angular.mock.module('ct.get-beers.constant'));

  beforeEach(angular.mock.inject(function ($injector) {
    curryGetBeers = $injector.get('curryGetBeers');
    $httpBackend = $injector.get('$httpBackend');
    $http = $injector.get('$http');
    $httpParamSerializer = $injector.get('$httpParamSerializer');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should request the second batch of 10 beers from Punk API', function() {
    $httpBackend.expectGET('https://api.punkapi.com/v2/beers?page=2&per_page=10');
    $httpBackend.whenGET("https://api.punkapi.com/v2/beers?page=2&per_page=10").respond({ data: 'something'});
    const getBeers = curryGetBeers(2, '', $httpParamSerializer);

    getBeers($http);
    $httpBackend.flush();
  });

  it('should get the first batch of beers filtered by name from Punk API', function() {
    $httpBackend.expectGET('https://api.punkapi.com/v2/beers?beer_name=jever_pils&page=1&per_page=10');
    $httpBackend.whenGET("https://api.punkapi.com/v2/beers?beer_name=jever_pils&page=1&per_page=10").respond({ data: 'something else'});

    const getBeers = curryGetBeers(1, 'jever pils', $httpParamSerializer);

    getBeers($http);
    $httpBackend.flush();
  });

});
