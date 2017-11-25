(function () {
    var app = angular.module('starter');
    var firebaseManager = function (firebase, $firebaseArray, Utils, $firebaseObject) {

        /**
         * config: {
         *      ref: firebaseRef,
         *      bean: object,
         *      callbackSuccess: function
         *      callbackFail: function
         * }
         */
        var _dao = {
            
            /**
             * Retorna uma lista de beans especificado no atributo ref do parâmetro config.
             * 
             * @param object config
             * @returns $firebaseArray
             */
            list: function (config) {
                var firebaseArrayBean = $firebaseArray(config.ref);
                
                if (!Utils.isEmpty(config.where)) {
                    var where = config.where[0];
                    
                    // restriction byId
                    if (where.type === 'byId') {
                        firebaseArrayBean = $firebaseArray(config.ref.child(where.value));
                    } else if (where.type === 'orderByChild') {
                        firebaseArrayBean = $firebaseArray(config.ref);
                    }
                }
                return firebaseArrayBean;
            },
            
            get: function(config){
                var firebaseObjectBean = $firebaseObject(config.ref);
                return firebaseObjectBean;
            },

            insert: function (config) {
                var firebaseArrayBean = $firebaseArray(config.ref);
                firebaseArrayBean.$add(config.bean).then(function () {
                    if (Utils.isFunction(config.callbackSuccess)) {
                        config.callbackSuccess();
                    } else {
                        console.log('FAILURE!!! FirebaseManager.DAO.insert ', config);
                    }
                });
            },

            update: function (config) {
            },

            remove: function (config) {
                var firebaseArrayBean = $firebaseArray(config.ref);
                firebaseArrayBean.$loaded().then(function () {
                    var index = firebaseArrayBean.$indexFor(config.bean.$id);
                    var myBean = firebaseArrayBean[index];
                    
                    firebaseArrayBean.$remove(myBean).then(function (ref) {
                        if (Utils.isFunction(config.callbackSuccess)) {
                            config.callbackSuccess();
                        }
                    })
                    
                })
            }
        }

        var _refs = {
            neighborhoodByCity: function (cityId) {
                var neighborhoods = firebase.database().ref('cities').child(cityId).child('neighborhoods');
                return neighborhoods;
            },
            neighborhoodById: function (cityId, neighborhoodId) {
                var neighborhood = firebase.database().ref('cities').child(cityId).child(neighborhoodId);
                return neighborhood;
            }
        };

        return {
            REFERENCES: _refs,
            DAO: _dao
        };
    }

    app.factory('FirebaseManager', firebaseManager);
})();