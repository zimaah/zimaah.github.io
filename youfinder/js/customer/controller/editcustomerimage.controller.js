(function () {

    let editCustomerImageController = function ($scope, Utils, CustomerService, UploadService, customer) {
        Utils.hideLoading();
        
        // add: 17/07/2017
        $scope.customer = customer;
        
        $scope.visibleUploadLogoContainer = Utils.isEmpty($scope.customer.logoURL) ? true : false;
        $scope.visibleUploadCapaContainer = Utils.isEmpty($scope.customer.capaURL) ? true : false;
        
        // UPLOAD LOGO
        $scope.downloadLogoURL = $scope.customer.logoURL;
        $scope.downloadCapaURL = $scope.customer.capaURL;
        
        $scope.fireUploadEvent = function (inputId) {
            $('#' + inputId).trigger('click');
        }
        var optionsUploadFileCapa = CustomerService.getConfigUploadLogo(customer);
        UploadService.doUpload(optionsUploadFileCapa);

        $scope.removeFileLogo = function (downloadURL) {
            Utils.showLoading();
            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFileLogo = CustomerService.getConfigRemoveLogo(fileName, customer);
            UploadService.deleteFile(optionsDeleteFileLogo);
        }

        // UPLOAD FOTO CAPA
        $scope.fireUploadEvent = function (inputId) {
            $('#' + inputId).trigger('click');
        }
        var optionsUploadFileCapa = CustomerService.getConfigUploadCapa(customer);
        UploadService.doUpload(optionsUploadFileCapa);
        $scope.removeFile = function (downloadURL) {
            Utils.showLoading();
            var fileName = UploadService.extractFileNamefromDownloadURL(downloadURL);
            var optionsDeleteFileCapa = CustomerService.getConfigRemoveCapa(fileName, customer);

            UploadService.deleteFile(optionsDeleteFileCapa);
        }
    }

    let app = angular.module('starter');

    app.controller('EditCustomerProfileImageCtrl', editCustomerImageController);

})();