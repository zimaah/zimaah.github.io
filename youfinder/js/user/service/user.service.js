(function () {

    var userService = function (firebaseData, $firebaseArray, Utils, RouteService, firebaseStorage) {

        this.save = function (user, successMessage) {
            Utils.showLoading();
            let ref = firebaseData.refUser();
            let users = $firebaseArray(ref);

            // photo
            if (Utils.isEmpty(user.photoURL)) {
                user.photoURL = Utils.getSessionStorage('user.photoURL');
                Utils.setSessionStorage('user.photoURL', null);
            }
            
            // Date field
            if (user.birthday) {
                user.birthday = new Date(user.birthday).toISOString();
            }

            users.$loaded().then(function () {
                let index = users.$indexFor(user.$id);
                users[index] = user;

                users.$save(user).then(function () {
                    Utils.setLocalStorage('userRoot', user);
                    Utils.hideLoading();
                    successMessage = successMessage ? successMessage : 'Cidade configurada com sucesso. Agora é só aproveitar os melhores comércios e promoções!';
                    Utils.showAlertCallback('Sucesso', successMessage, function () {
                        RouteService.goHome();
                    });
                });
            });
        }

        this.getAllUsers = function () {
            var ref = firebaseData.refUser();
            var users = $firebaseArray(ref);
            return users;
        }

        this.getMessages = function () {
            var userLogged = Utils.getLocalStorage('userRoot');
            var ref = firebaseData.refChat().child(userLogged.$id);
            var users = $firebaseArray(ref);
            return users;
        }

        this.update = function (user) {
            var ref = firebaseData.refUser();
            var users = $firebaseArray(ref);
            
            // Date field
            if (user.birthday) {
                user.birthday = new Date(user.birthday).toISOString();
            }

            users.$loaded().then(function () {
                var index = users.$indexFor(user.$id);
                users[index] = user;
                users.$save(user).then(function () {
                    console.log('Usuário atualizado');
                    console.log(user);
                });
            })
        }

        this.getConfigRemovePhoto = function (config) {
            var optionsDeletePhoto = {
                refStorage: firebaseStorage.refUserPhoto(),
                fileName: config.fileName,
                scopeVarDownloadURL: 'photoURL',
                scopeVarVisibleUpload: 'visibleUploadContainer',
                inputFileId: 'uploadphoto',
                scope: config.scope,
                persist: {
                    firebaseRef: firebaseData.refUser(),
                    firebaseBean: config.bean,
                    attributeName: 'photoURL',
                    fullAttributeName: 'user.photoURL'
                },
                callbackSuccess: function () {
                    Utils.showAlert('Foto removida com sucesso!');
                },
                callbackError: {}
            }

            return optionsDeletePhoto;
        }
        
        this.getConfigUploadPhoto = function(config){
            var configUpload = {
                refStorage: firebaseStorage.refUserPhoto(),
                inputFileId: 'uploadphoto',
                scopeVarDownloadURL: 'photoURL',
                scopeVarVisibleUpload: 'visibleUploadContainer',
                scope: config.scope,
                persist: {
                    attributeName: 'photoURL', // nome do campo
                    firebaseRef: firebaseData.refUser(), // referência ao node
                    firebaseBean: config.bean, // o bean que está sendo alterado | null = NOVO
                    fullAttributeName: 'user.photoURL'
                }
            }

            return configUpload;
        }

    }

    angular.module('starter').service('UserService', userService);

})();

