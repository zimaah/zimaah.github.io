(function () {

    /*
     * ################# ESTRUTURA DAS DIRETIVAS ##########################
     * 
     * Diretiva spaceCrud = Pai de todas, fornece parâmetros através do seu escopo
     * <space-crud entity="user">
     * 
     *      Diretiva para listagem
            <space-crud-list></space-crud-list>
            
            Diretiva do form
            <space-crud-form></space-crud-form>
        </space-crud>
     */

    var app = angular.module('CrudModule', ['ngResource']);
    app.config(function ($stateProvider) {

        $stateProvider.state('crud', {
            url: '/crud',
            templateUrl: "js/crud/template/crud.html",
            controller: 'CrudController',
            resolve: {
                itens: function (UserFactory) {
                    return UserFactory.query();
                }
            }
        });
    });
    app.run(function () {
        console.log('Run módulo CrudModule');
    });
    
    /**
     * Factory para configurar o endpoint de persistência, podendo ser local ou no Web Service
     */
    app.factory('UserFactory', function ($resource) {
        console.log('Run módulo CrudModule 2');
        
        // Esse era meu backend em Nodejs (SailsJS framework) RESTful
        return $resource('http://localhost:1337/user');
    })
    
    /**
     * Factory que fornece as configurações de formulário para as diretivas de CRUD
     * O método 'público' getConfig retorna o método 'privado' _getConfig
     * 
     * 
     */
    app.factory('CrudConfigFactory', function () {

        // private attributes
        var _entities = {};
        var _userEntity = {
            entity: 'user',
            title: 'Vini Careca',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    title: 'Nome'
                },
                {
                    name: 'birthday',
                    type: 'date',
                    title: 'Data de Nascimento'
                },
                {
                    name: 'about',
                    type: 'string',
                    title: 'Sobre'
                },
                {
                    name: 'ridermeuamor',
                    type: 'string',
                    title: 'Fala minha Autarquia'
                },
                {
                    name: 'vinix',
                    type: 'string',
                    title: 'Vinix'
                },
                {
                    name: 'novo',
                    type: 'string',
                    title: 'ABOOOUTOUTOUTO'
                }
            ]
        }
        var _getConfig = function (entity) {
            return _entities[entity];
        }

        _entities.user = _userEntity;
        
        // public properties
        return {
            getConfig: _getConfig
        }
    });
    
    
    var spaceCrud = function (CrudConfigFactory, $compile, UserFactory) {
        // directive definition object
        return {
            restrict: "EA",
            scope: {
                entity: "@"
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                // this é o controller e não o $scope
                // através do this eu passo parâmetros da diretiva pai para a filha
                // Ex: spaceCrud tem o código this.getConfig = function{return CrudConfigFactory.getConfig($scope.entity);}
                // esse valor jogado no this.getConfig eu vou usar lá na diretiva spaceCrudForm, veja abaixo:
                // var entityConfig = $ctrl.getConfig();
                // sendo que o $ctrl injetado no link da spaceCrudForm é o this da spaceCrud
                
                this.teste = false;
                
                this.getConfig = function () {
                    return CrudConfigFactory.getConfig($scope.entity);
                }
                this.dataStateForm = true; // boolean para exibir a diretiva de formulário (
                this.dataStateList = false; // boolean para exibir a diretiva de listagem
                var values = [{id: 1, 'name': 'Guilherme 1'}, {id: 2, 'name': 'Guilherme 2'}];
                var itens = [];
                angular.forEach(values, function (item) {
                    itens.push(item);
                });
                this.itens = itens;


                $scope.save = function () {
                    UserFactory.save($scope.userrr, function (p) {
                        $scope.itens.push(p);
                    });
                }
                $scope.itens = [];
                $scope.user = new UserFactory();

                $scope.goBack = function () {
                    console.log('goBack');
                }

                // através do this eu passo para as diretivas filhas parâmetros que ficarão disponíveis na service $ctrl
                this.edit = function () {
                    console.log('edit');
                }
                this.insert = function () {
                    console.log('insert');
                }
                this.remove = function (item) {
                    console.log('removeee');
                    console.log(item);
                }
            },
            link: function (scope, element, attrs) {

            }
        }
    }

    var spaceCrudList = function ($compile) {
        // directive definition object
        return {
            restrict: "AE",
            scope: false,
            require: "^spaceCrud",
            link: function ($scope, $element, $attrs, $ctrl) {
                if ($ctrl.dataStateList) {
                    $scope.itens = $ctrl.itens;
                    $scope.remove = function(item){
                        $ctrl.remove(item);
                    }

                    var html = "";
                    html += '<div class="list" ng-repeat="item in itens">';
                    html += '<div class="row responsive-sm">';
                    html += '<div class="col col-90" ng-click="edit(item)">';
                    html += '<a class="item item-thumbnail-left item-text-wrap">';
                    html += '<h2>{{item.name}} </h2>';
                    html += '<p>E-mail: {{item.name}}</p>';
                    html += '</a>';
                    html += '</div>';
                    html += '<div class="col col-10">';
                    html += '<button class="button button-assertive button-block" ng-click="remove(item)">';
                    html += '<i class="icon ion-ios-trash"></i>';
                    html += '</button>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    $element.unbind();
                    $element.html(html);
                    $compile($element.contents())($scope);
                }

            }
        }
    }

    var spaceCrudForm = function (CrudConfigFactory, $compile) {
        return {
            restrict: "AE",
            scope: false,
            require: "^spaceCrud",
            link: function ($scope, $element, $attrs, $ctrl) {
                if ($ctrl.dataStateForm) {
                    console.log('oii');
                    var entityConfig = $ctrl.getConfig();
                    var entity = entityConfig.entity;
                    var fields = entityConfig.fields;
                    var html = "";
                    html += "<h1>" + entityConfig.title + "</h1>";
                    html += "<form>";
                    html += '<div class="list">';
                    angular.forEach(fields, function (field) {
                        html += "<label class='item item-input item-stacked-label'>";
                        html += '<span class="input-label"><b>' + field.title + '</b></span>';
                        html += '<input type="' + field.type + '" ng-model="' + entity + '.' + field.name + '" id="fullname">';
                        html += '</label>';
                    });
                    html += '<div class="list">';
                    html += '<button class="button button-block" ng-click=save()> SALVAR </button>';
                    html += "</form>";
                    
                    $element.unbind();
                    $element.html(html);
                    $compile($element.contents())($scope);
                } else {
                    console.log('oii tchau');
                }
            }
        }
    }

    app.directive('spaceCrud', spaceCrud);
    app.directive('spaceCrudList', spaceCrudList);
    app.directive('spaceCrudForm', spaceCrudForm);
})();