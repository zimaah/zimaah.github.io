(function(){
    
    let logService = function(){
        
        this.log = function(message, object){
            console.log(message + ' | ' + new Date(), object);
        }
        
    }
    
    let app = angular.module('starter');
    
    app.service('LogService', logService);
    
})();