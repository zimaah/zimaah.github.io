(function () {
    var app = angular.module('starter');
    var customerFilterController = function (firebaseData, GooglePlacesService, FirebaseManager, $scope, RouteService, Utils, neighborhoods, UIAnimationService, CustomerService, configs) {
        console.log(configs);
        $scope.searchgeo = {
            value: false
        };
        $scope.neighborhoods = neighborhoods;
        $scope.distanceRange = {};

        // trick to add option ALL in neighborhoods filter
        $scope.neighborhoods.push({
            $id: 33,
            fullname: "TODOS"
        });

        $scope.goBack = function () {
            if (configs.isFromSearch) {
                RouteService.goSearch();
            } else {
                RouteService.goCustomerByCategory(configs);
            }

        }

        $scope.doFilter = function () {
            Utils.showLoading();
            let isFilterByNeighborhood = ($scope.selectedNeighborhood && $scope.selectedNeighborhood != 33); // 33 ALL index
            let selectedCategoryId = configs.parentCategory ? configs.parentCategory.$id : false;
            let distanceRange = $scope.distanceRange.value;

            if ($scope.searchgeo.value) {
                let ref = firebaseData.refCustomer();
                CustomerService.filterByGeo({
                    scope: $scope,
                    configs: configs,
                    distance: distanceRange,
                    ref: ref,
                    isFilterByNeighborhood: isFilterByNeighborhood,
                    neighborhoodId: $scope.selectedNeighborhood,
                    categoryId: selectedCategoryId
                });

            } else if (isFilterByNeighborhood) {
                let ref = CustomerService.references().customersByNeighborhood($scope.selectedNeighborhood);
                let list = FirebaseManager.DAO.list({
                    ref: ref,
                    where: [
                        {
                            type: 'orderByChild', // byId, orderByChild
                            operation: 'equalTo',
                            value: $scope.selectedNeighborhood,
                            field: 'neighborhood' // quando é byId não precisa
                        }
                    ]
                });

                list.$loaded().then(function (newList) {
                    let filteredList = newList;

                    // filter by category
                    if (selectedCategoryId) {
                        filteredList = list.filter(function (customer) {
                            return customer.category == selectedCategoryId;
                        });
                    }


                    // filter by subCategory
                    if (configs.subCategory) {
                        filteredList = CustomerService.filterBySubCategory({
                            customers: filteredList,
                            subCategory: configs.subCategory
                        });
                    }

                    if (configs && configs.isFromSearch) {
                        configs.customers = filteredList;
                        RouteService.goSearch(configs);
                    } else {
                        configs.customersByParentCategory = filteredList;
                        RouteService.goCustomerByCategoryFilter(configs);
                    }
                });

                // without filter
            } else {
                if (configs && configs.isFromSearch) {
                    RouteService.goSearch(configs);
                } else {
                    RouteService.goCustomerByCategory(configs);
                }

            }
        }

        $scope.neighborhoodAll = {};
        $scope.neighborhood = {};
        $scope.checkNeighborhood = function (neighborhoodChecked) {
            // ALL
            if (neighborhoodChecked == 33) {
                $scope['selectedNeighborhood'] = 33;
                return;
            }

            Utils.checkItemRadioGroup({
                scope: $scope, // scope
                scopeSelectedItem: 'selectedNeighborhood', // scope variable that holds the checked item
                checkedItem: neighborhoodChecked, // item when clicked
                itens: neighborhoods // list of itens
            });
        }

        $scope.checkCoords = function (checked) {
            $scope.searchgeo.value = checked;
            $scope.distanceRange.value = 10;
            console.log($scope.searchgeo ? 'truuu' : 'feuse');
            if (checked) {
                GooglePlacesService.getCurrentGeolocation({
                    scope: $scope,
                    modelCheckboxGeo: 'searchgeo' // to uncheck if getCurrentGeolocation fail
                });
            }
            console.log($scope);
        }

        // called when the last element of ng-repeat is displayed
        $scope.effect = function () {
            UIAnimationService.applyUIAnimation({
                classSelector: 'customerByCategoryFilterList',
                animateType: 'animate-fade-slide-in-right',
                timeoutEffect: 200 //ms
            });
        }

        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });
        $scope.iconCheck = Utils.getIcon({
            name: 'check'
        });
        $scope.iconLocation = Utils.getIcon({
            name: 'location'
        });
        $scope.iconMap = Utils.getIcon({
            name: 'map'
        });

        Utils.hideLoading();
    }

    app.controller('CustomerFilterController', customerFilterController);
})();