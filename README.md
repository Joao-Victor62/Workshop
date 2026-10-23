# Workshop COMP: Spring + React

Um **mural de recados** completo, do banco de dados à tela: o backend em Spring Boot guarda os recados, e o frontend em React lista, cria e exclui.

> **Esta é a branch do workshop.** O frontend já está pronto, e o backend tem só as classes vazias: vamos preenchê-las juntos durante a aula (seção 4). A solução completa está na branch [`main`](https://github.com/Joao-Victor62/Workshop/tree/main).

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 4.1 (Web MVC, Data JPA, Validation), banco H2 em memória |
| Frontend | React 19, TypeScript, Vite |
| Ambiente | GitHub Codespaces (nada para instalar na sua máquina) |

## 1. Abrindo o projeto no Codespaces

[![Abrir no GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Joao-Victor62/Workshop/tree/workshop)

1. Entre na sua conta do GitHub e clique no botão acima. Ele já abre a branch `workshop`. Pelo repositório, escolha a branch `workshop` e depois **Code → Codespaces → Create codespace on workshop**.
2. Espere a criação terminar. Na primeira vez leva alguns minutos, porque o Codespaces já baixa todas as dependências do Maven e do npm.
3. Quando o VS Code abrir no navegador, ele pergunta se você confia nos autores dos arquivos ("Você confia nos autores...?" ou "Do you trust the authors...?"). Clique em **Confiar na pasta e continuar** (**Trust Folder & Continue**). Sem isso, o VS Code fica em Modo Restrito e o terminal não abre.
4. Pronto: Java 21, Node, as dependências e as extensões já estão instalados.

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

No começo, a página mostra o erro `No static resource api/recados.`. Isso é esperado: o frontend já faz a chamada, mas o backend ainda não tem o endpoint. Ele some na etapa 3.

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
        └── data.sql                    recados iniciais (criado na etapa 4)

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

### A API que vamos construir

| Método | Caminho | Corpo | Resposta |
|---|---|---|---|
| `GET` | `/api/recados` | | `200` com a lista, mais recentes primeiro |
| `POST` | `/api/recados` | `{ "autor": "...", "texto": "..." }` | `201` com o recado criado, ou `400` com os erros de validação |
| `DELETE` | `/api/recados/{id}` | | `204`, ou `404` se o recado não existir |

## 4. Construindo o backend

Cada etapa destrava uma parte do frontend, que já está pronto.

**O backend não reinicia sozinho.** Depois de cada etapa, vá ao terminal do backend e pare com `Ctrl+C`. Espere o prompt voltar e rode `./mvnw spring-boot:run` de novo (a seta ↑ traz o comando de volta). Depois, recarregue a página do frontend.

| Etapa | Arquivo | O que fazer | O que muda na tela |
|---|---|---|---|
| 1 | `model/Recado.java` | `@Entity` com `id`, `autor`, `texto` e `criadoEm`; data preenchida com `@PrePersist` | nada ainda, mas a tabela `RECADO` aparece no console do H2 |
| 2 | `repository/RecadoRepository.java` | estender `JpaRepository<Recado, Long>` e declarar `findAllByOrderByCriadoEmDesc()` | nada ainda |
| 3 | `controller/RecadoController.java` | `@RestController` em `/api/recados` com o `GET` | o erro some: "Nenhum recado ainda" |
| 4 | `resources/data.sql` | criar o arquivo com os recados iniciais (abaixo) | aparecem 3 recados |
| 5 | `dto/NovoRecado.java` + controller | record com `@NotBlank`/`@Size` e o `POST` com `@Valid` | o formulário funciona, e as mensagens de validação aparecem |
| 6 | `controller/RecadoController.java` | o `DELETE /{id}`, com `404` se não existir | o botão Excluir funciona |

Para testar a API sem o frontend, abra `workshop-backend/recados.http` e clique em **Send Request** acima de cada requisição.

**Conteúdo do `data.sql` (etapa 4):**
```sql
INSERT INTO recado (autor, texto, criado_em) VALUES
  ('Diretoria COMP', 'Bem-vindos ao workshop de Spring + React!', DATEADD('MINUTE', -30, CURRENT_TIMESTAMP)),
  ('João', 'Esse recado veio do data.sql, direto para o H2.', DATEADD('MINUTE', -20, CURRENT_TIMESTAMP)),
  ('Maria', 'Mal posso esperar para criar o meu pelo formulário.', DATEADD('MINUTE', -10, CURRENT_TIMESTAMP));
```

### Ficou para trás?

A solução está na branch `main`. Para trazer **um arquivo** dela:
```bash
git checkout origin/main -- workshop-backend/src/main/java/com/comp/workshop/model/Recado.java
```
Para trazer **o backend inteiro** (isso substitui tudo o que você escreveu no backend):
```bash
git checkout origin/main -- workshop-backend
```
Depois, reinicie o backend (`Ctrl+C` e `./mvnw spring-boot:run`).

## 5. Exercício: adicionar o campo `curso`

Depois de terminar o backend: cada recado deve mostrar também o curso de quem escreveu (por exemplo, "Ciência da Computação"). Para isso, o campo precisa passar por **todas as camadas**:

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

## 6. Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| A página mostra `No static resource api/recados.` | O endpoint ainda não existe ou o controller está sem `@RestController`/`@RequestMapping` (etapa 3). |
| O backend não sobe: `Table "RECADO" not found` | O `data.sql` foi criado antes da entidade, ou a classe `Recado` está sem `@Entity`. |
| Mudei o backend, mas nada mudou na tela | O backend não reinicia sozinho: `Ctrl+C` e `./mvnw spring-boot:run` de novo, depois recarregue a página. |
| O terminal não abre e aparece "Modo Restrito" | Clique em **Modo Restrito** na barra inferior e escolha confiar na pasta. |
| O frontend mostra "Erro 502" ou a lista não carrega | O backend não está rodando. Confira o terminal 1. |
| `Port 5173 is already in use` | Já existe um `npm run dev` aberto em outro terminal. Feche-o com `Ctrl+C`. |
| `Port 8080 was already in use` | Já existe um backend rodando. Feche-o com `Ctrl+C`. |
| O `SELECT` aparece duas vezes no log do Spring | Normal em desenvolvimento: o `StrictMode` do React executa o `useEffect` duas vezes para ajudar a achar bugs. Não acontece em produção. |
| Os recados que criei sumiram | O backend reiniciou, e o H2 em memória começa do zero (veja o `data.sql`). |

## Rodando na sua máquina (opcional)

Precisa de **JDK 21** e **Node.js 22.12** ou mais recente. Os comandos são os mesmos da seção 2, e o frontend fica em http://localhost:5173.
