const prompt = require("prompt-sync")()

let valorTotal = 0
let quantidadeItens = 0

let qtdCafes = 0
let qtdHamburgueres = 0
let qtdBatatas = 0
let qtdRefrigerantes = 0

console.log("Bem-vindo ao Bug e Burguer!")
console.log("Aqui está o nosso cardápio:")

let escolha = 0;

while (escolha != 5) {
    console.log("1. Café suspeitamente forte — R$ 7")
    console.log("2. Hambúrguer do desespero — R$ 18")
    console.log("3. Batata frita existencial — R$ 12")
    console.log("4. Refrigerante sem gelo, por favor — R$ 6")
    console.log("5. Encerrar pedido")

    escolha = prompt("Digite o número do item que deseja pedir: ")

    switch (escolha) {
        case "1":
            console.log("Add 1 Café suspeitamente forte.")
            quantidadeItens++
            valorTotal += 7
            qtdCafes++
            break
        case "2":
            console.log("Add 1 Hambúrguer do desespero.")
            quantidadeItens++
            valorTotal += 18
            qtdHamburgueres++
            break
        case "3":
            console.log("Add 1 Batata frita existencial.")
            quantidadeItens++
            valorTotal += 12
            qtdBatatas++
            break
        case "4":
            console.log("Add 1 Refrigerante sem gelo, por favor.")
            quantidadeItens++
            valorTotal += 6
            qtdRefrigerantes++
            break
        case "5":
            console.log("Pedido encerrado. Obrigado por escolher o Bug e Burguer!")
            break
        default:
            console.log("Opção inválida. Por favor, escolha um item válido.")
    }
}
console.log(`Quantidade de itens pedidos: ${quantidadeItens}`)
console.log(`Valor total: R$ ${valorTotal.toFixed(2)}`)

console.log(`Quantidade de cafés: ${qtdCafes}`)
console.log(`Quantidade de hambúrgueres: ${qtdHamburgueres}`)
console.log(`Quantidade de batatas fritas: ${qtdBatatas}`)
console.log(`Quantidade de refrigerantes: ${qtdRefrigerantes}`)

if (valorTotal > 50) {
    console.log("Parabéns. Seu nível de estresse claramente justificou esse pedido.")
}
if (qtdCafes >= 3) {
    console.log("Atenção: recomendamos que você não tome decisões importantes nas próximas 2 horas.")
}
console.log("Boa viagem para casa. Esperemos que tenha uma vida menos saudável!")
