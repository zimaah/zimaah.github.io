(function () {

    var app = angular.module('starter');
    var routeService = function ($state, TYPE_USER, TYPE_CUSTOMER, TYPE_ADMIN, Utils) {

        this.goHome = function (user) {
            var state = 'login';
            user = user ? user : Utils.getLocalStorage('userRoot');

            switch (user.type) {
                case TYPE_USER:
                {
                    state = 'app.home';
                    break;
                }

                case TYPE_CUSTOMER:
                {
                    state = 'app.homecustomer';
                    break;
                }

                case TYPE_ADMIN:
                {
                    state = 'adminmenu.home';
                    break;
                }
            }
            $state.go(state, user);
        }

        this.goLogin = function (params) {
            $state.go('login');
        }

        this.goCreateAccount = function (params) {
            $state.go('formCreateAccount');
        }

        this.goAdminCreateCustomer = function (params) {
            $state.go('tabscustomer.novocliente', {}, {reload: true});
//            $state.go('createaccountcustomer');
        }

        this.goAdminCreateCustomerData = function (params) {
            $state.go('tabscustomer.novocliente', {}, {reload: true});
        }

        this.goAdminEditCustomer = function (customer) {
            return $state.go('tabscustomeredit.editarcliente', {customer: customer}, {reload: true});
        }

        this.goAdminListCustomers = function ($scope) {
            if (!Utils.isEmpty($scope)) {
                $scope.customer = {}; // limpar ao sair...
            }

            $state.go('listagemcliente');
        }

        this.goAdminCreateCategory = function (params) {
            $state.go('novacategoria');
        }

        this.goAdminEditCategory = function (category) {
            return $state.go('editarcategoria', {category: category});
        }

        this.goAdminListCategories = function () {
            $state.go('listagemcategoria');
        }

        this.goAdminCreateCity = function (params) {
            $state.go('novacidade');
        }

        this.goAdminEditCity = function (city) {
            return $state.go('editarcidade', {city: city});
        }

        this.goAdminListCities = function () {
            $state.go('listagemcidade');
        }

        this.goCustomerProfile = function (customer) {
            $state.go('perfilcomercio', {customer: customer});
        }

        /**
         * config = {
         *      category: {},
         *      isFromCategories: boolean,
         *      isFromSubCategories: boolean
         *      customersByParentCategory: {}
         * }
         * 
         * @param {type} config
         * @returns {undefined}
         */
        this.goCustomerByCategory = function (config) {
            // param, isFromCategories, customersByParentCategory
            $state.go('customerbycategory', {'config': config});
        }

        this.goCustomerByCategoryFilter = function (config) {
            $state.go('customerbycategoryfilter', {'config': config});
        }

        this.goCustomerDetail = function (customer, configs) {
            $state.go('customerdetail.sobre', {'customer': customer, 'configs': configs});
        }

        this.goResetPasswordEmail = function () {
            $state.go('resetpassword');
        }

        this.goProfile = function (config) {
            var state = 'app.home';
            var param = {};
            var user = config ? config.userRoot : Utils.getLocalStorage('userRoot');

            switch (user.type) {
                case TYPE_CUSTOMER:
                {
                    state = 'tabscustomereditprofile.editarclienteprofile';
                    param = {"customer": user};
                    break;
                }

                case TYPE_USER:
                {
                    state = 'userprofile';
                    param = {"user": user};
                    break;
                }

                case TYPE_ADMIN:
                {
                    state = 'adminmenu.home';
                    param = {"admin": user};
                }
            }
            
            console.log(param);
            $state.go(state, param);
        }

        this.goToState = function (config) {
            console.log(config);
            if (Utils.isEmpty(config.param)) {
                $state.go(config.state);
            } else {
                $state.go(config.state, config.param);
            }

        }

        this.goChooseCity = function () {
            $state.go('choosecity');
        }

        this.goTour = function () {
            $state.go('tour');
        }

        this.goCustomerArea = function () {
            $state.go('customerarea');
        }

        this.goFilterCustomer = function (config) {
            $state.go('filtercustomer', {'config': config});
        }

        this.goFavoriteDetail = function (customer) {
            $state.go('customerfavoriteview.sobre', {customer: customer});
        }

        this.goFavorites = function () {
            $state.go('favorites');
        }

        this.goCategories = function () {
            $state.go('categories');
        }
        
        this.goSubCategories = function(config){
            $state.go('subCategories', {'config': config});
        }
        
        this.goLoginForm = function(){
            $state.go('loginForm');
        }
        
        this.goSearch = function(config){
            $state.go('search', {'config': config});
        }
        
        this.goAdminListBillingType = function(){
            $state.go('billingType');
        }
        
        this.goAdminCreateBillingType = function(){
            $state.go('billingTypeNew');
        }
        
        this.goAdminEditBillingType = function(config){
            $state.go('billingTypeEdit', {config: config});
        }
    }

    app.service('RouteService', routeService);

})();

