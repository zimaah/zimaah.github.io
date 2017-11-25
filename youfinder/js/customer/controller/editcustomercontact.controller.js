(function () {

    let editCustomerContactController = function ($scope, Utils, cities, customer, GooglePlacesService) {
        Utils.hideLoading();
        $scope.customer = customer;
        $scope.cities = cities;

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
        
        // to avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_edit'});

    }

    let app = angular.module('starter');

    app.controller('EditCustomerProfileContactCtrl', editCustomerContactController);

})();