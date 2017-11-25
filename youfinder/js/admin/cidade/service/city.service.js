angular.module('starter')
        .service('CityService', function (firebaseData, Utils, $firebaseArray, RouteService, FirebaseManager) {

            var that = this;

            this.saveNewCity = function (city) {

                console.log('saveNewCate');

                if (city.$id) {
                    that.update(city);
                } else {
                    that.addNew(city);
                }
            }

            this.addNew = function (city) {
                var ref = firebaseData.refCity();
                var cities = $firebaseArray(ref);

                console.log('Nova city');
                console.log(city);

                cities.$add(city).then(function () {
                    Utils.hideLoading();

                    Utils.showAlertCallback('Sucesso', 'Cidade salva com sucesso!', function () {
                        console.log('Cidade adicionado...');
                        RouteService.goAdminListCities();
                    });
                })
            }

            this.update = function (city) {
                var ref = firebaseData.refCity();
                var cities = $firebaseArray(ref);

                console.log('Update categoria');
                console.log(city);

                cities.$loaded().then(function () {
                    var index = cities.$indexFor(city.$id);
                    cities[index] = city;
                    cities.$save(city).then(function () {
                        Utils.hideLoading();

                        Utils.showAlertCallback('Sucesso', 'Cidade atualizada com sucesso!', function () {
                            console.log('Cidade atualizado...');
                            RouteService.goAdminListCities();
                            return;
                        });
                    });
                })
            }

            this.remove = function (cityID, callbackSuccess) {
                var ref = firebaseData.refCity();
                var cities = $firebaseArray(ref);

                cities.$loaded().then(function () {
                    var index = cities.$indexFor(cityID);
                    var category = cities[index];

                    cities.$remove(category).then(function (ref) {
                        if (Utils.isFunction(callbackSuccess)) {
                            callbackSuccess();
                        }
                    })
                });
            }

            this.removeCity = function (cityID) {
                Utils.showConfirm('Atenção', 'Tem certeza que deseja remover essa cidade?', function () {
                    that.remove(cityID, function () {
                        Utils.showAlert('Cidade removida com sucesso!');
                    });
                });
            }

            this.getAllCities = function () {
                var ref = firebaseData.refCity();
                var cities = $firebaseArray(ref);
                return cities;
            }

            /**
             * config: {
             *      cityId: '',
             *      neighborhood: object
             * }
             */
            this.saveNeighborhood = function (config) {
                console.log('config saveNeighborhood', config);

                if (Utils.isEmpty(config.neighborhood.$id)) {
                    FirebaseManager.DAO.insert({
                        bean: config.neighborhood,
                        ref: FirebaseManager.REFERENCES.neighborhoodByCity(config.cityId),
                        callbackSuccess: function(){
                            Utils.showAlert('Bairro adicionado com sucesso!');
                        }
                    });
                } else {
                    FirebaseManager.DAO.update();
                }
            }
            
            this.references = function(){
                return {
                    //
                }
            }
        })