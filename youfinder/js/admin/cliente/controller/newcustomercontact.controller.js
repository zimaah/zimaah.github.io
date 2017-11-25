(function () {

    var newCustomerContactController = function ($scope, Utils, cities, GooglePlacesService, FirebaseManager, $timeout) {
        Utils.hideLoading();
        $scope.customer = $scope.$parent.customer;
        $scope.cities = cities;
        console.log($scope.customer);

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
            if ($scope.customer.city) {
                Utils.showLoading();
                var neighborhoods = FirebaseManager.DAO.list({
                    ref: FirebaseManager.REFERENCES.neighborhoodByCity($scope.customer.city)
                });

                neighborhoods.$loaded().then(function (values) {
                    Utils.hideLoading();
                    $timeout(function () {
                        $scope.neighborhoods = values;
                    })
                });
            }
        }
        $scope.loadNeighborhoodByCity();

        // to avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_new'});
    }

    var app = angular.module('starter');

    app.controller('NewCustomerContactCtrl', newCustomerContactController);

})();