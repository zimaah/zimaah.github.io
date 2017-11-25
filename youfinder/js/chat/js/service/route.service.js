(function(){
    var app = angular.module('ChatModule');
    var chatRouteService = function($state){
        
        this.goChat = function(param){
            $state.go('chat', {chatId: param.chatId, partner: param.partner});
        }
        
        this.goChatMenu = function(){
            $state.go('chatmenu');
        }
        
        this.goNewChat = function(){
            $state.go('newchat');
        }
    }
    
    app.service('ChatRouteService', chatRouteService);
    
    
    
})();