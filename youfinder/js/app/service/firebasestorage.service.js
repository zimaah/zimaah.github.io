angular.module('starter').factory('firebaseStorage', function (firebase) {
    var refLogo = firebase.storage().ref().child('logos');
    var refCategoryIcon = firebase.storage().ref().child('category/icon');
    var refUserPhoto = firebase.storage().ref().child('user-photos');

    return {
        refLogo: function () {
            return refLogo;
        },
        refCategoryIcon: function () {
            return refCategoryIcon;
        },
        refUserPhoto: function(){
            return refUserPhoto;
        }
    }
})