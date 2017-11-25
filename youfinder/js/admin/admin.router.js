/* admin zone */

angular.module('starter').config(function ($stateProvider) {

    $stateProvider

            .state('adminmenu', {
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

            /* clientes */

            .state('listagemcliente', {
                url: '/listagem-cliente',
                templateUrl: 'templates/admin/cliente/listagem_cliente.html',
                controller: 'ListagemClienteCtrl',
                resolve: {
                    customers: function (CustomerService, Utils) {
                        Utils.showLoading();
                        var customers = CustomerService.getAllCustomers();
                        return customers.$loaded();
                    }
                }
            })

            .state('novocliente', {
                url: '/novo-cliente/dados',
                templateUrl: 'templates/admin/cliente/novo_cliente.html',
                controller: 'NovoClienteCtrl',
                resolve: {
                    categories: function (CategoryService, Utils) {
                        Utils.showLoading();
                        var categories = CategoryService.getAllCategories();

                        return categories.$loaded();
                    },

                    cities: function (CityService, Utils) {
                        var cities = CityService.getAllCities();

                        return cities.$loaded();
                    }
                }
            })

            .state('editarcliente', {
                url: '/editar-cliente/dados/',
                templateUrl: 'templates/admin/cliente/editar_cliente.html',
                controller: 'EditarClienteCtrl',
                params: {customer: {}},
                resolve: {
                    customer: function ($stateParams) {
                        return $stateParams.customer;
                    },
                    categories: function (CategoryService, Utils) {
                        Utils.showLoading();
                        var categories = CategoryService.getAllCategories();
                        return categories.$loaded();
                    },

                    cities: function (CityService) {
                        var cities = CityService.getAllCities();
                        return cities.$loaded();
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
                controller: 'NewCategoryController'
            })

            .state('editarcategoria', {
                url: '/editar-categoria/',
                templateUrl: 'templates/admin/category/editcategory.html',
                controller: 'EditCategoryController',
                params: {category: {}},
                resolve: {
                    category: function ($stateParams) {
                        return $stateParams.category;
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
                        return $stateParams.city;
                    }
                }
            })

            .state('upload', {
                url: '/up',
                templateUrl: 'templates/admin/upload.html',
                controller: 'UploadCtrl'
            })

})