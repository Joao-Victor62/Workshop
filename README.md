# Workshop COMP: Spring + React

Um **mural de recados** completo, do banco de dados à tela: o backend em Spring Boot guarda os recados, e o frontend em React lista, cria e exclui.

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 4.1 (Web MVC, Data JPA, Validation), banco H2 em memória |
| Frontend | React 19, TypeScript, Vite |
| Ambiente | GitHub Codespaces (nada para instalar na sua máquina) |

## 1. Abrindo o projeto no Codespaces

[![Abrir no GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Joao-Victor62/Workshop)

1. Entre na sua conta do GitHub e clique no botão acima (ou, no repositório: **Code → Codespaces → Create codespace on main**).
2. Espere a criação terminar. Na primeira vez leva alguns minutos, porque o Codespaces já baixa todas as dependências do Maven e do npm.
3. Quando o VS Code abrir no navegador, o ambiente está pronto: Java 21, Node e as extensões já estão instalados.

## 2. Rodando

Você vai precisar de **dois terminais** (no VS Code: **Terminal → New Terminal**, e o botão **+** para abrir o segundo).

**Terminal 1: backend**
```bash
cd workshop-backend
./mvnw spring-boot:run
```
Está pronto quando aparecer `Started WorkshopApplication`.

**Terminal 2: frontend**
```bash
cd workshop-frontend
npm run dev
```

O Codespaces abre o frontend no navegador sozinho. Se não abrir, vá na aba **Portas (Ports)** e clique no ícone de globo da porta **5173**.

### Endereços úteis

| O quê | Onde |
|---|---|
| Aplicação React | porta **5173** |
| API (JSON) | porta **8080**, caminho `/api/recados` |
| Console do banco H2 | porta **8080**, caminho `/h2-console` |

No console do H2, use **JDBC URL** `jdbc:h2:mem:workshop`, usuário `sa` e senha em branco.

> Os dados ficam só na memória: toda vez que o backend reinicia, o banco volta para os 3 recados do `data.sql`.

## 3. Como o projeto está organizado

```
workshop-backend/
├── recados.http                        requisições prontas para testar a API (clique em "Send Request")
└── src/main/
    ├── java/com/comp/workshop/
    │   ├── model/Recado.java           a entidade: vira a tabela RECADO no banco
    │   ├── dto/NovoRecado.java         o que o cliente pode enviar, com as validações
    │   ├── repository/RecadoRepository.java   acesso ao banco (o Spring gera a implementação)
    │   ├── controller/RecadoController.java   os endpoints HTTP
    │   └── config/CorsConfig.java      libera chamadas de outras origens
    └── resources/
        ├── application.properties      configuração (banco, JPA, erros)
        └── data.sql                    recados iniciais

workshop-frontend/
├── vite.config.ts                      proxy: tudo em /api vai para o backend
└── src/
    ├── types.ts                        os tipos Recado e NovoRecado (espelham as classes Java)
    ├── api.ts                          as chamadas fetch para o backend
    ├── App.tsx                         o estado da tela: carrega, adiciona e exclui recados
    └── components/
        ├── RecadoForm.tsx              o formulário
        └── RecadoLista.tsx             a lista de recados
```

### O caminho de uma requisição

Quando você clica em **Enviar**:

```
RecadoForm (onSubmit)
  → api.ts: fetch POST /api/recados
  → proxy do Vite → Spring na porta 8080
  → RecadoController.criar() valida o NovoRecado
  → RecadoRepository.save() → INSERT no H2
  ← devolve o recado salvo (com id e data)
  ← App.tsx coloca o recado novo no estado → React redesenha a lista
```

### A API

| Método | Caminho | Corpo | Resposta |
|---|---|---|---|
| `GET` | `/api/recados` | | `200` com a lista, mais recentes primeiro |
| `POST` | `/api/recados` | `{ "autor": "...", "texto": "..." }` | `201` com o recado criado, ou `400` com os erros de validação |
| `DELETE` | `/api/recados/{id}` | | `204`, ou `404` se o recado não existir |

## 4. Exercício: adicionar o campo `curso`

Cada recado deve mostrar também o curso de quem escreveu (por exemplo, "Ciência da Computação"). Para isso, o campo precisa passar por **todas as camadas**:

1. **`model/Recado.java`**: novo atributo `curso`, com `@Column`, getter e um parâmetro novo no construtor.
2. **`dto/NovoRecado.java`**: novo campo `curso`, com `@NotBlank` e `@Size`.
3. **`controller/RecadoController.java`**: passar `novo.curso()` ao criar o `Recado`.
4. **`data.sql`**: incluir a coluna `curso` nos `INSERT`.
5. **`types.ts`**: adicionar `curso` em `Recado` e em `NovoRecado`.
6. **`components/RecadoForm.tsx`**: um novo `useState` e um novo `<input>`.
7. **`components/RecadoLista.tsx`**: exibir o curso no recado.

Para conferir, envie um recado sem curso: a mensagem de validação que você escreveu no Java deve aparecer no formulário.

### Desafios extras

- **Contador de caracteres** embaixo do texto ("42/280"). Só frontend: dá para calcular a partir do estado que já existe.
- **Busca por autor**: `GET /api/recados?autor=ana`, usando um método `findByAutorContainingIgnoreCase` no repositório.
- **Editar um recado**: `PUT /api/recados/{id}` no backend e um botão de edição no frontend.

## 5. Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| O frontend mostra "Erro 502" ou a lista não carrega | O backend não está rodando. Confira o terminal 1. |
| `Port 5173 is already in use` | Já existe um `npm run dev` aberto em outro terminal. Feche-o com `Ctrl+C`. |
| `Port 8080 was already in use` | Já existe um backend rodando. Feche-o com `Ctrl+C`. |
| O `SELECT` aparece duas vezes no log do Spring | Normal em desenvolvimento: o `StrictMode` do React executa o `useEffect` duas vezes para ajudar a achar bugs. Não acontece em produção. |
| Os recados que criei sumiram | O backend reiniciou, e o H2 em memória começa do zero (veja o `data.sql`). |

## Rodando na sua máquina (opcional)

Precisa de **JDK 21** e **Node.js 22.12** ou mais recente. Os comandos são os mesmos da seção 2, e o frontend fica em http://localhost:5173.
