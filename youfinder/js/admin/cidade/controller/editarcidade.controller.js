angular.module('starter')
        .controller('EditarCidadeCtrl', function ($scope, CityService, RouteService, city, Utils, neighborhoods, FirebaseManager) {
            console.log(Utils.isObjectEmpty(city));

            // F5 volta para listagem
            if (Utils.isObjectEmpty(city)) {
                RouteService.goAdminListCities();
            }

            $scope.city = city;
            $scope.neighborhoods = neighborhoods;

            // navegação entre telas
            $scope.goHome = function () {
                RouteService.goHomeAdmin();
            }

            $scope.doClickSaveCity = function (city) {
                CityService.saveNewCity(city);
            }

            $scope.goAdminListCities = function () {
                RouteService.goAdminListCities();
            }

            $scope.openFormNeighborhood = function () {
                Utils.showPrompt({
                    form: {
                        title: 'Cadastro de Bairros',
                        template: ' ',
                        inputType: 'text',
                        inputPlaceholder: 'Nome do bairro'
                    },
                    callbackConfirm: function (fullname) {
                        console.log(fullname);
                        CityService.saveNeighborhood({
                            cityId: city.$id,
                            neighborhood: {fullname: fullname}
                        });
                    },
                    callbackCancel: function () {
                        console.log('cancelado');
                    }
                });
            }

            $scope.removeNeighborhood = function (neighborhood) {
                FirebaseManager.DAO.remove({
                    ref: FirebaseManager.REFERENCES.neighborhoodByCity(city.$id),
                    bean: neighborhood,
                    callbackSuccess: function () {
                        Utils.showAlert('Bairro removido com sucesso!');
                    }
                });
            }
        })