angular.module('starter')
        .controller('HomeController', function ($scope, Utils, categories, RouteService, UIAnimationService, CategoryService) {
            if (Utils.isEmpty(Utils.getLocalStorage('userRoot'))) {
                RouteService.goLogin();
            }
            
            $scope.categories = categories;

            listCustomersByCategory = function (category) {
                Utils.showLoading();
                Utils.setLocalStorage('categoryHomeClick', category);
                RouteService.goCustomerByCategory({
                    category: category,
                    isFromCategories: true,
                    isFromSubCategories: false,
                    customersByParentCategory: []
                });
            }

            /**
             * config = {
             *    childCategories: [],
             *    parentCategory: {}
             * }
             * 
             * @param object config
             * @returns {undefined}
             */
            listSubCategories = function (config) {
                Utils.showLoading();
                RouteService.goSubCategories(config);
            }

            /**
             * Check if the current clicked category has child categories.
             * If has, go to subcategories.
             * Otherwise, go to category's customers;
             * 
             * @param {type} category
             * @returns {undefined}
             */
            $scope.goToSubCategoryOrCustomers = function (category) {

                var childCategoriesPromise = CategoryService.getChildCategories(category.$id);

                childCategoriesPromise.$loaded().then(function (childCategories) {

                    // go to customers
                    if (Utils.isEmpty(childCategories)) {
                        listCustomersByCategory(category);

                        // it has child categories, so go to child categories
                    } else {
                        listSubCategories({
                            'subCategories': childCategories,
                            'parentCategory': category
                        });
                    }
                })
            }

            // called when the last element of ng-repeat is displayed
            $scope.effect = function () {
                console.log('pa!');
                
                UIAnimationService.applyUIAnimation({
                    classSelector: 'categoryHomeList',
                    animateType: 'animate-fade-slide-in-right',
                    timeoutEffect: 200 //ms
                });
            }
            
            Utils.hideLoading();
        })

        // sidemenu controller
        .controller('AppController', function ($scope, LoginService, Utils, RouteService, userLogged, TYPE_CUSTOMER, TYPE_USER) {
            if (Utils.isEmpty(userLogged)) {
                Utils.hideLoading();
                RouteService.goLogin();
            }
            
            var navIcons = document.getElementsByClassName('ion-navicon');
            for (var i = 0; i < navIcons.length; i++) {
                navIcons.addEventListener('click', function () {
                    this.classList.toggle('active');
                });
            }

            $scope.userLogged = userLogged;
            $scope.user = {};
            $scope.user.fullname = Utils.isEmpty(userLogged) ? 'Visitante' : userLogged.fullname || userLogged.emailone;

            // only to display photo
            $scope.photoURL = userLogged.photoURL || 'img/boy.svg';

            // sidemenu visible control
            $scope.isCustomer = userLogged.type == TYPE_CUSTOMER;
            $scope.isUser = userLogged.type == TYPE_USER;

            $scope.logout = function () {
                LoginService.logout();
            }

            $scope.goPerfil = function () {
                RouteService.goProfile();
            }

            $scope.iconHome = Utils.getIcon({
                name: 'home'
            });
            $scope.iconPerson = Utils.getIcon({
                name: 'person'
            });
            $scope.iconCategory = Utils.getIcon({
                name: 'category'
            });
            $scope.iconLogout = Utils.getIcon({
                name: 'logout'
            });
            $scope.iconFavorite = Utils.getIcon({
                name: 'favorite'
            });
            $scope.iconSearch = Utils.getIcon({
                name: 'search'
            });

        });