(function () {
    var app = angular.module('starter');
    var uiAnimationProvider = function () {

        // private properties
        var _uiAnimationType = 'animate-blinds';
        var _reset = function (divListClass) {
            var inClass = document.querySelectorAll('.in');
            for (var i = 0; i < inClass.length; i++) {
                inClass[i].classList.remove('in');
                inClass[i].removeAttribute('style');
            }
            var done = document.querySelectorAll('.done');
            for (var i = 0; i < done.length; i++) {
                done[i].classList.remove('done');
                done[i].removeAttribute('style');
            }

            var ionList = document.getElementsByClassName(divListClass);
            for (var i = 0; i < ionList.length; i++) {
                var toRemove = ionList[i].className;
                if (/animate-/.test(toRemove)) {
                    ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
                }
            }
        }

        return {
            setUIAnimationType: function (type) {
                _uiAnimationType = type;
            },

            // the service itself
            $get: function (ionicMaterialMotion, ionicMaterialInk, $timeout) {

                return {
                    /**
                     * config: {
                     *  classSelector: 'my-selector',
                     *  animateType: 'animate-ripple',
                     *  timeoutEffect: 200 //ms
                     * }
                     * 
                     */
                    applyUIAnimation: function (config) {
                        config.classSelector = config.classSelector ? config.classSelector : '';
                        config.animateType = config.animateType ? config.animateType : 'animate-blinds';
                        config.timeoutEffect = config.timeoutEffect ? config.timeoutEffect : 250; // miliseconds

                        // clear DOM by classSelector
                        _reset(config.classSelector);

                        var divs = document.getElementsByClassName(config.classSelector);
                        angular.forEach(divs, function (input, key) {
                            input.className += ' ' + config.animateType;
                        })

                        $timeout(function () {
                            var classSelector = '.' + config.classSelector;
                            switch (config.animateType) {
                                case 'animate-blinds':
                                    ionicMaterialMotion.blinds({options: {selector: classSelector}});
                                    break;
                                case 'animate-ripple':
                                    ionicMaterialMotion.ripple({options: {selector: classSelector}});
                                    break;
                                case 'animate-fade-slide-in-right':
                                    ionicMaterialMotion.fadeSlideInRight({options: {selector: classSelector}});
                                    break;
                                case 'animate-fade-slide-in':
                                    ionicMaterialMotion.fadeSlideIn({options: {selector: classSelector}});
                                    break;
                                default:
                                    ionicMaterialMotion.ripple({options: {selector: classSelector}});
                                    break;
                            }
                            //ionicMaterialMotion.ripple();
                        }, config.timeoutEffect);

                        ionicMaterialInk.displayEffect();
                    },

                    getUIAnimationType: function () {
                        return _uiAnimationType;
                    },

                    applyButtonAnimation: function (buttonElement, direction, type) {
                        direction = direction ? direction : 'bottom-right';
                        type = type ? type : 'motion';

                        buttonElement.style.display = 'none';
                        buttonElement.className = buttonElement.className.replace('button-buttonElement-top-left', '');
                        buttonElement.className = buttonElement.className.replace('button-buttonElement-top-right', '');
                        buttonElement.className = buttonElement.className.replace('button-buttonElement-bottom-left', '');
                        buttonElement.className = buttonElement.className.replace('button-buttonElement-bottom-right', '');
                        buttonElement.className += ' button-buttonElement-' + direction;
                        $timeout(function () {
                            buttonElement.style.display = 'block';
                        }, 100);

                        var shouldAnimate = false;
                        var classes = type instanceof Array ? type : [type];
                        for (var i = 0; i < classes.length; i++) {
                            buttonElement.classList.toggle(classes[i]);
                            shouldAnimate = buttonElement.classList.contains(classes[i]);
                            if (shouldAnimate) {
                                (function (theClass) {
                                    $timeout(function () {
                                        buttonElement.classList.toggle(theClass);
                                    }, 300);
                                })(classes[i]);
                            }
                        }
                    }
                }
            }
        }

    }

    app.provider('UIAnimationService', uiAnimationProvider);
})();