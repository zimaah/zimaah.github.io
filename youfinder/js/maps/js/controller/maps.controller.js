(function () {

    var app = angular.module('starter');
    var mapsController = function ($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, GooglePlacesService, NgMap) {
        $scope.$on('$ionicView.afterEnter', function () {
            NgMap.getMap().then(function (map) {
                var center = map.getCenter();
                console.log(center);
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
            });
        })

        $scope.zoom = 14;
        $scope.latitude = 263756;
        $scope.longitude = 484105;

        $scope.tryGeoLocation = function () {
            $ionicLoading.show({
                template: 'Obtendo localização...'
            });

            $ionicPlatform.ready(function () {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 10000,
                    enableHighAccuracy: true
                }).then(function (position) {
                    $ionicLoading.hide().then(function () {
                        console.log(position);
                        $scope.zoom = 20;
                        $scope.latitude = position.coords.latitude;
                        $scope.longitude = position.coords.longitude;
                        NgMap.getMap().then(function (map) {
                            var center = map.getCenter();
                            console.log(center);
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(center);
                        });
                    });
                });
            })
        };

        $scope.getPlacePredictions = function (query) {
            if (query !== "") {
                GooglePlacesService.getPlacePredictions(query)
                        .then(function (predictions) {
                            $scope.predictions = predictions;
                        });
            } else {
                $scope.predictions = [];
            }
        };
    }

    app.controller('MapsController', mapsController);
})();