(function () {
    var app = angular.module('starter');
    var categoryService = function (firebaseData, Utils, $firebaseArray, RouteService, $q, $firebaseObject, firebaseStorage) {

        var that = this;

        firebaseData.refCategory().on('child_changed', function (data) {
            console.log(data.key);
            console.log(data.val().fullname);
            console.log(data);
        });

        this.categories = $firebaseArray(firebaseData.refCategory());

        this.saveNewCategory = function (category) {

            if (Utils.isEmpty(category.iconURL)) {
                category.iconURL = Utils.getSessionStorage('category.iconURL');
                Utils.setSessionStorage('category.iconURL', null);
            }
            
            if (Utils.isEmpty(category.coverPhotoURL)) {
                category.coverPhotoURL = Utils.getSessionStorage('category.coverPhotoURL');
                Utils.setSessionStorage('category.coverPhotoURL', null);
            }

            if (category.$id) {
                that.update(category);
            } else {
                that.addNew(category);
            }
        }

        this.addNew = function (category) {
            var ref = firebaseData.refCategory();
            var categories = $firebaseArray(ref);

            category.super = category.super || false;

            categories.$add(category).then(function () {
                Utils.hideLoading();


                Utils.showAlertCallback('Sucesso', 'Categoria salva com sucesso!', function () {
                    console.log('Categoria adicionado...');
                    RouteService.goAdminListCategories();
                });
            })
        }

        this.update = function (category) {
            var ref = firebaseData.refCategory();
            var categories = $firebaseArray(ref);

            category.super = category.super || false;

            categories.$loaded().then(function () {
                var index = categories.$indexFor(category.$id);
                categories[index] = category;
                categories.$save(category).then(function () {
                    Utils.hideLoading();

                    Utils.showAlertCallback('Sucesso', 'Categoria atualizada com sucesso!', function () {
                        console.log('Categoria atualizado...');
                        RouteService.goAdminListCategories();
                    });
                });
            })
        }

        this.remove = function (categoryID, callbackSuccess) {
            var ref = firebaseData.refCategory();
            var categories = $firebaseArray(ref);

            categories.$loaded().then(function () {
                var index = categories.$indexFor(categoryID);
                var category = categories[index];

                categories.$remove(category).then(function (ref) {
                    if (Utils.isFunction(callbackSuccess)) {
                        callbackSuccess();
                    }
                })
            });
        }

        this.removeCategory = function (categoryID) {
            Utils.showConfirm('Atenção', 'Tem certeza que deseja remover essa categoria?', function () {
                that.remove(categoryID, function () {
                    Utils.showAlert('Categoria removida com sucesso!');
                });
            });
        }

        this.getAllCategories = function () {
            var ref = firebaseData.refCategory();
            var categories = $firebaseArray(ref);
            return categories;
        }

        this.getAllCategoriesHasCustomer = function () {
            var ref = firebaseData.refCustomerPerCategory();
//            var ref = firebaseData.refCategory();
            var categoriesPromise = $firebaseArray(ref);
            var promises = [];

            return categoriesPromise.$loaded().then(function (categories) {

                // promises dos Ids das categorias retornado para a próxima promise
                return categories;
            }).then(function (categories) {

                // forEach nos ids das categorias que vieram da promise anterior
                angular.forEach(categories, function (value, key) {
                    promises.push(that.getCategoryByIdPromise(value.$id));
                })

                // retornando o array de promises que busca o objeto da categoria
                return promises;
            }).then(function (promises) {
                var categories = [];

                // executar todas as promises na ordem correta
                return $q.all(promises).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        categories.push(value);
                    })

                    // retornando os objetos categoria após a promise ter executado
                    return categories;
                })

            });
        }

        this.getCategoryByIdPromise = function (categoryId) {
            var ref = firebaseData.refCategory().child(categoryId);
            var category = $firebaseObject(ref);
            return category;
        }

        this.getCategoryByCity = function (cidadeId) {
            var ref = firebaseData.refCustomerPerCategory().child();
        }

        this.getChildCategories = function (parentCategoryId) {
            return $firebaseArray(firebaseData.refCategory().orderByChild('super').equalTo(parentCategoryId));
        }

        this.getAllHomeCategories = function () {
            return $firebaseArray(firebaseData.refCategory().orderByChild('showHome').equalTo(true));
        }

        this.getParentCategories = function () {
            return $firebaseArray(firebaseData.refCategory().orderByChild('super').equalTo(false));
        }

        this.getConfigRemoveIcon = function (config) {
            var optionsDeleteFile = {
                fileName: config.fileName,
                scopeVarDownloadURL: 'downloadIconURL',
                scopeVarVisibleUpload: 'visibleUploadContainer',
                inputFileId: 'uploadicon',
                refStorage: firebaseStorage.refCategoryIcon(), // referência ao node no storage
                scope: config.scope,
                persist: {
                    firebaseRef: firebaseData.refCategory(), // referência ao node no banco
                    firebaseBean: config.firebaseBean, // o bean que está sendo alterado | null = NOVO
                    attributeName: 'iconURL', // nome do campo
                    fullAttributeName: 'category.iconURL'
                },
                callbackSuccess: function () {
                    Utils.showAlert('Arquivo ' + config.fileName + ' removido com sucesso!');
                },
                callbackError: {}
            }

            return optionsDeleteFile;
        }

        this.getConfigUploadIcon = function (config) {
            var optionsUploadFile = {
                refStorage: firebaseStorage.refCategoryIcon(),
                inputFileId: 'uploadicon',
                scopeVarDownloadURL: 'downloadIconURL',
                scopeVarVisibleUpload: 'visibleUploadContainer',
                scope: config.scope,
                persist: {
                    attributeName: 'iconURL', // nome do campo
                    firebaseRef: firebaseData.refCategory(), // referência ao node
                    firebaseBean: config.firebaseBean, // o bean que está sendo alterado | null = NOVO
                    fullAttributeName: 'category.iconURL'
                }
            }
            
            return optionsUploadFile;
        }
        
        this.getConfigRemoveCoverPhoto = function (config) {
            var optionsDeleteFile = {
                fileName: config.fileName,
                scopeVarDownloadURL: 'downloadCoverPhotoURL',
                scopeVarVisibleUpload: 'visibleUploadContainerCoverPhoto',
                inputFileId: 'uploadCoverPhoto',
                refStorage: firebaseStorage.refCategoryIcon(), // referência ao node no storage
                scope: config.scope,
                persist: {
                    firebaseRef: firebaseData.refCategory(), // referência ao node no banco
                    firebaseBean: config.firebaseBean, // o bean que está sendo alterado | null = NOVO
                    attributeName: 'coverPhotoURL', // nome do campo
                    fullAttributeName: 'category.coverPhotoURL'
                },
                callbackSuccess: function () {
                    Utils.showAlert('Arquivo ' + config.fileName + ' removido com sucesso!');
                },
                callbackError: {}
            }

            return optionsDeleteFile;
        }

        this.getConfigUploadCoverPhoto = function (config) {
            var optionsUploadFile = {
                refStorage: firebaseStorage.refCategoryIcon(),
                inputFileId: 'uploadCoverPhoto',
                scopeVarDownloadURL: 'downloadCoverPhotoURL',
                scopeVarVisibleUpload: 'visibleUploadContainerCoverPhoto',
                scope: config.scope,
                persist: {
                    attributeName: 'coverPhotoURL', // nome do campo
                    firebaseRef: firebaseData.refCategory(), // referência ao node
                    firebaseBean: config.firebaseBean, // o bean que está sendo alterado | null = NOVO
                    fullAttributeName: 'category.coverPhotoURL'
                }
            }
            
            return optionsUploadFile;
        }
    }

    app.service('CategoryService', categoryService);
})();