(function () {

    var app = angular.module('starter');
    var loginService = function (firebaseData, Utils, $ionicSideMenuDelegate, $ionicHistory, $firebaseAuth, $firebaseArray,
            RouteService, TYPE_USER, TYPE_CUSTOMER, LoginErrorService) {

        var that = this;

        this.showLoginMenu = function () {
            return Utils.isEmpty(Utils.getLocalStorage('userRoot'));
        }

        this.isUser = function () {
            var is = false;
            var user = Utils.getLocalStorage('userRoot');

            if (!Utils.isEmpty(user)) {
                is = user.type == TYPE_USER;
            }

            return is;
        }

        this.isCustomer = function () {
            var is = false;
            var user = Utils.getLocalStorage('userRoot');

            if (!Utils.isEmpty(user)) {
                is = user.type == TYPE_CUSTOMER;
            }

            return is;
        }

        this.setUserLocalStorage = function (user) {
            Utils.setLocalStorage('userRoot', user);
        }

        this.isUserLogged = function () {
            return !Utils.isEmpty(Utils.getLocalStorage('userRoot'));
        }

        this.logout = function () {

            $firebaseAuth().$signOut().then(function () {

                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                // clear all
                Utils.clearLocalStorage();
                RouteService.goLogin();

            }, function (error) {
                console.log('Erro no logout...');
            });
        }

        this.createAccountEmailAndPassword = function (login) {
            var auth = $firebaseAuth();
            Utils.showLoading();

            auth.$createUserWithEmailAndPassword(login.email, login.password).then(function (firebaseUser) {

                // cria o node 'user' no banco do Firebase e redireciona para home
                that.createUserFirebase(firebaseUser);

            }).catch(function (error) {
                Utils.hideLoading();
                LoginErrorService.handleLoginError(error);
            });

        }

        this.loginEmailAndPassword = function (email, password) {
            var auth = $firebaseAuth();

            if (Utils.isEmpty(email) || Utils.isEmpty(password)) {
                Utils.showAlert('Ops...', 'E-mail/Senha inválidos');
            } else {
                Utils.showLoading();

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                auth.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {

                    var userPromise = that.getFirebaseUserByUID(firebaseUser.uid);
                    userPromise.$loaded().then(function (userArray) {
                        var user = userArray[0];
                        Utils.setLocalStorage('userRoot', user);
                        Utils.hideLoading();

                        if (that.tourExecuted()) {
                            if (Utils.isEmpty(user.city)) {
                                RouteService.goChooseCity();
                            } else {
                                RouteService.goHome(user);
                            }
                        } else {
                            RouteService.goTour();
                        }
                    });

                }).catch(function (error) {
                    Utils.hideLoading();
                    LoginErrorService.handleLoginError(error);
                });
            }
        }

        this.loginFacebook = function () {
            var auth = $firebaseAuth();

            // login with Facebook
            auth.$signInWithPopup("facebook").then(function (firebaseUser) {
                console.log(firebaseUser.user);

                // cria o node 'user' no banco do Firebase
                that.createUserFirebase(firebaseUser.user);

            }).catch(function (error) {
                var errorCode = error.code;
                console.log(errorCode);
                Utils.hideLoading();

                LoginErrorService.handleLoginError(error);
            });
        }

        this.tourExecuted = function () {
            var tourExecuted = Utils.getLocalStorage('tourExecuted');
            return tourExecuted == true;
        }

        /*
         * Cria um usuário no banco de dados Firebase.
         * Utilizado após o login, porque apenas logar não cria um novo usuário no database
         * 
         */
        this.createUserFirebase = function (firebaseUser) {
            var ref = firebaseData.refUser();
            var users = $firebaseArray(ref);
            var myUser = that.createUserObject(firebaseUser);
            console.log('createUserFirebase', firebaseUser);

            var userPromise = users.$add(myUser);
            var users = $firebaseArray(firebaseData.refUser());

            userPromise.then(function (ref) {
                var newUser = users.$getRecord(ref.key);

                // save the logged user
                Utils.setLocalStorage('userRoot', newUser);
                Utils.hideLoading();

                if (that.tourExecuted()) {
                    if (Utils.isEmpty(newUser.city)) {
                        RouteService.goChooseCity();
                    } else {
                        RouteService.goHome(newUser);
                    }
                } else {
                    RouteService.goTour();
                }
            });
        }

        this.createUserObject = function (firebaseUser) {
            return {
                // attributes of Facebok Login
                fullname: firebaseUser.displayName ? firebaseUser.displayName : '',
                photoURL: firebaseUser.photoURL ? firebaseUser.photoURL : '',

                emailone: firebaseUser.email,
                uid: firebaseUser.uid,
                type: TYPE_USER
            };
        }

        /**
         * Criar a conta no Firebase apenas adiciona o usuário na sessão Authentication do Firebase (e não no banco de dados).
         * Quando o usuário loga a primeira vez (cria a conta) é preciso criar o registro no database do Firebase também.
         * 
         * @param {type} firebaseUser
         * @returns {undefined}
         */
        this.checkUserExists = function (firebaseUser) {
            var query = that.getFirebaseUserByUID(firebaseUser.uid);
            query.once('value', function (snapshot) {
                var user = snapshot.val();
                exists = !Utils.isEmpty(user);

                if (!exists) {
                    that.createUserFirebase(firebaseUser).then(function (user) {
                        that.setUserLocalStorage(user);
                        Utils.hideLoading();
                        RouteService.goHomeUser({user: user});
                    });
                } else {
                    that.setUserLocalStorage(user);
                    Utils.hideLoading();
                    RouteService.goHomeUser({user: user});
                }
            });
        }

        this.getFirebaseUserByUID = function (uid) {
            var ref = firebaseData.refUser().orderByChild('uid').equalTo(uid);
            return $firebaseArray(ref);
        }

        /**
         * Chamar no início de cada controller.
         * Esse método verifica se tem usuário logado e qual tipo de usuário está logado.
         * Atualmente o método verifica dois tipos de usuário: admin e usuário (comum)
         * 
         * @returns {undefined}
         */
        this.checkLogin = function () {
            console.log('checklogin');
            var user = Utils.getLocalStorage('userRoot');
            if (that.isUserLogged()) {
                RouteService.goHome(user);
            } else {
                RouteService.goLogin();
            }
        }

        this.saveUser = function (user) {

            if (Utils.isEmpty(user.photoURL)) {
                user.photoURL = Utils.getSessionStorage('user.photoURL');
                Utils.setSessionStorage('user.photoURL', null);
            }

            that.updateUser(user);
        }

        this.updateUser = function (user) {
            var ref = firebaseData.refUser();
            var users = $firebaseArray(ref);

            users.$loaded().then(function () {
                var index = users.$indexFor(user.$id);
                users[index] = user;
                users.$save(user).then(function () {
                    Utils.hideLoading();
                    Utils.showAlertCallback('Sucesso', 'Salvo com sucesso!', function () {
                        RouteService.goHome();
                    });
                });
            })
        }

        this.isAdmin = function (email) {
            email = email ? email : Utils.getLocalStorage('userRoot').emailone;

            var emailZima = 'guilherme@youfinder.com';
            var is = email == emailZima;
            console.log(email + ' isAdmin == ' + is);

            return is;
        }

        this.resetPasswordEmail = function (email) {
            var auth = $firebaseAuth();

            auth.$sendPasswordResetEmail('zimaah@gmail.com').then(function () {
                Utils.showAlert('Pronto!', 'zimaah@gmail.com verifique sua caixa de entrada :)');
                console.log("Password reset email sent successfully!");
            }).catch(function (error) {
                console.error("Error: ", error);
            });
        }

        this.loginEmailAndPasswordCustomer = function (email, password) {
            var auth = $firebaseAuth();

            if (Utils.isEmpty(email) || Utils.isEmpty(password)) {
                Utils.showAlert('Ops...', 'E-mail/Senha inválidos');
            } else {
                Utils.showLoading();

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                auth.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {

                    var customerPromise = that.getFirebaseCustomerByEmail(email);
                    customerPromise.$loaded().then(function (customerArray) {
                        var customer = customerArray[0];
                        console.log('userRootCustomer login.service');
                        console.log(customer);
                        Utils.setLocalStorage('userRoot', customer);
                        Utils.hideLoading();

                        if (that.tourExecuted()) {
                            console.log(1);
                            RouteService.goHome(customer);
                        } else {
                            console.log(2);
                            RouteService.goTour();
                        }
                    });

                }).catch(function (error) {
                    Utils.hideLoading();
                    LoginErrorService.handleLoginError(error);
                });
            }
        }

        this.getFirebaseCustomerByEmail = function (email) {
            var ref = firebaseData.refCustomer().orderByChild('emailone').equalTo(email);
            return $firebaseArray(ref);
        }
    }

    app.service('LoginService', loginService);

})();

