(function () {
    var app = angular.module('TourModule');
    var tourService = function () {

        this.getUserTour = function () {
            var slidesUser = [
                {
                    src: "img/trophy_2.svg",
                    message: "Bem-vindo ao YouFinder, o app que veio deixar seu dia-a-dia na cidade ainda mais fácil",
                    myFunction: "goTo2()",
                    text: "Continuar..."
                },
                {
                    src: "img/swiss-army-knife.svg",
                    message: "Gastronomia, produtos e serviços, turismo, informações úteis e atualizadas, cupons de desconto, pedidos online... Somos um verdadeiro canivete-suiço!",
                    myFunction: "goTo3()",
                    text: "Ok, entendi"
                },
                {
                    src: "img/deal.svg",
                    message: "Queremos construir uma parceria positiva com empresas e usuários, por isso você é tão importante. Caso tenha alguma dúvida, crítica ou sugestão entre em contato com nosso suporte, estamos sempre prontos para lhe atender!",
                    myFunction: "goHome()",
                    text: "VAMOS COMEÇAR!"
                }
            ];

            return slidesUser;
        }

        this.getCustomerTour = function () {
            var slidesCustomer = [
                {
                    src: "img/trophy.svg",
                    message: "Bem-vindo ao YouFinder, o aplicativo que veio lhe ajudar a expandir os seus negócios. As melhores empresas e serviços estão aqui!",
                    myFunction: "goTo2()",
                    text: "Continuar"
                },
                {
                    src: "img/graph.svg",
                    message: "Nosso objetivo nº 1 é atrair mais clientes e aumentar seu faturamento.",
                    myFunction: "goTo3()",
                    text: "Ok, entendi"
                },
                {
                    src: "img/handshake.svg",
                    message: "Queremos construir um relacionamento baseado na confiança e ajuda mútua. Fique sempre à vontade para solicitar nosso suporte, enviar suas dúvidas e críticas.",
                    myFunction: "goHome()",
                    text: "VAMOS COMEÇAR!"
                }
            ];
            
            return slidesCustomer;
        }
    }
    
    app.service('TourService', tourService);
})();