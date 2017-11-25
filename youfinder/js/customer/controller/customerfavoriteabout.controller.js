(function () {
    var app = angular.module('starter');

    var customerFavoriteAboutController = function ($scope, customer, Utils, UIAnimationService, GooglePlacesService, subCategories, category) {
        Utils.hideLoading();
        $scope.customer = customer;
        $scope.subCategoriesText = subCategories;
        $scope.coverPhotoURL = Utils.getCustomerCoverPhoto(category);

        $scope.worksOnSaturday = !Utils.isEmpty(customer.saturdayHourOne) && !Utils.isEmpty(customer.saturdayHourTwo);
        $scope.worksOnSunday = !Utils.isEmpty(customer.sundayHourOne) && !Utils.isEmpty(customer.sundayHourTwo);

        UIAnimationService.applyUIAnimation({
            classSelector: 'customerProfileList',
            animateType: 'animate-fade-slide-in-right',
            timeoutEffect: 200 //ms
        });

        // to avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_favorite'});
    }
    
    app.controller('CustomerFavoriteAboutController', customerFavoriteAboutController);
})();