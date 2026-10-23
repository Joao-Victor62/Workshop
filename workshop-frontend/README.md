# workshop-frontend

Frontend do mural de recados: React 19 + TypeScript, criado com Vite. Instruções completas do workshop (Codespaces, backend, exercício) no [README principal](../README.md).

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em http://localhost:5173, com recarga automática |
| `npm run build` | Checa os tipos e gera a versão de produção em `dist/` |
| `npm run lint` | Roda o ESLint |
| `npm run preview` | Serve a versão de produção gerada pelo `build` |

## Comunicação com o backend

O frontend sempre chama caminhos relativos, como `fetch('/api/recados')`. O proxy em `vite.config.ts` repassa tudo que começa com `/api` para o Spring em `http://localhost:8080`. Assim, o mesmo código funciona na sua máquina e no Codespaces, sem problemas de CORS.

O backend precisa estar rodando. Sem ele, as chamadas retornam erro 502.
