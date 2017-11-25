(function () {

    var app = angular.module('MapsModule');
    var googlePlacesService = function ($q, NgMap, $cordovaGeolocation, $ionicPlatform, $ionicLoading, $timeout, Utils) {

        this.getPlacePredictions = function (query) {
            var dfd = $q.defer(),
                    service = new google.maps.places.AutocompleteService();

            service.getPlacePredictions({input: query}, function (predictions, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    dfd.resolve([]);
                } else
                {
                    dfd.resolve(predictions);
                }
            });

            return dfd.promise;
        };
        
        this.getCurrentGeolocation = function (config) {
            /**
             * config {
             *  scope: $scope,
             * }
             */

            $ionicLoading.show({
                template: 'Obtendo localização...'
            });

            $ionicPlatform.ready(function () {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 5000,
                    enableHighAccuracy: true
                }).then(function (position) {
                    $ionicLoading.hide().then(function () {
                        Utils.showAlert('Geolocalização obtida com sucesso!');
                        $timeout(function () {
                            // anything you want can go here and will safely be run on the next digest.
                            config.scope.zoom = 15;
                            config.scope.latitude = position.coords.latitude;
                            config.scope.longitude = position.coords.longitude;
                        });
                    });
                }).catch(function(){
                    Utils.hideLoading();
                    $timeout(function(){
                        config.scope[config.modelCheckboxGeo].value = false;
                    });
                    
                    Utils.showAlert('Ops...', 'Houve um problema ao buscar sua localização, talvez seja sua conexão ou o GPS desativado. Verifique e tente novamente.');
                });
            })
        };

        this.getCurrentGeolocationCustomer = function (config) {
            /**
             * config {
             *  scope: $scope,
             *  mapId: 'myMapId'
             * }
             */

            $ionicLoading.show({
                template: 'Obtendo localização...'
            });

            $ionicPlatform.ready(function () {
                $cordovaGeolocation.getCurrentPosition({
                    timeout: 5000,
                    enableHighAccuracy: true
                }).then(function (position) {
                    $ionicLoading.hide().then(function () {
                        $timeout(function () {
                            // anything you want can go here and will safely be run on the next digest.
                            config.scope.zoom = 15;
                            config.scope.customer.latitude = position.coords.latitude;
                            config.scope.customer.longitude = position.coords.longitude;
                        });

                        NgMap.getMap(config.mapId).then(function (map) {
                            var center = map.getCenter();
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(center);
                        });
                    });
                }).catch(function(){
                    Utils.hideLoading();
                    Utils.showAlert('Ops...', 'Houve um problema ao buscar sua localização, talvez seja sua conexão ou o GPS desativado. Verifique e tente novamente');
                });
            })
        };

        this.setMapCoords = function (config) {
            /**
             * config {
             *  latitude: '23423432',
             *  longitude: '345345'
             * }
             */
            NgMap.getMap(config.mapId).then(function (map) {
                var center = map.getCenter();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
            });
        }

        this.centerMap = function (config) {
            NgMap.getMap(config.mapId).then(function (map) {
                var center = map.getCenter();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
            });
        }
    }


    app.service('GooglePlacesService', googlePlacesService);

})();