import * as Components from './components.js';

/**
 * We need to register our custom elements before start using them.
 */
 (function(){
     window.customElements.define('zimaah-card', Components.CardComponent);
})();

document.getElementById("root").innerHTML = "<zimaah-card></zimaah-card>";