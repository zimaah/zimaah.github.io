(function () {
    var app = angular.module('starter');
    var customerDetailtAboutController = function ($scope, customer, Utils, UIAnimationService, GooglePlacesService, RouteService, subCategories, configs) {
        Utils.hideLoading();
        console.log(configs);
        $scope.customer = customer;
        $scope.coverPhotoURL = Utils.getCustomerCoverPhoto(configs);
        
        $scope.subCategoriesText = subCategories;

        $scope.goBack = function () {
            if (configs.isFromSearch) {
                RouteService.goSearch(configs);
            } else {
                RouteService.goCustomerByCategory(configs);
            }
            
        }

        $scope.worksOnSaturday = !Utils.isEmpty(customer.saturdayHourOne) && !Utils.isEmpty(customer.saturdayHourTwo);
        $scope.worksOnSunday = !Utils.isEmpty(customer.sundayHourOne) && !Utils.isEmpty(customer.sundayHourTwo);

        UIAnimationService.applyUIAnimation({
            classSelector: 'customerProfileList',
            animateType: 'animate-fade-slide-in-right',
            timeoutEffect: 200 //ms
        });
        
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });

        // to avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_edit'});
    };
    
    app.controller('CustomerDetailAboutController', customerDetailtAboutController);

})();