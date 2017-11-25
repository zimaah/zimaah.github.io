(function () {
    var app = angular.module('starter');
    var config = function ($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider, ionicImgCacheProvider) {

        ionic.Platform.ready(function () {
            $cordovaInAppBrowserProvider.setDefaultOptions({
                location: 'no',
                clearcache: 'no',
                toolbar: 'no'
            });
        })

        $stateProvider
                // sidemenu
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/sidemenu.html',
                    controller: 'AppController',
                    resolve: {
                        userLogged: function (Utils) {
                            return Utils.getLocalStorage('userRoot');
                        }
                    }
                })

                // login
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'LoginController'
                })

                // login FORMMMMM
                .state('loginForm', {
                    url: '/login-form',
                    templateUrl: 'templates/login_form.html',
                    controller: 'LoginController'
                })

                // criar conta
                .state('formCreateAccount', {
                    url: '/criar-conta',
                    templateUrl: 'templates/createaccount.html',
                    controller: 'LoginController'
                })

                // criar conta
                .state('resetpassword', {
                    url: '/recuperar-senha',
                    templateUrl: 'templates/resetpassword.html',
                    controller: 'LoginController'
                })

                //logout
                .state('logout', {
                    url: '/logout',
                    controller: 'LoginController'
                })

                // customer area
                .state('customerarea', {
                    url: '/area-comerciante',
                    templateUrl: 'templates/customer/login_customer.html',
                    controller: 'LoginCustomerController'
                })
                
                // saerch
                .state('search', {
                    url: '/pesquisar',
                    templateUrl: 'templates/search.html',
                    controller: 'SearchController',
                    params: {config: {}},
                    resolve: {
                        customers: function (Utils, CustomerService, $stateParams) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            
                            // filtereds
                            if ($stateParams.config && $stateParams.config.customers)
                                return  $stateParams.config.customers;
                            
                            // all customers by city
                            else
                                return CustomerService.getCustomersByCity(userRoot.city).$loaded();
                        },
                        configs: function(){
                            return {
                                isFromSearch: true
                            };
                        }
                    }
                })

                // tour
                .state('tour', {
                    url: '/tour',
                    templateUrl: 'js/tour/template/tour.html',
                    controller: 'TourController',
                    resolve: {
                        userRoot: function (Utils) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            return userRoot;
                        }
                    }
                })

                /* VISÃO USUÁRIO */
                .state('categories', {
                    url: '/categorias',
                    templateUrl: 'templates/categories.html',
                    controller: 'CategoriesController',
                    resolve: {
                        categories: function (CategoryService, Utils) {
                            Utils.showLoading();
                            var categories = CategoryService.getParentCategories();

                            // promise
                            return categories.$loaded();
                        }
                    }
                })

