(function () {
    var app = angular.module('starter');
    var newCategoryController = function ($scope, Utils, RouteService, CategoryService, UploadService, categories) {
        Utils.hideLoading();
        $scope.categories = categories;
        $scope.category = {};
        $scope.downloadIconURL = {};
        $scope.downloadIconCoverPhotoURL = {};
        console.log($scope);

        // controle de visibilidade do botão de upload e remoção do arquivo
        $scope.visibleUploadContainer = true;
        $scope.visibleUploadContainerCoverPhoto = true;
        $scope.fireUploadEvent = function (inputId) {
            inputId = inputId ? inputId : 'uploadicon';
            $('#' + inputId).trigger('click');
        }

        /**
         * ICON
         */
        var optionsUploadFile = CategoryService.getConfigUploadIcon({
            firebaseBean: {},
            scope: $scope
        });
        UploadService.doUpload(optionsUploadFile);
        $scope.removeFile = function () {
            Utils.showLoading();
            console.log($scope);
            console.log($scope.downloadIconURL);
            var fileName = UploadService.extractFileNamefromDownloadURL($scope.downloadIconURL);
            var optionsDeleteFile = CategoryService.getConfigRemoveIcon({
                firebaseBean: {},
                fileName: fileName,
                scope: $scope
            });

            UploadService.deleteFile(optionsDeleteFile);
        }
        
        /**
         * COVER PHOTO
         */
        var optionsUploadCoverPhoto = CategoryService.getConfigUploadCoverPhoto({
            firebaseBean: {},
            scope: $scope
        });
        UploadService.doUpload(optionsUploadCoverPhoto);

        $scope.removeCoverPhoto = function () {
            Utils.showLoading();
            var fileName = UploadService.extractFileNamefromDownloadURL($scope.downloadCoverPhotoURL);
            var optionsDeleteCoverPhoto = CategoryService.getConfigRemoveCoverPhoto({
                firebaseBean: {},
                fileName: fileName,
                scope: $scope
            });

            UploadService.deleteFile(optionsDeleteCoverPhoto);
        }

        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHomeAdmin();
        }

        $scope.goAdminListCategories = function () {
            RouteService.goAdminListCategories();
        }

        $scope.doClickSaveCategory = function (category) {
            console.log(category);
            Utils.showLoading();
            CategoryService.saveNewCategory(category);
        }

    }

    app.controller('NewCategoryController', newCategoryController);
})();