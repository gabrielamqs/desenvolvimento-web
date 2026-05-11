# 🔗 Encurtador de URLs

Aplicação web para encurtar URLs, construída com **Bun** + **TypeScript** + **SQLite**.

## Pré-requisitos

- [Bun](https://bun.sh) v1.0+

## Instalação

```bash
bun install
```

## Executando o servidor

```bash
bun start
```

Ou, para desenvolvimento com reinicialização automática:

```bash
bun dev
```

O servidor ficará disponível em <http://localhost:3000>.

## Executando os testes

```bash
bun test
```

---

## Variáveis de ambiente

O projeto utiliza um arquivo `.env` para configuração. Crie (ou edite) o arquivo `.env` na raiz do projeto:

```
PORTA=3000
```

| Variável | Padrão | Descrição                          |
|----------|--------|------------------------------------|
| `PORTA`  | `3000` | Porta em que o servidor HTTP sobe  |

**Como alterar a porta:**

1. Abra o arquivo `.env` na raiz do projeto.  
2. Altere o valor de `PORTA` para a porta desejada, por exemplo: `PORTA=8080`.  
3. Reinicie o servidor com `bun start`.  

Alternativamente, você pode sobrescrever a variável diretamente no terminal sem alterar o `.env`:

```bash
PORTA=8080 bun start
```

---

## Rotas da API

| Método | Rota                  | Descrição                                        |
|--------|-----------------------|--------------------------------------------------|
| `POST` | `/api/encurtar`       | Cria uma URL encurtada                           |
| `GET`  | `/api/urls`           | Lista todas as URLs cadastradas                  |
| `GET`  | `/:codigo`            | Redireciona para a URL original (302)            |
| `GET`  | `/stats/:codigo`      | Página HTML com estatísticas e QR Code           |

### POST `/api/encurtar`

**Corpo (JSON):**

```json
{
  "urlOriginal": "https://exemplo.com/pagina-muito-longa",
  "codigo": "meulink",
  "expiraEm": "2025-12-31T23:59"
}
```

| Campo         | Tipo     | Obrigatório | Descrição                                         |
|---------------|----------|-------------|---------------------------------------------------|
| `urlOriginal` | `string` | ✅          | URL completa (deve começar com `http://` ou `https://`) |
| `codigo`      | `string` | ❌          | Código personalizado (4–10 letras/números)        |
| `expiraEm`    | `string` | ❌          | Data/hora de expiração no formato `YYYY-MM-DDTHH:MM` |

**Respostas:**

| Status | Situação                                         |
|--------|--------------------------------------------------|
| `201`  | URL criada com sucesso                           |
| `400`  | URL inválida ou código com formato errado        |
| `409`  | Código personalizado já está em uso              |

### GET `/:codigo`

Redireciona (302) para a URL original.  
Retorna `404` se o código não existir e `410 Gone` se o link estiver expirado.

### GET `/stats/:codigo`

Retorna uma página HTML com:
- URL original e URL curta
- Data de criação
- Data de expiração (se houver)
- Contador de acessos
- QR Code gerado via [api.qrserver.com](https://api.qrserver.com)

---

## Estrutura do projeto

```
encurtador-urls/
├── index.ts        # Servidor HTTP (Bun.serve)
├── banco.ts        # Acesso ao SQLite com prepared statements
├── util.ts         # Funções utilitárias (gerarCodigo, urlValida, codigoValido)
├── tipos.ts        # Interfaces TypeScript
├── util.test.ts    # Testes automatizados (bun test)
├── .env            # Variáveis de ambiente
├── urls.db         # Banco de dados SQLite (gerado automaticamente)
└── public/
    ├── index.html  # Interface web
    ├── app.js      # Lógica do frontend
    └── styles.css  # Estilos
```

---

## Desafios implementados

| Desafio | Descrição |
|---------|-----------|
| **A — Códigos personalizados** | Campo `codigo` opcional no POST; validado (4–10 alfanuméricos); retorna 409 se em uso |
| **B — Página de estatísticas** | Rota `GET /stats/:codigo` com HTML mostrando dados e QR Code |
| **C — Expiração de links** | Campo `expiraEm` opcional; links expirados retornam 410 Gone |
| **D — Testes automatizados** | `util.test.ts` com testes para `gerarCodigo`, `urlValida` e `codigoValido` |
| **E — Variáveis de ambiente** | Porta configurável via `PORTA` no `.env`, lida com `Bun.env.PORTA` |
