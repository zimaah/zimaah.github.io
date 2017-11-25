(function () {

    var app = angular.module('starter');
    var uploadService = function (Utils, $firebaseArray, $timeout) {
        // acessando a outer closure na inner closure
        var that = this;

        /**
         * Adiciona o listener de upload (event 'change') no input file.
         * 
         * @param {string} inputFileID nome do input file HTML
         * @returns {undefined}
         */
        this.doUpload = function (options) {

            ionic.DomUtil.ready(function () {
                var inputUpload = document.getElementById(options.inputFileId);
                var uploadDOMListener = function () {

                    if (!Utils.isEmpty(this.files[0])) {
                        Utils.showLoading('Enviando arquivo...');

                        console.log(this.files[0].name);
                        var file = this.files[0];

                        var d = new Date();
                        var fileName = hex_md5(this.files[0].name + d.getTime().toString());

                        // referência ao path final no Firebase Storage
                        var myFileRef = options.refStorage.child(fileName);

                        // enviar o arquivo para o Firebase Storage e retorna um uploadTask pra monitorar o status
                        var uploadTask = myFileRef.put(file);

                        // add listener ao uploadTask
                        uploadTask.on('state_changed', function (snapshot) {
                            uploadStateChaged(snapshot);
                        },
                                function (error) {
                                    uploadError();
                                },
                                function () {
                                    uploadSuccess(uploadTask, options);
                                });
                    }

                }

                inputUpload.addEventListener('change', uploadDOMListener);
            });

        }

        // listener stateChage
        var uploadStateChaged = function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var progressBar = document.getElementById('progressupload');
            if (progressBar)
                value = Math.round(progress, 2);
        }

        // listener Success
        var uploadSuccess = function (uploadTask, options) {
            console.log(options);
            Utils.hideLoading();
            Utils.showAlert('Arquivo enviado com sucesso!');

            var snapshot = uploadTask.snapshot;
            var downloadURL = snapshot.downloadURL;
            console.log('URL Download: ' + downloadURL);

            var ref = snapshot.ref;
            // setting cache-control
            ref.updateMetadata({
                cacheControl: '30000'
            }).catch(function (error) {
                console.log(error);
            });

//            var scope = angular.element(document.querySelector('#' + options.inputFileId)).scope();
            console.log(options.scope);
            var scope = options.scope || angular.element(document.querySelector('#' + options.inputFileId)).scope();

            $timeout(function () {
                scope.$apply(function () {
                    scope[options.scopeVarDownloadURL] = downloadURL;
                    scope[options.scopeVarVisibleUpload] = false;
                });
            })


            that.saveDownloadURLtoDatabase(options.persist, downloadURL);
        }

        // listener Error
        var uploadError = function () {

        }

        this.deleteFile = function (options) {
            console.log(options);

            options.refStorage.child(options.fileName).delete().then(function () {
                Utils.hideLoading();

                // remove do bean a referência (URL) ao arquivo
                console.log('options');
                console.log(options);
                that.removeDownloadURLfromDatabase(options.persist);

                if (Utils.isFunction(options.callbackSuccess)) {
                    options.callbackSuccess();
                }

                console.log(options.scope);
                var scope = options.scope || angular.element(document.querySelector('#' + options.inputFileId)).scope();
                $timeout(function () {
                    scope.$apply(function () {
                        scope[options.scopeVarDownloadURL] = '';
                        scope[options.scopeVarVisibleUpload] = true;
                    });
                });

            }).catch(function (error) {
                console.log(error);
            })
        }

        this.extractFileNamefromDownloadURL = function (downloadURL) {
            var arrayURL = downloadURL.split('%2F');
            var fileNameString = arrayURL.slice(-1).pop();

            var arrayFileName = fileNameString.split('?');
            var fileName = arrayFileName[0];
            return fileName;
        }

        /*
         * options {
         *  downloadURL, // valor do campo
         *  attributeName, // nome do campo
         *  firebaseRef, // referência ao node
         *  firebaseBean // o bean que está sendo alterado
         * }
         * 
         * @param {type} downloadURL
         * @param {type} attribute
         * @returns {undefined}
         */
        this.saveDownloadURLtoDatabase = function (options, downloadURL) {
            Utils.setSessionStorage(options.fullAttributeName, downloadURL);
        }

        that.removeDownloadURLfromDatabase = function (options) {
            var ref = options.firebaseRef;
            var beans = $firebaseArray(ref);
            var bean = options.firebaseBean;
            bean[options.attributeName] = null;

            // edição: remove o atributo do bean
            if (bean.$id) {

                beans.$loaded().then(function () {
                    var index = beans.$indexFor(bean.$id);
                    beans[index] = bean;

                    console.log('bean');
                    console.log(bean);

                    beans.$save(bean).then(function (ref) {
                    });
                });
            } else {

                // novo: remove a URL da session
                Utils.setSessionStorage(options.fullAttributeName, null);
            }
        }
    }

    app.service('UploadService', uploadService);

})();

