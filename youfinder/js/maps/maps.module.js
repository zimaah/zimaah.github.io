(function () {
    var app = angular.module('MapsModule', ['ngMap']);
    var config = function ($stateProvider) {

        $stateProvider.state('maps', {
            url: '/maps',
            templateUrl: 'js/maps/template/maps.html',
            controller: 'MapsController'
        })
    }
    
    app.config(config);
})();