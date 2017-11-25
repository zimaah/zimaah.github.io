(function () {

    let changeCityController = function ($scope, userCity, cities, RouteService, Utils, UserService) {
        Utils.hideLoading();

        $scope.cities = cities;
        angular.forEach($scope.cities, function (item) {
            if (item.$id == userCity)
                item.selected = true;
        });

        $scope.goHome = function () {
            RouteService.goHome();
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
                    let userLogged = Utils.getLocalStorage('userRoot');
                    userLogged.city = cityChecked.$id;
                    Utils.showConfirm('Cidade', 'Deseja alterar sua cidade?', function(){
                        UserService.save(userLogged, 'Cidade alterada com sucesso!');
                    });
                    return;
                }
            });
        }
    }

    let app = angular.module('starter');
    app.controller('ChangeCityController', changeCityController);

})();