//                'subCategories': childCategories,
//                            'parentCategory': category

                .state('subCategories', {
                    url: '/subcategorias',
                    templateUrl: 'templates/subcategories.html',
                    controller: 'SubCategoriesController',
                    params: {config: {}},
                    resolve: {
                        categories: function ($stateParams, Utils, CategoryService) {
                            Utils.showLoading();
                            console.log($stateParams.config);
                            return $stateParams.config.subCategories || CategoryService.getChildCategories($stateParams.config.parentCategory.$id);
                        },
                        customersByParentCategory: function ($stateParams, CustomerService) {
                            console.log($stateParams.config.parentCategory);
                            return CustomerService.getCustomerByCategory($stateParams.config.parentCategory.$id);
                        },
                        configs: function ($stateParams) {
                            return $stateParams.config;
                        }
                    }
                })

                // home usuário
                .state('app.home', {
                    url: '/home',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/home.html',
                            controller: 'HomeController',
                            resolve: {
                                categories: function (Utils, CategoryService) {
                                    Utils.showLoading();
//                                    return CategoryService.getAllCategoriesHasCustomer();
                                    return CategoryService.getAllHomeCategories();
                                }
                            }
                        }
                    }
                })

                // perfil usuário
                /**
                 * PARAMS
                 * url: /minha/url/{param}
                 * 
                 * ou
                 * 
                 * url: /minha/url
                 * params: {param: null}
                 * 
                 */
                .state('userprofile', {
                    url: '/perfil-usuario',
                    templateUrl: 'templates/profile.html',
                    controller: 'UserProfileController',
                    params: {user: null},
                    resolve: {
                        user: function ($stateParams) {
                            return $stateParams.user ? $stateParams.user : {};
                        }
                    }
                })

                /**
                 * category: subCategory,
                 isFromCategories: false,
                 isFromSubCategories: true,
                 customersByParentCategory: customersByParentCategory
                 
                 * @param {type} customers
                 * @param {type} userFavorites
                 * @param {type} CustomerService
                 * @returns {undefined}
                 */

                // listagem de cliente por categoria
                .state('customerbycategory', {
                    url: '/comercios',
                    templateUrl: 'templates/customer/user/customerbycategory.html',
                    controller: 'CustomerByCategoryController',
                    params: {config: {}},
                    resolve: {
                        customers: function (CustomerService, $stateParams) {
                            console.log($stateParams.config);
                            if ($stateParams.config.isFromSubCategories) {

                                if ($stateParams.config.customersByParentCategory && $stateParams.config.customersByParentCategory.length > 0) {
                                    var customersSubCategory = CustomerService.filterBySubCategory({
                                        customers: $stateParams.config.customersByParentCategory,
                                        subCategory: $stateParams.config.subCategory
                                    });
                                    return customersSubCategory;
                                } else {
                                    customers = CustomerService.getCustomerByCategory($stateParams.config.parentCategory.$id);
                                    return customers.$loaded().then(function (customers) {
                                        return CustomerService.filterBySubCategory({
                                            customers: customers,
                                            subCategory: $stateParams.config.subCategory
                                        });
                                    })
                                }

                                // isFromCategories || isFromAllCategories || implementar isFromFilter...?!
                            } else {
                                customers = CustomerService.getCustomerByCategory($stateParams.config.category.$id);
                                return customers.$loaded();
                            }
                        },
                        configs: function ($stateParams) {
                            console.log($stateParams);
                            return $stateParams.config;
                        },
                        userFavorites: function (Utils, FirebaseManager, firebaseData) {
                            console.log('userFavorites');
                            var userRoot = Utils.getLocalStorage('userRoot');
                            var customers = FirebaseManager.DAO.list({
                                ref: firebaseData.refFavorite().child(userRoot.$id)
                            });
                            return customers.$loaded();
                        },
                        customersFavChecked: function (customers, userFavorites, CustomerService) {
                            console.log('customersFavChecked');
                            CustomerService.checkFavorites({
                                'customers': customers,
                                'userFavorites': userFavorites
                            });
                        }
                    }
                })

                // listagem de cliente por categoria COM FILTRO
                .state('customerbycategoryfilter', {
                    url: '/comercios',
                    templateUrl: 'templates/customer/user/customerbycategory.html',
                    controller: 'CustomerByCategoryController',
                    params: {config: {}},
                    resolve: {
                        customers: function ($stateParams) {
                            return $stateParams.config.customersByParentCategory;
                        },
                        categoryName: function (Utils) {
                            return Utils.getLocalStorage('categoryHomeClick').fullname;
                        },
                        configs: function ($stateParams) {
                            return $stateParams.config;
                        },
                        userFavorites: function (Utils, FirebaseManager, firebaseData) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            var customers = FirebaseManager.DAO.list({
                                ref: firebaseData.refFavorite().child(userRoot.$id)
                            });
                            return customers.$loaded();
                        },
                        customersFavChecked: function (customers, userFavorites, CustomerService) {
                            CustomerService.checkFavorites({
                                'customers': customers,
                                'userFavorites': userFavorites
                            });
                        }
                    }
                })

                .state('filtercustomer', {
                    url: '/comercios/filtros',
                    templateUrl: 'templates/customer/user/filter.html',
                    controller: 'CustomerFilterController',
                    params: {config: {}},
                    resolve: {
                        neighborhoods: function (FirebaseManager, Utils) {
                            var userRoot = Utils.getLocalStorage('userRoot');

                            return FirebaseManager.DAO.list({
                                ref: FirebaseManager.REFERENCES.neighborhoodByCity(userRoot.city)
                            });
                        },
                        configs: function ($stateParams) {
                            console.log($stateParams);
                            return $stateParams.config;
                        }
                    }
                })

                // detalhes do cliente (visão usuário) #################                
                .state('customerdetail', {
                    url: '/comercios/perfil',
                    abstract: true,
                    templateUrl: 'templates/customer/user/tabs.html',
                    controller: 'CustomerDetailController'
                })

                // detalhes do cliente (visão usuário) - TAB ONE
                .state('customerdetail.sobre', {
                    url: '/sobre',
                    views: {
                        'tab-sobre-user': {
                            templateUrl: 'templates/customer/user/profile_tabone.html',
                            controller: 'CustomerDetailAboutController'
                        }
                    },
                    params: {customer: {}, configs: {}},
                    resolve: {
                        customer: function ($stateParams, Utils) {
                            var myCustomer = null;
                            if (!Utils.isEmpty($stateParams.customer.fullname)) {
                                Utils.setLocalStorage('customer_userview', $stateParams.customer);
                                myCustomer = $stateParams.customer;
                            } else {
                                myCustomer = Utils.getLocalStorage('customer_userview');
                            }

                            return myCustomer;
                        },
                        categoryName: function ($stateParams, CategoryService, customer) {
                            console.log($stateParams);
                            
                            if ($stateParams.configs && $stateParams.configs.parentCategory) {
                                return $stateParams.configs.parentCategory.fullname;
                            } else {
                                return CategoryService.getCategoryByIdPromise(customer.category).$loaded();
                            }
                            
                            
                        },
                        subCategories: function (customer, categoryName, Utils) {
                            
                            // string
                            if (Utils.isString(categoryName)) {
                                return Utils.getCategoriesFullName(categoryName, customer);
                                
                                // firebase object
                            } else {
                                return Utils.getCategoriesFullName(categoryName.fullname, customer);
                            }
                            
                            
                        },
                        configs: function ($stateParams, Utils) {
                            Utils.setLocalStorage('configs', $stateParams.configs)
                            return $stateParams.configs;
                        }
                    }
                })

                // detalhes do cliente (visão usuário) - TAB TWO
                .state('customerdetail.contatos', {
                    url: '/contatos',
                    views: {
                        'tab-contatos-user': {
                            templateUrl: 'templates/customer/user/profile_tabtwo.html',
                            controller: 'CustomerDetailContactController'
                        }
                    },
                    params: {configs: {}},
                    resolve: {
                        customer: function (Utils) {
                            var customer = Utils.getLocalStorage('customer_userview');
                            return customer;
                        },
                        configs: function (Utils) {
                            return  Utils.getLocalStorage('configs');
                        }
                    }
                })
                // detalhes do cliente (visão usuário) ################# 

                // mudar cidade
                .state('changecity', {
                    url: '/mudar-cidade',
                    templateUrl: 'templates/changecity.html',
                    controller: 'ChangeCityController',
                    resolve: {
                        userCity: function (Utils) {
                            var userLogged = Utils.getLocalStorage('userRoot');
                            return userLogged.city;
                        },
                        cities: function (CityService, Utils) {
                            Utils.showLoading();
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

                // escolher a cidade 1ª vez
                .state('choosecity', {
                    url: '/escolher-cidade',
                    templateUrl: 'templates/choosecity.html',
                    controller: 'ChooseCityController',
                    resolve: {
                        cities: function (CityService, Utils) {
                            Utils.showLoading();
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

//                *** FAVORITOS ***
                .state('favorites', {
                    url: '/favoritos',
                    templateUrl: 'templates/customer/favorite/customerfavorite.html',
                    controller: 'CustomerFavoriteController',
                    resolve: {
                        customers: function (FirebaseManager, firebaseData, Utils) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            var customers = FirebaseManager.DAO.list({
                                ref: firebaseData.refFavorite().child(userRoot.$id)
                            });
                            return customers.$loaded();
                        },
                        userFavorites: function (Utils, FirebaseManager, firebaseData) {
                            var userRoot = Utils.getLocalStorage('userRoot');
                            var customers = FirebaseManager.DAO.list({
                                ref: firebaseData.refFavorite().child(userRoot.$id)
                            });
                            return customers.$loaded();
                        },
                        customersFavChecked: function (customers, userFavorites, CustomerService) {
                            CustomerService.checkFavorites({
                                'customers': customers,
                                'userFavorites': userFavorites
                            });
                        }
                    }
                })

                .state('customerfavoriteview', {
                    url: '/favorito/perfil',
                    abstract: true,
                    templateUrl: 'templates/customer/favorite/tabs.html',
                    controller: 'CustomerFavoriteViewController'
                })

                .state('customerfavoriteview.sobre', {
                    url: '/sobre',
                    views: {
                        'tab-sobre-favorite': {
                            templateUrl: 'templates/customer/favorite/profile_tabone.html',
                            controller: 'CustomerFavoriteAboutController'
                        }
                    },
                    params: {customer: {}},
                    resolve: {
                        customer: function ($stateParams, Utils) {
                            var myCustomer = null;
                            if (!Utils.isEmpty($stateParams.customer.fullname)) {
                                Utils.setLocalStorage('customer_favorite', $stateParams.customer);
                                myCustomer = $stateParams.customer;
                            } else {
                                myCustomer = Utils.getLocalStorage('customer_favorite');
                            }
                            return myCustomer;
                        },
                        category: function (customer, CategoryService) {
                            var category = CategoryService.getCategoryByIdPromise(customer.category);
                            return category.$loaded();
                        },
                        subCategories: function (customer, category, Utils) {
                            return Utils.getCategoriesFullName(category.fullname, customer);
                        }
                    }
                })

                .state('customerfavoriteview.contatos', {
                    url: '/contatos',
                    views: {
                        'tab-contatos-favorite': {
                            templateUrl: 'templates/customer/favorite/profile_tabtwo.html',
                            controller: 'CustomerFavoriteContactController'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            var customer = Utils.getLocalStorage('customer_favorite');
                            return customer;
                        },
                        category: function (customer, CategoryService) {
                            var category = CategoryService.getCategoryByIdPromise(customer.category);
                            return category.$loaded();
                        }
                    }
                })
//                *** FAVORITOS ***

                // ### USUARIO TIPO: CUSTOMER ###
                // home
                .state('app.homecustomer', {
                    url: '/home-comercio',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/customer/home.html',
                            controller: 'HomeCustomerController'
                        }
                    },
                    params: {userRoot: null},
                    resolve: {
                        customer: function (Utils, $stateParams, $firebaseObject, firebaseData) {
                            // updating customer (userRoot)
                            if (!Utils.isEmpty($stateParams.userRoot)) {
                                Utils.setLocalStorage('userRoot', $stateParams.userRoot);
                            }
                            var customer = Utils.getLocalStorage('userRoot');
                            customer = $firebaseObject(firebaseData.refCustomer().orderByChild(customer.$id));
                            return customer.$loaded();
                        },
                        categories: function (Utils, CategoryService) {
                            Utils.showLoading();
                            return CategoryService.getAllHomeCategories();
                        }
                    }

                })

                // tabs pai profile customer
                .state('profiletabs', {
                    url: '/perfil-comercio',
                    abstract: true,
                    templateUrl: 'templates/customer/profile/view/tabs.html',
                    controller: 'CustomerProfileController'
                })

                // profile customer - TAB ONE
                .state('profiletabs.tabone', {
                    url: '/tab-one',
                    views: {
                        'tab-one-customer-view': {
                            templateUrl: 'templates/customer/profile/view/profile_tabone.html',
                            controller: 'CustomerProfileTabOne'
                        }
                    },
                    params: {},
                    resolve: {
                        customer: function (Utils) {
                            var customerLogged = Utils.getLocalStorage('userRoot');
                            return customerLogged;
                        },
                        category: function (customer, CategoryService) {
                            var category = CategoryService.getCategoryByIdPromise(customer.category);
                            return category.$loaded();
                        },
                        subCategories: function (customer, category, Utils) {
                            var subCategories = Utils.getCategoriesFullName(category.fullname, customer);
                            return subCategories;
                        }
                    }
                })

                // profile customer - TAB TWO
                .state('profiletabs.tabtwo', {
                    url: '/tab-two',
                    views: {
                        'tab-two-customer-view': {
                            templateUrl: 'templates/customer/profile/view/profile_tabtwo.html',
                            controller: 'CustomerProfileTabTwo'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            var customerLogged = Utils.getLocalStorage('userRoot');
                            return customerLogged;
                        },
                        category: function (customer, CategoryService) {
                            var category = CategoryService.getCategoryByIdPromise(customer.category);
                            return category.$loaded();
                        }
                    }
                })

                // *** CUSTOMER EDIT OWN PROFILE ***
                .state('tabscustomereditprofile', {
                    url: '/editar',
                    abstract: true,
                    templateUrl: 'templates/customer/profile/edit/editar_cliente.html',
                    controller: 'EditCustomerProfileCtrl'
                })

                .state('tabscustomereditprofile.editarclienteprofile', {
                    url: '/dados',
                    views: {
                        'tab-customer-data-edit': {
                            templateUrl: 'templates/customer/profile/edit/cliente_edit_tab_dados.html',
                            controller: 'EditCustomerProfileDataCtrl'
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

                .state('tabscustomereditprofile.editarclientecontatoprofile', {
                    url: '/contato',
                    views: {
                        'tab-customer-contact-edit': {
                            templateUrl: 'templates/customer/profile/edit/cliente_edit_tab_contato.html',
                            controller: 'EditCustomerProfileContactCtrl'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            var customer = Utils.getLocalStorage('customerEdit');
                            return customer;
                        },
                        cities: function (CityService) {
                            var cities = CityService.getAllCities();
                            return cities.$loaded();
                        }
                    }
                })

                .state('tabscustomereditprofile.editarclientelogoprofile', {
                    url: '/logo',
                    views: {
                        'tab-customer-logo-edit': {
                            templateUrl: 'templates/customer/profile/edit/cliente_edit_tab_imagem.html',
                            controller: 'EditCustomerProfileImageCtrl'
                        }
                    },
                    resolve: {
                        customer: function (Utils) {
                            return Utils.getLocalStorage('customerEdit');
                        }
                    }
                })
        // *** CUSTOMER EDIT OWN PROFILE ***

        $urlRouterProvider.otherwise('/login');
    }

    app.config(config);
})();