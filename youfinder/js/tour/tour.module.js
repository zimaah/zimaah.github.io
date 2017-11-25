(function(){
    
    var app = angular.module('TourModule', []);
    var config = function(){
        console.log('config TourModule...');
    }
    
    var run = function(){
        console.log('run TourModule...');
    }
    
    app.config(config);
    app.run(run);
})();