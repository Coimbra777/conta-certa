<?php

namespace App\Http\Middleware;

use App\Exceptions\HttpApiException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bloqueia POST /api/public/expenses enquanto a criação anônima estiver em standby.
 * O controller e o serviço permanecem no código para reativação futura (remover este middleware da rota).
 */
class PublicAnonymousExpenseCreationStandby
{
    public function handle(Request $request, Closure $next): Response
    {
        throw new HttpApiException(
            'Criação de cobrança sem cadastro está temporariamente indisponível. Crie uma conta gratuita para usar o fluxo principal.',
            'PUBLIC_CREATE_EXPENSE_STANDBY',
            410,
        );
    }
}
