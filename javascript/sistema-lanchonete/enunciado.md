## Exercício: Sistema da Lanchonete

### use a biblioteca prompt-sync

Exemplo de código:
const prompt = require("prompt-sync")()

Você foi contratado para desenvolver um pequeno sistema em **JavaScript** para a famosa lanchonete **“Bug & Burger”**, um lugar muito frequentado por programadores, universitários cansados e pessoas que claramente já tomaram café demais.

Durante a madrugada, os clientes fazem pedidos sem muito critério: um pede 3 cafés e um hambúrguer, outro pede só batata, outro diz que “vai pensar” e fica 20 minutos parado no caixa. Para organizar esse caos, a gerência decidiu automatizar os pedidos.

Sua tarefa é criar um programa que funcione no terminal e permita registrar os pedidos de um cliente.

### Cardápio:

1. Café suspeitamente forte — R$ 7
2. Hambúrguer do desespero — R$ 18
3. Batata frita existencial — R$ 12
4. Refrigerante sem gelo, por favor — R$ 6
5. Encerrar pedido

### O programa deve:

* exibir o cardápio na tela;
* permitir que o cliente escolha itens várias vezes;
* continuar funcionando até que a opção **5 - Encerrar pedido** seja escolhida;
* somar o valor total do pedido;
* contar quantos itens foram pedidos no total.

### Ao final, o programa deve mostrar:

* a quantidade total de itens pedidos;
* o valor total da compra;
* uma mensagem final engraçada, como:
  **“Pedido encerrado. Boa sorte para sobreviver ao restante da noite.”**

### Regras:

* se o usuário digitar uma opção inválida, o programa deve avisar e mostrar o menu novamente;
* cada escolha válida deve ser registrada corretamente;
* o programa deve usar **loop de repetição** para manter o menu aparecendo até o encerramento.

### Desafio extra:

* mostrar quantas unidades de cada item foram pedidas;
* se o total passar de **R$ 50**, exibir:
  **“Parabéns. Seu nível de estresse claramente justificou esse pedido.”**
* se o cliente pedir **3 ou mais cafés**, exibir:
  **“Atenção: recomendamos que você não tome decisões importantes nas próximas 2 horas.”**
