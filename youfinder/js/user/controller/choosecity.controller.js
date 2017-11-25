(function () {

    let chooseCityController = function ($scope, cities, RouteService, Utils, UserService) {
        Utils.hideLoading();

        $scope.cities = cities;
        $scope.selectedCity = null;
        angular.forEach($scope.cities, function (item) {
            item.selected = false;
        });

        $scope.goLogin = function () {
            RouteService.goLogin();
        }

        $scope.checkCity = function (cityChecked) {
            // uncheck all
            angular.forEach($scope.cities, function (item) {
                item.selected = false;
            });

            // check only the clicked
            angular.forEach($scope.cities, function (item) {
                if (cityChecked.$id == item.$id) {
                    cityChecked.selected = true;
                    $scope.selectedCity = cityChecked.$id;
                    return;
                }
            });
        }

        $scope.start = function () {
            console.log($scope.selectedCity);
            
            if (!$scope.selectedCity) {
                Utils.showAlert('Você precisa escolher uma cidade!');
            } else {
                let userLogged = Utils.getLocalStorage('userRoot');
                userLogged.city = $scope.selectedCity;
                UserService.save(userLogged);
            }
        }
    }

    let app = angular.module('starter');
    app.controller('ChooseCityController', chooseCityController);

})();