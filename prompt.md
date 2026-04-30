Ajustar o header da página inicial (Landing) para simplificar a UX.

Objetivo:
Na página inicial, quando o usuário estiver autenticado (conta real), exibir apenas o botão "Sair" no header.

Regras:

1. Usuário deslogado:

- mostrar normalmente:
    - botão "Entrar"
    - botão "Criar conta"
    - CTA "Ver demonstração"

2. Usuário logado (conta real):

- NÃO mostrar:
    - botão "Entrar"
    - botão "Criar conta"
    - botão "Ver demonstração"
- mostrar apenas:
    - botão "Sair" no header

3. Usuário em modo demonstração:

- comportamento já existente:
    - ao acessar a landing, encerrar automaticamente a sessão demo
    - após isso, tratar como visitante deslogado

4. Implementação:

Arquivos prováveis:

- frontend/src/pages/Landing.tsx
- frontend/src/components/Header.tsx (ou equivalente)
- frontend/src/lib/auth.tsx

Lógica sugerida:

- usar:
    - user (estado autenticado)
    - isDemoMode()
    - isLoading

- condição para header:

if (isLoading) return null

if (user && !isDemo) {
mostrar botão "Sair"
} else {
mostrar "Entrar", "Criar conta" e CTA de demonstração
}

5. Garantir:

- logout limpa auth e demo
- não quebrar fluxo existente de demo
- não quebrar testes atuais

6. Testes:

Adicionar/ajustar testes:

- visitante vê login/registro/demo
- usuário logado vê apenas botão "Sair"
- usuário demo ao acessar landing vira visitante
- header não mostra elementos errados durante loading

Executar:

- npm run test
- npm run build

Entrega:

- lista de arquivos alterados
- descrição do comportamento final
- possíveis impactos no frontend
