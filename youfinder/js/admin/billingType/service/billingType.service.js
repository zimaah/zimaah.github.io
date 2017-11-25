(function () {
    var app = angular.module('starter');
    var billingTypeService = function (firebaseData, Utils, $firebaseArray, RouteService) {

        var that = this;

        /**
         * Array of BillingType
         */
        that.billingTypes = $firebaseArray(firebaseData.refBillingType());

        /**
         * 
         * @param object config {bean: billingType, callbackSuccess: function, callbackError: function}
         * @returns {undefined}
         */
        this.save = function (config) {

            that.clearMaskCurrency(config.billingType);

            // new
            if (!config.billingType.$id) {
                that.billingTypes.$add(config.billingType).then(function () {
                    Utils.hideLoading();

                    if (Utils.isFunction(config.callbackSuccess)) {
                        config.callbackSuccess();
                    } else {
                        Utils.showAlertCallback('Sucesso', 'Tipo de Faturamento adicionado com sucesso!', function () {
                            RouteService.goAdminListBillingType();
                        });

                    }
                });

                // update
            } else {
                that.billingTypes.$loaded(function () {
                    let index = that.getBillingTypeIndex(config.billingType);
                    that.billingTypes[index] = config.billingType;
                    that.billingTypes.$save(index).then(function () {
                        Utils.hideLoading();
                        
                        if (Utils.isFunction(config.callbackSuccess)) {
                            config.callbackSuccess();
                        } else {
                            Utils.showAlertCallback('Sucesso', 'Tipo de Faturamento atualizado com sucesso!', function () {
                                RouteService.goAdminListBillingType();
                            });
                        }
                    });
                })
            }
        }

        this.getBillingTypeIndex = function (billingType) {
            var index = that.billingTypes.$indexFor(billingType.$id);
            return index;
        }

        this.getAll = function () {
            return that.billingTypes;
        }
        
        this.clearMaskCurrency = function(billingType){
            billingType.mensalPrice = billingType.mensalPrice ? billingType.mensalPrice.replace("R$ ", "") : null;
            billingType.mensalPrice3 = billingType.mensalPrice3 ? billingType.mensalPrice3.replace("R$ ", "") : null;
            billingType.mensalPrice6 = billingType.mensalPrice6 ? billingType.mensalPrice6.replace("R$ ", "") : null;
            billingType.mensalPrice12 = billingType.mensalPrice12 ? billingType.mensalPrice12.replace("R$ ", "") : null;
        }

        this.remove = function (billingType) {
            Utils.showConfirm('Atenção', 'Tem certeza que deseja remover esse tipo de faturamento?', function () {
                
                that.billingTypes.$remove(billingType).then(function () {
                    Utils.showAlert('Sucesso', 'Tipo de Faturamento removido com sucesso!');
                }).catch(function(err){
                    console.log(err);
                });
                
            });


        }
    }

    app.service('BillingTypeService', billingTypeService);
})();