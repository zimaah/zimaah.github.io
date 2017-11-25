(function () {
    var app = angular.module('starter');
    var Utils = function ($ionicLoading, $ionicPopup, $window, $cordovaInAppBrowser, $ionicPlatform) {


        var functionObj = {};
        functionObj.showLoading = function (config) {
            var message = config != null ? config.message != null ? config.message : '' : '';
            $ionicLoading.show({
                animation: 'fade-in', // The animation to use
                showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                showDelay: 0,
//                template: '<i class="ion-loading-c"></i> <br> '
                template: '<ion-spinner icon="bubbles"></ion-spinner> <br> ' + message
//                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });
        };
        functionObj.show = function (config) {
            return $ionicPopup.show(config);
        }
        functionObj.hideLoading = function () {
            $ionicLoading.hide();
        };
        functionObj.showAlert = function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
        };
        functionObj.showAlertCallback = function (title, message, callback) {
            $ionicPopup.alert({
                title: title,
                template: message
            }).then(callback);
        };
        functionObj.getAlert = function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
            return alertPopup;
        };
        functionObj.showConfirm = function (title, message, callbackConfirm, callbackCancel) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: message
            });

            confirmPopup.then(function (res) {
                if (res) {
                    if (functionObj.isFunction(callbackConfirm)) {
                        callbackConfirm();
                    }
                } else {
                    if (functionObj.isFunction(callbackCancel)) {
                        callbackCancel();
                    }
                }
            })
        }

        /**
         * config: {
         *      form: {
         *          title: 'Cadastro de Bairros',
         *          template: 'Digite o nome do bairro',
         *          inputType: 'text',
         *          inputPlaceholder: 'Nome do bairro...'
         *      }
         *      callbackConfirm: function,
         *      callbackCancel: function
         * 
         * }
         * 
         * @param object config
         */
        functionObj.showPrompt = function (config) {
            $ionicPopup.prompt(config.form).then(function (result) {
                if (functionObj.isEmpty(result)) {
                    if (functionObj.isFunction(config.callbackCancel)) {
                        config.callbackCancel();
                    }
                } else {
                    if (functionObj.isFunction(config.callbackConfirm)) {
                        config.callbackConfirm(result);
                    }
                }
            });
        }

        // Boolean utils
        functionObj.isEmpty = function (value) {
            return value == '' || value == undefined || value == null || value == 0 || value.length == 0;
        }

        functionObj.isObjectEmpty = function (value) {
            for (var prop in value) {
                if (value.hasOwnProperty(prop))
                    return false;
            }
            return JSON.stringify(value) === JSON.stringify({});
        }

        functionObj.isFunction = function (myFunction) {
            return typeof myFunction === 'function';
        }
        
        functionObj.isString = function (myString) {
            return typeof myString === 'string';
        }
        
        

        functionObj.toJSON = function (value) {
            return angular.toJson(value);
        }

        functionObj.parseJSON = function (value) {
            return JSON.parse(value);
        }

        functionObj.clone = function (obj) {
            if (obj)
                return JSON.parse(JSON.stringify(obj));

            return false;
        }

        functionObj.setSessionStorage = function (key, value) {
            $window.sessionStorage.setItem(key, functionObj.toJSON(value));
        }

        functionObj.getSessionStorage = function (key) {
            return functionObj.parseJSON($window.sessionStorage.getItem(key));
        }

        functionObj.refresh = function () {
            $window.location.reload(); //refresh
        }

        functionObj.hasDoc = function (doc) {
            var has = false;
            if (!functionObj.isEmpty(doc)) {
                has = true;
            }
            return has;
        }

        functionObj.hasPhoto = function (photo) {
            var has = false;
            if (!functionObj.isEmpty(photo)) {
                has = true;
            }
            return has;
        }

        functionObj.setLocalStorage = function (key, value) {
            $window.localStorage.setItem(key, functionObj.toJSON(value));
        }

        functionObj.getLocalStorage = function (key) {
            return functionObj.parseJSON($window.localStorage.getItem(key));
        }

        /**
         * _self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
         * _blank: Opens in the InAppBrowser.
         * _system: Opens in the system's web browser.
         * 
         * @param {type} URL Endereço web a ser carregado
         * @param {type} target _self | _blank | _system
         * @param {type} options
         */
        functionObj.openInAppBrowser = function (URL, target, options) {
            var ref = $cordovaInAppBrowser.open(URL, target, options);
            return ref;
        }

        functionObj.clearLocalStorage = function () {
            $window.localStorage.clear();
        }

        functionObj.checkItemRadioGroup = function (config) {
            // uncheck all and check the clicked item
            angular.forEach(config.itens, function (item) {
                item.selected = false;
                if (config.checkedItem.$id == item.$id) {
                    config.checkedItem.selected = true;
                    config.scope[config.scopeSelectedItem] = config.checkedItem.$id;
                }
            });
        }

        functionObj.getIcon = function (config) {
            let isAndroid = $ionicPlatform.is('android');
            let icon = '';
            switch (config.name) {
                case 'persons':
                    icon = isAndroid ? 'ion-android-people' : 'ion-ios-people';
                    break;
                case 'home':
                {
                    icon = isAndroid ? 'ion-android-home' : 'ion-ios-home';
                    break;
                }
                case 'person':
                {
                    icon = isAndroid ? 'ion-android-contact' : 'ion-ios-person';
                    break;
                }
                case 'category':
                {
                    icon = isAndroid ? 'ion-android-list' : 'ion-ios-paper-outline';
                    break;
                }
                case 'logout':
                {
                    icon = isAndroid ? 'ion-android-arrow-back' : 'ion-ios-arrow-thin-left';
                    break;
                }
                case 'options':
                {
                    icon = isAndroid ? 'ion-android-options' : 'ion-ios-settings';
                    break;
                }
                case 'back':
                {
                    icon = isAndroid ? 'ion-android-arrow-back' : 'ion-ios-arrow-back';
                    break;
                }
                case 'check':
                {
                    icon = isAndroid ? 'ion-android-done' : 'ion-android-done';
                    break;
                }
                case 'favorite':
                {
                    icon = isAndroid ? 'ion-android-favorite' : 'ion-ios-heart';
                    break;
                }
                case 'favoriteOn':
                {
                    icon = isAndroid ? 'ion-android-favorite' : 'ion-ios-heart';
                    break;
                }
                case 'favoriteOff':
                {
                    icon = isAndroid ? 'ion-android-favorite-outline' : 'ion-ios-heart-outline';
                    break;
                }
                case 'location':
                {
                    icon = isAndroid ? 'ion-android-pin' : 'ion-ios-location';
                    break;
                }
                case 'map':
                {
                    icon = isAndroid ? 'ion-android-map' : 'ion-map';
                    break;
                }
                case 'save':
                {
                    icon = isAndroid ? 'ion-android-done' : 'ion-ios-checkmark-empty';
                    break;
                }
                case 'login':
                {
                    icon = isAndroid ? 'ion-log-in' : 'ion-log-in';
                    break;
                }
                case 'createAccount':
                {
                    icon = isAndroid ? 'ion-happy-outline' : 'ion-happy-outline';
                    break;
                }
                case 'checkmark':
                {
                    icon = isAndroid ? 'ion-android-checkmark-circle' : 'ion-ios-checkmark-outline';
                    break;
                }
                case 'whatsapp':
                {
                    icon = 'ion-social-whatsapp';
                    break;
                }
                case 'instagram':
                {
                    icon = 'ion-social-instagram';
                    break;
                }
                case 'twitter':
                {
                    icon = 'ion-social-twitter';
                    break;
                }
                case 'facebook':
                {
                    icon = 'ion-social-facebook';
                    break;
                }
                case 'email':
                {
                    icon = isAndroid ? 'ion-android-mail' : 'ion-ios-email';
                    break;
                }
                case 'phone':
                {
                    icon = isAndroid ? 'ion-android-call' : 'ion-ios-telephone';
                    break;
                }
                case 'close':
                {
                    icon = isAndroid ? 'ion-android-close' : 'ion-ios-close-empty';
                    break;
                }
                case 'search':
                {
                    icon = isAndroid ? 'ion-android-search' : 'ion-ios-search-strong';
                    break;
                }
                default:
                {
                    throw new Error("You dont set the config param or the given name icon (" + config.name + ") is not implemented yet");
                }
            }
            icon = icon + ' ' + config.animation;
            return icon;
        }

        functionObj.uniqueArray = function (collection, keyname) {
            var output = [], keys = [];
            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) == -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        }

        functionObj.getCategoriesFullName = function (parentCategoryName, customer) {
            var subs = parentCategoryName + ", " || "";
            if (customer.subCategories) {
                for (let i = 0; i < customer.subCategories.length; i++) {
                    subs += customer.subCategories[i].fullname + ", ";
                }
            }
            subs = subs.substr(0, subs.lastIndexOf(","));
            return subs;
        }

        functionObj.getCustomerCoverPhoto = function (config) {
            var coverPhotoURL = "";

            // from configs
            if (config.subCategory && config.subCategory.coverPhotoURL)
                coverPhotoURL = config.subCategory.coverPhotoURL;
            else if (config.parentCategory && config.parentCategory.coverPhotoURL) {
                coverPhotoURL = config.parentCategory.coverPhotoURL;

                // from category object itself
            } else if (config.coverPhotoURL) {
                coverPhotoURL = config.coverPhotoURL;
            }
            return coverPhotoURL;
        }

        return functionObj;
    }

    app.factory('Utils', ['$ionicLoading', '$ionicPopup', '$window', 'firebase', '$ionicPlatform', Utils]);
})();