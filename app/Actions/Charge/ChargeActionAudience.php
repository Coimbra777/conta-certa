<?php

namespace App\Actions\Charge;

/**
 * Origem da operação sobre a cobrança (mensagens diferentes por contexto).
 */
final class ChargeActionAudience
{
    /** Dono da cobrança autenticado (espelha antigo fluxo “admin da equipe”). */
    public const EXPENSE_OWNER = 'expense_owner';

    public const PUBLIC_MANAGE = 'public_manage';
}
