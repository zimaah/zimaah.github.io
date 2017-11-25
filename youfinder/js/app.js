// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ionic-material', 'firebase', 'CrudModule', 'ChatModule', 'MapsModule', 'TourModule', 'ngMask', 'ionicImgCache', 'checklist-model'])

        // constants para definir os tipos de usuários (comércio, usuário comum e admin)
        .constant('TYPE_CUSTOMER', 1)
        .constant('TYPE_USER', 2)
        .constant('TYPE_ADMIN', 3)

        .run(function ($ionicPlatform, firebase, $rootScope) {
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                Pyze.postPageView("PageTitle", "Page URL");
            });

            var connectedRef = firebase.database().ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    console.log("We are online!");
                } else {
                    console.log("We are disconnected :(");
                }
            });

            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
