type Usuario = {
    nome: string;
    idade?: number;
    telefone: Array<string>;
    ativo: boolean; 
}

const usuario1: Usuario = {
    nome: "João",
    idade: 30,
    telefone: ["123456789", "987654321"],
    ativo: true
}

const usuario2: Usuario = {
    nome: "Maria",
    telefone: ["555555555"],
    ativo: false
}

console.log("Usuário 1:", usuario1);
console.log("Usuário 2:", usuario2);