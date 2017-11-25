(function () {

    var app = angular.module('starter');
    var customerProfileController = function ($scope, RouteService, $cordovaSocialSharing) {

        $scope.goHome = function () {
            RouteService.goHome();
        }

        $scope.openWhats = function () {
            $cordovaSocialSharing
                    .shareViaWhatsApp("Compartilhando via Whats diretamente do YouFinder")
                    .then(function (result) {
                        console.log(result);
                    }, function (err) {
                        console.log(err);
                    });
        }
    }

    app.controller('CustomerProfileController', customerProfileController);

})();