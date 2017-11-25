(function () {
    let app = angular.module('starter');
    let logError = function (Utils, firebaseData, $firebaseArray) {
        var refLogError = firebaseData.refLogError();
        
        var _self = this;
        
        this.saveLog = function(error){
            var errors = $firebaseArray(refLogError);
            errors.$add(error);
        }
        
        this.handleLoginError = function (error) {
            Utils.hideLoading();
            var errorCode = error.code;

            if (errorCode === 'auth/wrong-password') {
                Utils.showAlert('Ops...', 'Senha incorreta');
            } else if (errorCode === 'auth/user-not-found') {
                Utils.showAlert('Atenção', 'E-mail não cadastrado');
            } else if (errorCode === 'auth/invalid-email') {
                Utils.showAlert('E-mail inválido', 'O e-mail precisa estar no formato nome@dominio.com.br');
            } else if (errorCode === 'auth/email-already-in-use') {
                Utils.showAlert('E-mail inválido', 'Esse e-mail já está sendo utilizado em outra conta');
            } else {
                console.log(error);
                _self.saveLog(error);
                Utils.showAlert('Ops...', 'Aconteceu um erro inesperado. Verifique se o e-mail/senha estão corretos e se voce está conectado à internet. Caso o problema persista, tente novamente em instantes.');
            }
        }
        
    }

    app.service('LoginErrorService', logError);
})();