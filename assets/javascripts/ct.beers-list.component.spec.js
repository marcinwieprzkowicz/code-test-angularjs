import './ct.beers-list.component.js';

describe('beers-list component', function () {
  let $q;
  let $httpParamSerializer;
  let element;
  let parentScope;
  let elementScope;
  let deferredBeers;
  let getBeersSpy;
  const curryGetBeersSpy = jasmine.createSpy('curryGetBeers');
  let capturedBeer;

  beforeEach(
    angular.mock.module('ct.beers-list.component', function ($provide) {
        $provide.constant('curryGetBeers', curryGetBeersSpy);
    })
  );
  beforeEach(angular.mock.inject(function ($injector) {
    const $rootScope = $injector.get('$rootScope');
    const $compile = $injector.get('$compile');
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');
    $httpParamSerializer = $injector.get('$httpParamSerializer');
    const curryGetBeers = $injector.get('curryGetBeers');

    deferredBeers = $q.defer();
    getBeersSpy = jasmine.createSpy('getBeers').and.returnValue(deferredBeers.promise);
    curryGetBeersSpy.and.returnValue(getBeersSpy);

    parentScope = $rootScope.$new();
    parentScope.initialBeers = [
      {
        id: '1',
        name: 'test beer'
      },
      {
        id: '2',
        name: 'test beer 2'
      }
    ];
    parentScope.onSelect = jasmine.createSpy(
      'onSelectBeer',
      function(beer) { capturedBeer = beer; }
    ).and.callThrough();
    parentScope.filterString = '';

    element = $compile(
      angular.element(
        '<ct-beers-list beers="initialBeers" on-select-beer="onSelect"></ct-beers-list>'
      ))(parentScope);

    parentScope.$apply();
    elementScope = element.isolateScope();
  }));

  it('should display the initial beer names', function() {
    const li1 = angular.element(element.find('li')[0]);
    const li2 = angular.element(element.find('li')[1]);
    expect(li1.text()).toBe('test beer');
    expect(li2.text()).toBe('test beer 2');
  });

  it('should call getBeers to get the second page of beers', function() {
    expect(curryGetBeersSpy).toHaveBeenCalledWith(2, '', jasmine.any(Function));
  });

  it('should disable the load more button if last page of beers displayed', function() {
    deferredBeers.resolve({data: []});
    parentScope.$apply();

    expect(element.find('button')[0].disabled).toBe(true);
  });

  it('should not disable the load more button if there are more beers to be displayed', function() {
    deferredBeers.resolve({data: [{id: 3, name: 'Jever Pils'}]});
    parentScope.$apply();

    expect(element.find('button')[0].disabled).toBe(false);
  });

  it('should display more beers when the button is clicked', function() {
    deferredBeers.resolve({data: [{id: 3, name: 'Jever Pils'}]});
    parentScope.$apply();
    elementScope.loadMore();
    parentScope.$apply();

    const li3 = angular.element(element.find('li')[2]);
    expect(li3.text()).toBe('Jever Pils');
  });

  it('should pass selected beer to onSelectBeer callback when clicked', function() {
    elementScope.selectBeer('2');

    expect(parentScope.onSelect).toHaveBeenCalledWith(jasmine.any(Object));
    expect(capturedBeer.id).toBe('2');
    expect(capturedBeer.name).toBe('test beer 2');
  });

  it('should query filtered by beer name when given filter string', function() {
    curryGetBeersSpy.calls.reset();
    elementScope.filterString = 'xyz';

    elementScope.filterBeersList();

    expect(curryGetBeersSpy).toHaveBeenCalledWith(1, 'xyz', $httpParamSerializer);
  });

});
