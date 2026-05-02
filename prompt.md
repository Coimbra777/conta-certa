Você é um Tech Lead especialista em Laravel, React/Vite, segurança web, APIs REST, LGPD e documentação técnica.

Objetivo:

1. Fazer um review completo de segurança do projeto, tanto backend quanto frontend.
2. Verificar se o projeto está coerente para fechar o MVP.
3. Ajustar a documentação, especialmente o README.md, para manter apenas procedimentos claros para rodar o projeto localmente.

Importante:

- Primeiro faça o review.
- Depois corrija apenas problemas objetivos e seguros.
- Não implemente features novas.
- Não altere regra de negócio sem necessidade.
- Não quebre testes existentes.

---

# 1. Review de segurança backend

Analise:

## Autenticação

- Sanctum;
- expiração de token;
- logout/revogação;
- endpoints protegidos;
- resposta de erro 401.

## Autorização

- usuário só acessa suas próprias cobranças;
- participante público só acessa o que deve;
- gestor público depende de manage_token;
- rotas públicas não vazam dados sensíveis.

## manage_token

- verificar se ainda é aceito por query string ou body;
- ideal: aceitar somente header X-Manage-Token;
- verificar se não aparece em URL, logs ou resposta indevida;
- revisar uso em PublicExpenseResource, controllers e frontend.

## Uploads/comprovantes

- storage privado;
- validação de extensão;
- validação por magic bytes;
- limite de tamanho;
- path seguro;
- agrupamento por expense;
- nome sem dados sensíveis de nome;
- exclusão ao fechar cobrança;
- reenvio após rejeição remove arquivo antigo;
- preview/download bloqueado após fechamento.

## Validações

- telefone BR;
- data de vencimento;
- valores;
- participantes obrigatórios;
- soma >= total;
- mensagens PT-BR;
- erros com code estável.

## API

- envelope padrão;
- errors por campo;
- status HTTP corretos;
- CORS;
- rate limiting;
- headers de segurança;
- CSP/HSTS.

## LGPD

- confirmar que CPF não é mais coletado;
- confirmar que CPF não é exposto;
- confirmar que nomes/telefones não vazam para visitante comum;
- confirmar que comprovantes são temporários;
- verificar documentação sobre retenção/exclusão.

---

# 2. Review de segurança frontend

Analise:

## Auth

- armazenamento do token;
- limpeza de sessão;
- logout;
- fluxo demo separado;
- login real não mistura com demo.

## Rotas públicas

- não enviar Bearer token para endpoints públicos;
- manage_token enviado somente via header;
- participante não vê nome real do organizador;
- participante não vê lista completa indevida.

## Formulários

- sem alert();
- erros por campo;
- validação antes de submit;
- mensagens PT-BR;
- telefone inválido visível;
- data vencida visível;
- valores faltantes/excedentes claros.

## UI de comprovantes

- informar que comprovantes são excluídos ao finalizar;
- ocultar preview após fechamento;
- mostrar mensagem correta após fechamento.

## Dados sensíveis

- não usar telefone real como placeholder;
- não expor CPF;
- não exibir tokens;
- não logar dados sensíveis no console.

---

# 3. Corrigir problemas encontrados

Se encontrar problemas objetivos, corrija.

Exemplos de correções permitidas:

- remover token por query/body;
- corrigir mensagem de erro;
- esconder campo indevido;
- remover console.log sensível;
- ajustar teste quebrado;
- corrigir doc desatualizada;
- ajustar README;
- ajustar CORS/env example;
- ajustar texto de privacidade/comprovantes.

Não fazer:

- refactor grande;
- mudança visual ampla;
- nova feature;
- troca de arquitetura;
- deploy;
- integração externa nova.

---

# 4. README.md

Reescrever o README.md para manter apenas o necessário para rodar localmente.

O README deve conter:

## Nome do projeto

ContaCerta ou nome atual do projeto.

## Requisitos

- Docker e Docker Compose;
- Node.js/npm, se o frontend roda fora do container;
- PHP Composer apenas se houver modo sem Docker.

## Como rodar local com Docker

Passos claros:

1. Copiar env:
   cp .env.example .env

2. Subir containers:
   docker compose up -d --build

3. Instalar dependências backend, se necessário:
   docker compose exec app composer install

4. Gerar chave:
   docker compose exec app php artisan key:generate

5. Rodar migrations:
   docker compose exec app php artisan migrate

6. Rodar frontend:
   cd frontend
   npm install
   npm run dev

7. Acessar:

- API/Laravel: http://localhost:8000 ou porta correta do projeto
- Frontend/Vite: http://localhost:5173
- phpMyAdmin, se existir apenas no dev

## Testes

Backend:
docker compose run --rm app php artisan test

Frontend:
cd frontend
npm run test

Build:
cd frontend
npm run build

## Observações locais

- comprovantes ficam em storage privado local;
- modo demo disponível para visitante;
- criação pública, se estiver em standby, documentar;
- não colocar instruções de produção/deploy no README.

Remover do README:

- detalhes longos de arquitetura;
- roadmap;
- documentação de produção;
- instruções AWS;
- checklist de segurança;
- explicações extensas de API;
- textos duplicados que já estão em doc/.

Se necessário, mover detalhes para:

- doc/API.md
- doc/SECURITY.md
- doc/PRODUCTION_CHECKLIST.md
- doc/BACKEND.md
- doc/FRONTEND.md

---

# 5. Documentação auxiliar

Atualizar apenas se necessário:

- doc/SECURITY.md:
    - comprovantes temporários;
    - manage_token;
    - storage privado;
    - CPF não coletado;
    - erros e validações.

- doc/API.md:
    - se algum contrato tiver mudado.

- doc/PRODUCTION_CHECKLIST.md:
    - se README tinha algo de produção que foi removido e precisa ficar lá.

---

# 6. Testes obrigatórios

Depois das alterações, executar:

docker compose run --rm app php artisan test
cd frontend && npm run test
cd frontend && npm run build

Se algum comando falhar:

- não esconder;
- explicar o erro;
- apontar o arquivo/causa provável.

---

# 7. Entrega final

Entregar relatório em Markdown com:

1. Resumo do review de segurança.
2. Problemas encontrados.
3. Problemas corrigidos.
4. Arquivos alterados.
5. Como ficou o README.
6. Testes executados e resultado.
7. Riscos restantes.
8. Status final:
    - aprovado;
    - aprovado com ressalvas;
    - bloqueado.
