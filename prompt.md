Corrigir testes que falharam após a implementação da validação de telefone brasileiro.

Contexto:
Implementamos validação correta de telefone BR:

- celular: 11 dígitos e terceiro dígito = 9
- fixo: 10 dígitos e terceiro dígito != 9

Problema atual:
Alguns testes estão usando telefones inválidos segundo a nova regra, por exemplo:
"11888887777"

Esse número tem 11 dígitos, mas o terceiro dígito é "8", então não é um celular válido.

Erro atual:
Expected status 200, but got 422 (Telefone inválido)

---

## Tarefa

1. Revisar todos os testes que usam telefone:

- tests/Feature/\*
- tests/Unit/\*
- factories
- seeders (se houver)

2. Substituir telefones inválidos por válidos:

Para celular:

- usar padrão: DDD + 9 + 8 dígitos
- exemplos válidos:
    - "11988887777"
    - "11999990000"
    - "(11) 98888-7777"

Para fixo (se o sistema permitir):

- exemplos:
    - "1133334444"

3. Regra:

- NÃO usar números com 11 dígitos que não começam com 9 no terceiro dígito
- NÃO usar números curtos
- NÃO usar números inválidos tipo "123"

4. Ajustar especificamente o teste que falhou:

Arquivo:
tests/Feature/Expense/ExpenseTest.php

Trocar:
"11888887777"

Por:
"11988887777"

5. Garantir consistência:

- todos os testes devem usar telefones válidos
- manter formato simples (sem máscara) se já for padrão dos testes

---

## Testes

Executar:

php artisan test

Critério:

- 100% dos testes passando
- nenhum erro de validação de telefone em cenários que deveriam ser válidos

---

## Entrega

- lista de arquivos alterados
- quais telefones foram corrigidos
- confirmação de testes passando
- se encontrou outros casos semelhantes
