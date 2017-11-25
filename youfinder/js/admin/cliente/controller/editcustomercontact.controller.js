(function () {

    var editCustomerContactController = function ($scope, $timeout, Utils, cities, customer, GooglePlacesService, FirebaseManager) {
        console.log('controller contact');
        Utils.hideLoading();
        $scope.customer = customer;
        $scope.cities = cities;
        $scope.neighborhoods = [];
        $scope.zoom = 14;

        $scope.getCurrentGeolocationCustomer = function () {
            GooglePlacesService.getCurrentGeolocationCustomer({
                scope: $scope,
                mapId: 'customermap_edit'
            });
        }

        $scope.checkInfoCoords = function () {
            if ($scope.customer.manualcoords) {
                $scope.customer.longitude = '';
                $scope.customer.latitude = '';
            }
        }

        $scope.loadNeighborhoodByCity = function () {
            Utils.showLoading();
            console.log(133);
            var neighborhoods = FirebaseManager.DAO.list({
                ref: FirebaseManager.REFERENCES.neighborhoodByCity($scope.customer.city)
            });

            neighborhoods.$loaded().then(function (values) {
                Utils.hideLoading();
                $timeout(function () {
                    $scope.neighborhoods = values;
                    angular.forEach($scope.neighborhoods, function (v) {

                        // setting the previous saved neighborhood
                        if ($scope.customer.neighborhood) {
                            if (v.$id == $scope.customer.neighborhood.id) {
                                $scope.customer.neighborhood = v;
                                return false;
                            }
                        }
                    });
                })
            });
        }

        // avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_edit'});

        // load the neighborhoods and set in the select the previous saved
        $scope.loadNeighborhoodByCity();
    }

    var app = angular.module('starter');

    app.controller('EditCustomerContactCtrl', editCustomerContactController);

})();