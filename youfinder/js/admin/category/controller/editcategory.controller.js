(function () {
    var app = angular.module('starter');
    var editCategoryController = function ($scope, CategoryService, RouteService, category, Utils, UploadService, categories) {
        Utils.hideLoading();
        $scope.categories = categories;

        // F5 volta para listagem
        if (Utils.isObjectEmpty(category)) {
            RouteService.goAdminListCategories();
        }

        $scope.category = category;
        $scope.downloadIconURL = category.iconURL;
        $scope.downloadCoverPhotoURL = category.coverPhotoURL;

        // controle de visibilidade do botão de upload e remoção do arquivo
        $scope.visibleUploadContainer = Utils.isEmpty(category.iconURL);
        $scope.visibleUploadContainerCoverPhoto = Utils.isEmpty(category.coverPhotoURL);


        $scope.fireUploadEvent = function (inputId) {
            inputId = inputId ? inputId : 'uploadicon';
            $('#' + inputId).trigger('click');
        }
        
        /**
         * ICON
         */
        $scope.removeFile = function (downloadURL) {
            Utils.showLoading();

            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFile = CategoryService.getConfigRemoveIcon({
                firebaseBean: category,
                fileName: fileName
            });

            UploadService.deleteFile(optionsDeleteFile);
        }

        var optionsUploadFile = CategoryService.getConfigUploadIcon({
            firebaseBean: category
        });
        UploadService.doUpload(optionsUploadFile);
        
        /**
         * COVER PHOTO
         */
        $scope.removeCoverPhoto = function (downloadURL) {
            Utils.showLoading();

            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteCoverPhoto = CategoryService.getConfigRemoveCoverPhoto({
                firebaseBean: category,
                fileName: fileName
            });

            UploadService.deleteFile(optionsDeleteCoverPhoto);
        }
        var optionsUploadFile = CategoryService.getConfigUploadCoverPhoto({
            firebaseBean: category
        });
        UploadService.doUpload(optionsUploadFile);


        // navegação entre telas
        $scope.goHome = function () {
            RouteService.goHomeAdmin();
        }

        $scope.doClickSaveCategory = function (category) {
            Utils.showLoading();
            CategoryService.saveNewCategory(category);
        }

        $scope.goAdminListCategories = function () {
            RouteService.goAdminListCategories();
        }
    }
    app.controller('EditCategoryController', editCategoryController);
})();