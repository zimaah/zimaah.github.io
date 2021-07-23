export class CardComponent extends HTMLElement {

    constructor(){
        super();
    }

    connectedCallback(){
        this.render();
    }

    render(){
        this.innerHTML = "<p>This is a card component!</p>";
    }
}