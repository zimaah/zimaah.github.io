(function () {

    let newCustomerImageController = function ($scope, Utils, CustomerService, UploadService, subCategories) {
        Utils.hideLoading();
        $scope.customer = $scope.$parent.customer;
        $scope.subCategories = subCategories;
        $scope.customer.subCategories = [];
        
        $scope.visibleUploadLogoContainer = Utils.isEmpty($scope.customer.logoURL) ? true : false;
        $scope.visibleUploadCapaContainer = Utils.isEmpty($scope.customer.capaURL) ? true : false;
        
        // UPLOAD LOGO
        $scope.downloadLogoURL = $scope.customer.logoURL;
        $scope.downloadCapaURL = $scope.customer.capaURL;
        
        $scope.fireUploadEvent = function (inputId) {
            $('#' + inputId).trigger('click');
        }
        var optionsUploadFileCapa = CustomerService.getConfigUploadLogo(null);
        UploadService.doUpload(optionsUploadFileCapa);

        $scope.removeFileLogo = function (downloadURL) {
            Utils.showLoading();
            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFileLogo = CustomerService.getConfigRemoveLogo(fileName);
            UploadService.deleteFile(optionsDeleteFileLogo);
        }

        // UPLOAD FOTO CAPA
        $scope.fireUploadEvent = function (inputId) {
            $('#' + inputId).trigger('click');
        }
        var optionsUploadFileCapa = CustomerService.getConfigUploadCapa();
        UploadService.doUpload(optionsUploadFileCapa);
        $scope.removeFile = function (downloadURL) {
            Utils.showLoading();
            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFileCapa = UploadService.getConfigRemoveCapa(fileName);

            UploadService.deleteFile(optionsDeleteFileCapa);
        }
        
        $scope.addRemSubCategory = function(categoryChecked){
            $scope.$parent.addRemSubCategory({
                'categoryChecked': categoryChecked,
                'scope': $scope
            });
        }
    }

    let app = angular.module('starter');

    app.controller('NewCustomerImageCtrl', newCustomerImageController);

})();