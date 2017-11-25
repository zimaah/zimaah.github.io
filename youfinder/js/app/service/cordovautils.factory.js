(function () {
    var app = angular.module('starter');
    var cordovaUtils = function ($cordovaEmailComposer, $cordovaInAppBrowser) {

        var _openEmailApp = function (config) {
            ionic.Platform.ready(function () {
                $cordovaEmailComposer.isAvailable().then(function () {
                    var email = {
                        to: config.email || 'zimaah@gmail.com',
                        subject: config.subject || 'Contato via YouFinder',
                        body: config.body || 'Achei o seu perfil no YouFinder!',
                        isHtml: true
                    }
                    $cordovaEmailComposer.open(email);
                })
            });
        }

        var _openTwitter = function (config) {
            ionic.Platform.ready(function () {
                var twitterURL = 'https://www.twitter.com/' + config.twitter;
                $cordovaInAppBrowser.open(twitterURL, '_system').then(function (event) {
                    console.log('abriu link');
                    console.log(event);
                }).catch(function (event) {
                    console.log('error link');
                    console.log(event);
                });
            })
        }
        
        var _openFacebook = function (config) {
            ionic.Platform.ready(function () {
                var facebookURL = 'https://www.facebook.com/' + config.facebook;
                $cordovaInAppBrowser.open(facebookURL, '_system').then(function (event) {
                    console.log('abriu link');
                    console.log(event);
                }).catch(function (event) {
                    console.log('error link');
                    console.log(event);
                });
            })
        }
        var _openInstagram = function (config) {
            ionic.Platform.ready(function () {
                var instagramURL = 'https://www.instagram.com/' + config.instagram;
                $cordovaInAppBrowser.open(instagramURL, '_system').then(function (event) {
                    console.log('abriu link');
                    console.log(event);
                }).catch(function (event) {
                    console.log('error link');
                    console.log(event);
                });
            })
        }
        

        return {
            email: {
                openApp: _openEmailApp
            },
            
            social: {
                openTwitter: _openTwitter,
                openFacebook: _openFacebook,
                openInstagram: _openInstagram
            }
        }
    }

    app.factory('CordovaUtils', cordovaUtils);
})();