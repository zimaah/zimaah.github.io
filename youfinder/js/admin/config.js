(function () {

    var app = angular.module('starter');
    var config = function ($stateProvider) {

        $stateProvider.state('adminmenu', {
            url: '/app-admin',
            abstract: true,
            templateUrl: 'templates/admin/menu.html',
            controller: 'AdminCtrl'
        })

                .state('adminmenu.home', {
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/admin/home.html',
                            controller: 'AdminCtrl'
                        }
                    }
                })

                // listagem de clientes
                .state('listagemcliente', {
                    url: '/listagem-cliente',
                    templateUrl: 'templates/admin/cliente/listagem_cliente.html',
                    controller: 'ListCustomerCtrl',
                    resolve: {
                        customers: function (CustomerService, Utils) {
                            Utils.showLoading();
                            var customers = CustomerService.getAllCustomers();
                            return customers.$loaded();
                        }
                    }
                })

                // tabs pai
                .state('tabscustomer', {
                    url: '/novo-cliente',
                    abstract: true,
                    templateUrl: 'templates/admin/cliente/novo_cliente.html',
                    controller: 'NewCustomerCtrl'
                })

                .state('createaccountcustomer', {
                    url: '/cliente-criar-conta',
                    templateUrl: 'templates/admin/cliente/admin_createaccount.html',
                    controller: 'CreateAccountCustomerCtrl'
                })

                .state('tabscustomer.novocliente', {
                    url: '/dados',
                    views: {
                        'admin-tab-customer-data': {
                            templateUrl: 'templates/admin/cliente/cliente_tab_dados.html',
                            controller: 'NewCustomerDataCtrl'
                        }
                    },
                    resolve: {
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        }
                    }
                })

                .state('tabscustomer.novoclientecontato', {
                    url: '/contato',
                    views: {
                        'admin-tab-customer-contact': {
                            templateUrl: 'templates/admin/cliente/cliente_tab_contato.html',
                            controller: 'NewCustomerContactCtrl'
                        }
                    },
                    resolve: {
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        },
                        cities: function (CityService) {
                            console.log('cities...');
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

                .state('tabscustomer.novoclientelogo', {
                    url: '/logo',
                    views: {
                        'admin-tab-customer-logo': {
                            templateUrl: 'templates/admin/cliente/cliente_tab_imagem.html',
                            controller: 'NewCustomerImageCtrl'
                        }
                    },
                    resolve: {
                        subCategories: function (Utils) {
                            return Utils.getLocalStorage('subCategories');
                        }
                    }
                })

                // tabs customer edit
                .state('tabscustomeredit', {
                    url: '/editar-cliente',
                    abstract: true,
                    templateUrl: 'templates/admin/cliente/editar_cliente.html',
                    controller: 'EditCustomerCtrl'
                })

                .state('tabscustomeredit.editarcliente', {
                    url: '/dados',
                    views: {
                        'admin-tab-customer-data-edit': {
                            templateUrl: 'templates/admin/cliente/cliente_edit_tab_dados.html',
                            controller: 'EditCustomerDataCtrl'
                        }
                    },
                    params: {customer: null},
                    resolve: {
                        customer: function ($stateParams, Utils) {
                            Utils.setLocalStorage('customerEdit', $stateParams.customer);
                            return $stateParams.customer;
                        },
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        },
                        subCategories: function (CategoryService, customer) {
                            return CategoryService.getChildCategories(customer.category).$loaded();
                        }
                    }
                })

                .state('tabscustomeredit.editarclientecontato', {
                    url: '/contato',
                    views: {
                        'admin-tab-customer-contact-edit': {
                            templateUrl: 'templates/admin/cliente/cliente_edit_tab_contato.html',
                            controller: 'EditCustomerContactCtrl'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            var customer = Utils.getLocalStorage('customerEdit');
                            console.log('resolve customer contact ', customer);
                            return customer;
                        },
                        cities: function (CityService) {
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

                .state('tabscustomeredit.editarclientelogo', {
                    url: '/logo',
                    views: {
                        'admin-tab-customer-logo-edit': {
                            templateUrl: 'templates/admin/cliente/cliente_edit_tab_imagem.html',
                            controller: 'EditCustomerImageCtrl'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            return Utils.getLocalStorage('customerEdit');
                        }
                    }
                })

                // PLANOS
                .state('tabscustomeredit.editarclienteplanos', {
                    url: '/planos',
                    views: {
                        'admin-tab-customer-plans-edit': {
                            templateUrl: 'templates/admin/cliente/cliente_edit_tab_planos.html',
                            controller: 'EditCustomerPlanCtrl'
                        }
                    },
                    resolve: {
                        billingTypes: function (BillingTypeService) {
                            return BillingTypeService.getAll().$loaded();
                        },
                        customer: function (Utils) {
                            return Utils.getLocalStorage('customerEdit');
                        },
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        },
                        subCategories: function (CategoryService, customer) {
                            return CategoryService.getChildCategories(customer.category).$loaded();
                        }
                    }
                })

                /* categorias */

                .state('listagemcategoria', {
                    url: '/listagem-categoria',
                    templateUrl: 'templates/admin/category/listcategory.html',
                    controller: 'ListCategoryController',
                    resolve: {
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        }
                    }
                })

                .state('novacategoria', {
                    url: '/nova-categoria',
                    templateUrl: 'templates/admin/category/newcategory.html',
                    controller: 'NewCategoryController',
                    resolve: {
                        categories: function (Utils, CategoryService) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        }
                    }
                })

                .state('editarcategoria', {
                    url: '/editar-categoria/',
                    templateUrl: 'templates/admin/category/editcategory.html',
                    controller: 'EditCategoryController',
                    params: {category: {}},
                    resolve: {
                        category: function ($stateParams) {
                            return $stateParams.category;
                        },
                        categories: function (Utils, CategoryService) {
                            Utils.showLoading();
                            var categories = CategoryService.getAllCategories();
                            return categories.$loaded();
                        }
                    }
                })

                /* cidades */

                .state('listagemcidade', {
                    url: '/listagem-cidade',
                    templateUrl: 'templates/admin/cidade/listagem_cidade.html',
                    controller: 'ListagemCidadeCtrl',
                    resolve: {
                        cities: function (CityService, Utils) {
                            Utils.showLoading();
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

                .state('novacidade', {
                    url: '/nova-categoria',
                    templateUrl: 'templates/admin/cidade/nova_cidade.html',
                    controller: 'NovaCidadeCtrl'
                })

                .state('editarcidade', {
                    url: '/editar-cidade/',
                    templateUrl: 'templates/admin/cidade/editar_cidade.html',
                    controller: 'EditarCidadeCtrl',
                    params: {city: {}},
                    resolve: {
                        city: function ($stateParams) {
                            console.log(11);
                            return $stateParams.city;
                        },
                        neighborhoods: function (FirebaseManager, city, Utils) {
                            console.log(22);
                            console.log(city);
                            var n = [];
                            if (!Utils.isObjectEmpty(city)) {
                                n = FirebaseManager.DAO.list(FirebaseManager.REFERENCES.neighborhoodByCity(city.$id));
                            }

                            if (Array.isArray(n)) {
                                return n;
                            }
                            return n.$loaded();
                        }
                    }
                })

                .state('upload', {
                    url: '/up',
                    templateUrl: 'templates/admin/upload.html',
                    controller: 'UploadCtrl'
                })
    }

    app.config(config);
})();