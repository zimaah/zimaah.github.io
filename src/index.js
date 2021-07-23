import * as Components from './components.js';
console.log(Components);

/**
 * We need to register our custom elements before start using them.
 */
 (function(){
     console.log(window);
     window.customElements.define('zimaah-card', Components.CardComponent);
})();

document.getElementById("root").innerHTML = "<zimaah-card></zimaah-card>";