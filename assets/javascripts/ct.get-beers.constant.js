angular.module('ct.get-beers.constant', [])
.constant('curryGetBeers', curryGetBeers);

// Max allowed here is 80
const beersPerPage = 10;

/**
 * I wanted to extract this utility function into a separate module,
 * but the result seems overly complicated. I tried using .bind() in
 * the ui-router resolve config but that didn't work, the $http would then not get passed in here.
 * I don't yet understand where $http comes from when called from resolve.
 */
function curryGetBeers (pageNumber, filterString, paramSerializer) {
  const queryOptions = {
    page: pageNumber,
    per_page: beersPerPage
  };

  if (filterString !== '') {
    queryOptions.beer_name = filterString;
  }

  const queryString = paramSerializer(queryOptions);

  return function getBeers($http) {
    return $http({
      method: 'GET',
      url: `https://api.punkapi.com/v2/beers?${queryString}`
    }).then(response => response, () => {
      alert('Error getting beers');
    });
  };
}