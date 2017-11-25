(function () {
//    The difference is scoping. var is scoped to the nearest function block and let is scoped to the nearest
//    enclosing block (both are global if outside any block), which can be smaller than a function block.
//    Also, variables declared with let are not accessible before they are declared in their enclosing block.
//    Fonte: https://goo.gl/TsjxJc (Stackoverflow)
    var userProfileController = function (UserService, $scope, user, RouteService, Utils, UploadService) {
        user = user ? user : Utils.getLocalStorage('userRoot');        
        user.birthday = new Date(user.birthday);
        $scope.user = user;
        $scope.user.fullname = Utils.isEmpty(user) ? 'Visitante' : user.fullname;
        $scope.photoURL = user.photoURL || 'img/boy.svg';
        
        var configUploadPhoto = UserService.getConfigUploadPhoto({
            bean: user,
            scope: $scope
        });
        UploadService.doUpload(configUploadPhoto);
        
        $scope.removeFile = function (downloadURL) {
            Utils.showLoading();

            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFile = UserService.getConfigRemovePhoto({
                bean: user,
                fileName: fileName,
                scope: $scope
            });

            UploadService.deleteFile(optionsDeleteFile);
        }

        // controle de visibilidade do botão de upload e remoção do arquivo
        $scope.visibleUploadContainer = Utils.isEmpty(user.photoURL);
        
        $scope.fireUploadEvent = function(inputId){
            $('#' + inputId).trigger('click');
        }

        $scope.save = function () {
            console.log($scope.user);
            UserService.save($scope.user, 'Perfil salvo com sucesso!');
        }

        $scope.goHome = function () {
            RouteService.goHome();
        }
        $scope.iconBack = Utils.getIcon({
            name: 'back'
        });
        $scope.iconSave = Utils.getIcon({
            name: 'save'
        });
    }

    var app = angular.module('starter');
    app.controller('UserProfileController', userProfileController);
})();