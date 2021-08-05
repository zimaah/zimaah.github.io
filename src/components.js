export class CardComponent extends HTMLElement {

    constructor(){
        super();
    }

    connectedCallback(){
        this.render();

        window.cheers = function() {
            const cheers = document.getElementById("cheers");
            cheers.className = cheers.className.replace("animate__animated animate__headShake", "");
            
            const timeout = setTimeout(() => {
                cheers.className = "animate__animated animate__headShake";
                clearTimeout(timeout);
            }, 100);
        }
    }

    render(){
        this.innerHTML = `
        <style scoped>
            body {
                background: rgba(0,0,0,0.75);
                color: lime;

                --animate-duration: 1.2s;
            }

            .zimaah-card-component {
                display: flex;
                flex-flow: column;
                align-items: center;
            }

            .zimaah-card-component p {
                font-family: monospace;
                font-size: 1.5em;
                padding: 5px;
            }

            .zimaah-card-component a {
                color: lime;
                font-size: 0.7em;
                font-weight: 900;
            }

            #cheers {
                font-size: 2.5em;
                cursor: pointer;
            }
        </style>
            <div class="zimaah-card-component">
                <p>
                    Soon, some interesting content will show up here.
                </p>
                <p>
                    Meanwhile... cheers! <div id="cheers" onclick="cheers()" class="animate__animated animate__headShake">🍻</div>
                </p>
                <p>
                    <a href="https://www.linkedin.com/in/guilhermezima/" target="_blank">Keep in touch!</a>
                </p>
            </div>
        `;
    }
}