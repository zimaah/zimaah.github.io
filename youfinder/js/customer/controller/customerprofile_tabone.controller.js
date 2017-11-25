(function () {

    var app = angular.module('starter');
    var customerProfileTabOneController = function ($scope, Utils, customer, UIAnimationService, GooglePlacesService, subCategories, category) {

        $scope.coverPhotoURL = Utils.getCustomerCoverPhoto(category);
        console.log(customer);
        $scope.customer = customer;
        $scope.subCategoriesText = subCategories;

        $scope.worksOnSaturday = !Utils.isEmpty(customer.saturdayHourOne) && !Utils.isEmpty(customer.saturdayHourTwo);
        $scope.worksOnSunday = !Utils.isEmpty(customer.sundayHourOne) && !Utils.isEmpty(customer.sundayHourTwo);

        UIAnimationService.applyUIAnimation({
            classSelector: 'customerProfileList',
            animateType: 'animate-fade-slide-in-right',
            timeoutEffect: 100 //ms
        });

        // to avoid grey map bug
        GooglePlacesService.centerMap({mapId: 'customermap_edit'});

    }

    app.controller('CustomerProfileTabOne', customerProfileTabOneController);

})();