(function () {

    var customerService = function (firebaseData, Utils, $firebaseArray, RouteService, firebaseStorage,
            TYPE_CUSTOMER, LogService, $firebaseAuth, CordovaUtils, firebase, firebaseGeo, $q) {

        var _self = this;

        this.handleImagesURL = function (customer) {
            if (Utils.isEmpty(customer.logoURL)) {
                customer.logoURL = Utils.getSessionStorage('customer.logoURL');
                Utils.setSessionStorage('customer.logoURL', null);
            }

            if (Utils.isEmpty(customer.capaURL)) {
                customer.capaURL = Utils.getSessionStorage('customer.capaURL');
                Utils.setSessionStorage('customer.capaURL', null);
            }

            return customer;
        }

        this.saveCustomer = function (customer, config) {

            if (config.isNew) {
                if (customer.password != customer.confirmPassword) {
                    Utils.hideLoading();
                    Utils.showAlert('As senhas estão diferentes! Por favor, verifique');
                    return;
                } else if (Utils.isEmpty(customer.emailone)) {
                    Utils.hideLoading();
                    Utils.showAlert('É preciso informar um e-mail');
                    return;
                } else if (Utils.isEmpty(customer.password)) {
                    Utils.hideLoading();
                    Utils.showAlert('Informe uma senha!');
                    return;
                } else if (Utils.isEmpty(customer.category)) {
                    Utils.hideLoading();
                    Utils.showAlert('É preciso informar uma categoria');
                    return;
                } else if (Utils.isEmpty(customer.neighborhood)) {
                    Utils.hideLoading();
                    Utils.showAlert('É preciso informar um bairro');
                    return;
                } else if (Utils.isEmpty(customer.city)) {
                    Utils.hideLoading();
                    Utils.showAlert('É preciso informar uma cidade');
                    return;
                } else if (Utils.isEmpty(customer.latitude) || Utils.isEmpty(customer.longitude)) {
                    Utils.hideLoading();
                    Utils.showAlert('É preciso informar a geolocalização');
                    return;
                }
            }

            if (customer.neighborhood.$id) {
                // proper way to clone JS object (if it's not have function property)
                var clone = Utils.clone(customer.neighborhood);

                customer.neighborhood = {
                    id: clone.$id,
                    value: clone
                }
            }

            // tratamento para a logo e foto de capa
            customer = _self.handleImagesURL(customer);
            console.log(11);
            // 'g' is the KEY!
            var geo = [customer.latitude, customer.longitude];
            customer.g = firebaseGeo.encodeGeohash(geo);
            console.log(22);

            // 'l' is the ANOTHER KEY!
            customer.l = geo;
            console.log(customer);

            if (customer.$id) {
                _self.update(customer, config);
            } else {
                _self.addNew(customer);
            }
        }

        this.addNew = function (customer) {
            LogService.log('begin CustomerService.addNew', customer);
            var ref = firebaseData.refCustomer();
            customer.type = TYPE_CUSTOMER;
            var customers = $firebaseArray(ref);
            console.log(111);

            // for create the user customer on Firebase
            var customerFirebase = {
                email: customer.emailone,
                password: customer.password
            }

            // remove the password properties
            delete customer.password;
            delete customer.confirmPassword;
            console.log(222);

            var promiseAuth = _self.createAccountEmailAndPassword(customerFirebase);
            promiseAuth.then(function () {

                var promiseAdd = customers.$add(customer);
                console.log(customer);
                promiseAdd.then(function () {
                    Utils.hideLoading();
                    Utils.showAlertCallback('Sucesso', 'Cliente cadastrado com sucesso!', function () {
                        RouteService.goAdminListCustomers();
                    });
                    _self.saveCustomerPerCategory(customer);
                }).catch(function (err) {
                    console.log(customer);
                });

            }).catch(function (err) {
                console.log(err);
                Utils.hideLoading();
                if (err.code == 'auth/email-already-in-use') {
                    Utils.showAlertCallback('E-mail inválido', 'Esse e-mail já está sendo utilizado em outra conta', function () {
                        RouteService.goAdminListCustomers();
                    });
                } else {
                    Utils.showAlertCallback('Ops!', 'Aconteceu um erro ao cadastrar o cliente, tente novamente!', function () {
                        RouteService.goAdminListCustomers();
                    });
                }
            });
        }

        this.saveCategoryPerCity = function (customer) {
            var ref = firebaseData.refCategoryPerCity().child(customer.city);
            var categoryPerCity = $firebaseArray(ref);

            categoryPerCity.$add(customer.category).then(function (ref) {
                var id = ref.key;
                console.log("added record with id " + ref);
            });
        }

        /**
         * Usado na lógica de exibir somente as categorias que tem cliente cadastrado
         */
        this.saveCustomerPerCategory = function (customer) {
            // adicionar na lista de Clientes Por Categoria

            var categoryId = customer.category;
            var refCustomerPerCategory = firebaseData.refCustomerPerCategory().child(categoryId);
            var customersPerCategory = $firebaseArray(refCustomerPerCategory);

            // returns promise
            return customersPerCategory.$add({'emailone': customer.emailone});
        }

        this.update = function (customer, config) {
            LogService.log('begin CustomerService.update', customer);
            var ref = firebaseData.refCustomer();
            var customers = $firebaseArray(ref);

            customers.$loaded().then(function () {
                var index = customers.$indexFor(customer.$id);
                customers[index] = customer;
                customers.$save(customer).then(function () {
                    Utils.hideLoading();
                    LogService.log('CustomerService.update result: ', customer);
                    Utils.showAlertCallback('Sucesso', 'Cliente atualizado com sucesso!', function () {
                        console.log('Cliente atualizado...');

                        // customer view
                        if (!Utils.isEmpty(config) && !Utils.isEmpty(config.state)) {
                            config.param = {'userRoot': customer};
                            RouteService.goToState(config);
                        } else {

                            // admin view
                            RouteService.goAdminListCustomers();
                        }
                    });
                });
            })
        }

        this.clearCustomerLocalStorage = function (Utils) {
            Utils.setLocalStorage('customerls', null);
        }

        this.remove = function (customerID, callbackSuccess) {
            var ref = firebaseData.refCustomer();
            var customers = $firebaseArray(ref);

            customers.$loaded().then(function () {
                var index = customers.$indexFor(customerID);
                var customer = customers[index];

                customers.$remove(customer).then(function (ref) {
                    console.log('inside $remove', customer);
                    var categoryId = customer.category;
                    console.log('cat Id', categoryId);
                    var refCustomerPerCategory = firebaseData.refCustomerPerCategory().child(categoryId);
                    var customersPerCategory = $firebaseArray(refCustomerPerCategory);
                    customersPerCategory.$loaded().then(function () {
                        console.log(customersPerCategory);
                        var myIndex = -1;
                        var myCustomer = null;
                        angular.forEach(customersPerCategory, function (value, key) {
                            console.log(value);
                            if (value.emailone == customer.emailone) {
                                myCustomer = value;
                            }
                        });
                        console.log(myCustomer);
                        customersPerCategory.$remove(myCustomer).then(function () {
                            console.log('removido', myCustomer);
                        })
                    });

                    if (Utils.isFunction(callbackSuccess)) {
                        callbackSuccess();
                    }
                })
            });
        }

        this.removeCustomer = function (customerID) {
            Utils.showConfirm('Atenção', 'Tem certeza que deseja remover esse cliente?', function () {
                _self.remove(customerID, function () {
                    Utils.showAlert('Cliente removido com sucesso!');
                });
            });
        }

        this.getAllCustomers = function () {
            var ref = firebaseData.refCustomer();
            var customers = $firebaseArray(ref);
            return customers;
        }

        this.getCustomerByCategory = function (categoryId) {
            var ref = firebaseData.refCustomer().orderByChild('category').equalTo(categoryId);
            return $firebaseArray(ref);
        }

        this.getCustomersByCity = function (cityId) {
            var ref = firebaseData.refCustomer().orderByChild('city').equalTo(cityId);
            return $firebaseArray(ref);
        }

        this.getConfigUploadLogo = function (bean) {
            var config = {
                refStorage: firebaseStorage.refLogo(),
                inputFileId: 'uploadlogo',
                scopeVarDownloadURL: 'downloadLogoURL',
                scopeVarVisibleUpload: 'visibleUploadLogoContainer',
                persist: {
                    attributeName: 'logoURL', // nome do campo
                    firebaseRef: firebaseData.refCustomer(), // referência ao node
                    firebaseBean: bean, // o bean que está sendo alterado | null = NOVO
                    fullAttributeName: 'customer.logoURL'
                }
            }

            return config;
        }
        this.getConfigRemoveLogo = function (fileName, bean) {
            var optionsDeleteFileLogo = {
                refStorage: firebaseStorage.refLogo(),
                fileName: fileName,
                scopeVarDownloadURL: 'downloadLogoURL',
                scopeVarVisibleUpload: 'visibleUploadLogoContainer',
                inputFileId: 'uploadlogo',
                persist: {
                    firebaseRef: firebaseData.refCustomer(),
                    firebaseBean: bean,
                    attributeName: 'logoURL'
                },
                callbackSuccess: function () {
                    Utils.showAlert('Logo ' + fileName + ' removida com sucesso!');
                },
                callbackError: {}
            }

            return optionsDeleteFileLogo;
        }

        this.getConfigUploadCapa = function (bean) {
            var optionsUploadFileCapa = {
                refStorage: firebaseStorage.refLogo(),
                inputFileId: 'uploadcapa',
                scopeVarDownloadURL: 'downloadCapaURL',
                scopeVarVisibleUpload: 'visibleUploadCapaContainer',
                persist: {
                    attributeName: 'capaURL', // bean attribute name
                    firebaseRef: firebaseData.refCustomer(), // ref to node on database
                    firebaseBean: bean, // if null is INSERT, otherwise UPDATE
                    fullAttributeName: 'customer.capaURL'
                }
            }

            return optionsUploadFileCapa;
        }
        this.getConfigRemoveCapa = function (fileName, bean) {
            var optionsDeleteFileCapa = {
                refStorage: firebaseStorage.refLogo(),
                fileName: fileName,
                scopeVarDownloadURL: 'downloadCapaURL',
                scopeVarVisibleUpload: 'visibleUploadCapaContainer',
                inputFileId: 'uploadcapa',
                persist: {
                    firebaseRef: firebaseData.refCustomer(),
                    firebaseBean: bean,
                    attributeName: 'capaURL'
                },
                callbackSuccess: function () {
                    Utils.showAlert('Foto de capa ' + fileName + ' removida com sucesso!');
                },
                callbackError: {}
            }

            return optionsDeleteFileCapa;
        }

        this.addFavorite = function (customer) {
            var myUser = Utils.getLocalStorage('userRoot');
            var refFavorite = firebaseData.refFavorite().child(myUser.$id);
            var favorites = $firebaseArray(refFavorite);

            var refExistsFavorite = firebaseData.refFavorite().child(myUser.$id).orderByChild('emailone').equalTo(customer.emailone);
            var promiseExists = $firebaseArray(refExistsFavorite).$loaded();

            return promiseExists.then(function (values) {
                let exists = false;
                if (!Utils.isEmpty(values)) {
                    let favs = values.filter(function (favorite) {
                        return favorite.fullname == customer.fullname;
                    });
                    exists = favs.length > 0;
                }

                if (!exists) {
                    // returns promise
                    return favorites.$add(customer);
                }
            });
        }

        this.removeFavorite = function (customer) {
            var myUser = Utils.getLocalStorage('userRoot');
            var refFavorite = firebaseData.refFavorite().child(myUser.$id);
            var favorites = $firebaseArray(refFavorite);
            var promise = favorites.$loaded();

            return promise.then(function (favorites) {
                var index = 0;
                favorites.some(function (fav) {
                    if (fav.fullname == customer.fullname)
                        return true;
                    index++;
                });

                var fav = favorites[index];

                // returns promise
                return favorites.$remove(fav);
            });
        }

        this.toggleFavorite = function (config) {
            var myUser = Utils.getLocalStorage('userRoot');
            var refFavorite = firebaseData.refFavorite().child(myUser.$id);
            var favorites = $firebaseArray(refFavorite);
            var promise = favorites.$loaded();

            promise.then(function (favorites) {
                var arr = favorites.filter(function (fav) {
                    console.log(fav.emailone);
                    console.log(config.customer.emailone);
                    return fav.emailone == config.customer.emailone;
                });

                // favorite already exists, so remove
                if (arr.length > 0) {
                    console.log('exists');
                    var promiseRemove = _self.removeFavorite(config.customer);

                    promiseRemove.then(function () {
                        Utils.showAlert("Favorito removido!");

                        // to unset the fav icon
                        var c = config.customers.find(function (customer) {
                            return customer.emailone == config.customer.emailone;
                        });
                        if (c)
                            c.isFavorite = false;
                    }).catch(function () {
                        Utils.showAlert("Falha ao remover favorito, tente novamente.");
                    })

                    // add favorite!
                } else {
                    console.log('non exists');
                    var promiseAdd = _self.addFavorite(config.customer);

                    promiseAdd.then(function () {
                        Utils.showAlert("Favorito adicionado!");

                        // to SET the fav icon
                        var c = config.customers.find(function (customer) {
                            return customer.emailone == config.customer.emailone;
                        });
                        c.isFavorite = true;
                    }).catch(function () {
                        Utils.showAlert("Falha ao adicionar favorito, tente novamente.");
                    })
                }
                // error
            }).catch(function (err) {
                console.log(err);
            })
        }

        this.createAccountEmailAndPassword = function (customer) {
            var auth = $firebaseAuth();
//            Utils.showLoading();

            return auth.$createUserWithEmailAndPassword(customer.email, customer.password);

//            .then(function (firebaseUser) {
//
//            }).catch(function (error) {
//                Utils.hideLoading();
//                LoginErrorService.handleLoginError(error);
//            });

        }

        this.initTabContactCustomerProfile = function (config) {
            config.scope.isCelphone = !Utils.isEmpty(config.celphone);
            config.scope.isCelphoneWhats = config.celphonewhats;
            config.scope.isCelphone2 = !Utils.isEmpty(config.celphone2);
            config.scope.isCelphone2Whats = config.celphone2whats;
            config.scope.isCelphone3 = !Utils.isEmpty(config.celphone3);
            config.scope.isCelphone3Whats = config.celphone3whats;

            // links
            config.scope.isFacebook = !Utils.isEmpty(config.facebook);
            config.scope.openFacebook = function () {
                CordovaUtils.social.openFacebook(config.facebook);
            }
            config.scope.isInstagram = !Utils.isEmpty(config.instagram);
            config.scope.openInstagram = function () {
                CordovaUtils.social.openInstagram(config.instagram);
            }
            config.scope.isTwitter = !Utils.isEmpty(config.twitter);
            config.scope.openTwitter = function () {
                CordovaUtils.social.openTwitter({
                    twitter: config.twitter
                });
            }

            config.scope.openEmail = function () {

                CordovaUtils.email.openApp({
                    to: config.email,
                    subject: 'Contato via YouFinder',
                    body: 'Achei o seu perfil no YouFinder',
                    isHtml: true
                });

//                ionic.Platform.ready(function () {
//                    $cordovaEmailComposer.isAvailable().then(function () {
//                        var email = {
//                            to: config.email,
//                            subject: 'Contato via YouFinder',
//                            body: 'Achei o seu perfil no YouFinder',
//                            isHtml: true
//                        }
//                        $cordovaEmailComposer.open(email);
//                    })
//                });
            }
        }

        this.references = function () {
            return {
                customersByNeighborhood: function (neighborhoodId) {
                    var ref = firebase.database().ref('customers').orderByChild('neighborhood/id').equalTo(neighborhoodId);
                    return ref;
                }
            }
        }

        this.checkFavorites = function (config) {
            let customers = config.customers;
            let userFavorites = config.customers;

            // check as favorite = true customers _self exists in fav list to set proper icon in UI
            for (var i = 0; i < config.customers.length; i++) {
                for (var j = 0; j < config.userFavorites.length; j++) {
                    if (customers[i].emailone == userFavorites[j].emailone) {
                        customers[i].isFavorite = true;
                    } else {
                        customers[i].isFavorite = false;
                    }
                }
            }
        }

        this.filterBySubCategory = function (config) {
            var customerHasSubCategory = function (customer, subCategory) {
                var exists = false;

                if (customer.subCategories && customer.subCategories.length > 0) {
                    for (let i = 0; i < customer.subCategories.length; i++) {
                        var subCategoryCustomer = customer.subCategories[i];

                        if (subCategoryCustomer.fullname === subCategory.fullname) {
                            exists = true;
                            break;
                        }
                    }
                }
                return exists;
            }

            var filtereds = config.customers.filter(function (customer) {
                return customerHasSubCategory(customer, config.subCategory);
            });
            return filtereds;
        }

        this.filterByGeo = function (config) {
            config.distance = config.distance || 11; // default: 33 km
            let geoQuery = firebaseGeo.getByGeo(config.scope.latitude, config.scope.longitude, config.distance, config.ref);
            var promises = [];
            var distances = [];

            geoQuery.on("key_entered", function (key, location, distance) {
                console.log('key_entered');

                promises.push(firebaseGeo.get(key));

                // the distance for each promise
                distance = distance.toFixed(2);
                distance += " km";
                if (distance == 0) {
                    distance += " (você está bem próximo!)";
                }
                distances.push(distance);
            });

            geoQuery.on("key_exited", function (key, location, distance) {
                console.log('exiteeeeeed');
            });

            geoQuery.on("ready", function () {

                $q.all(promises).then(function (customers) {

                    let index = customers.length;
                    for (let i = 0; i < index; i++) {
                        // to set the distance for each customer
                        customers[i]['distance'] = distances[i];
                    }
                    let list = Utils.uniqueArray(customers, '$id');
                    let filteredList = list;

                    // filter by category
                    if (config.categoryId) {
                        filteredList = list.filter(function (customer) {
                            return customer.category == config.categoryId;
                        });
                    }


                    // filter by subCategory
                    if (config.configs && config.configs.subCategory) {
                        filteredList = _self.filterBySubCategory({
                            customers: filteredList,
                            subCategory: config.configs.subCategory
                        });
                    }

                    // filter by neighborhood
                    if (config.isFilterByNeighborhood) {
                        filteredList = filteredList.filter(function (customer) {
                            return customer.neighborhood.id == config.neighborhoodId;
                        });
                    }

                    if (config.configs && config.configs.isFromSearch) {
                        config.configs.customers = filteredList;
                        RouteService.goSearch(config.configs);
                    } else {
                        config.configs.customersByParentCategory = filteredList;
                        RouteService.goCustomerByCategoryFilter(config.configs);
                    }
                    


                }).catch(function () {
                    Utils.showAlert("Ops...", "Ocorreu um erro inesperado, teste novamente!", function () {
                        RouteService.goCustomerByCategory(Utils.getLocalStorage('categoryHomeClick'));
                    });
                });
            });
        };

        this.initListIcons = function (config) {
//            config.scope.iconWhatsApp = Utils.getIcon({
//                name: 'whatsapp'
//            });

//            // Facebook
//            config.scope.iconFacebook = Utils.getIcon({
//                name: 'facebook'
//            });
//            config.scope.iconFacebookClick = function(facebook){
//                CordovaUtils.social.openFacebook({
//                    facebook: facebook
//                });
//            }
//            config.scope.isIconFacebook = 
//            
//            config.scope.iconTwitter = Utils.getIcon({
//                name: 'twitter'
//            });
//            config.scope.iconInstagram = Utils.getIcon({
//                name: 'instagram'
//            });
//            config.scope.iconEmail = Utils.getIcon({
//                name: 'email'
//            });

//            config.scope.iconPhone = Utils.getIcon({
//                name: 'phone'
//            });
        }
    }

    var app = angular.module('starter');

    app.service('CustomerService', customerService);

})();

