<?php

namespace App\Support;

use App\Exceptions\HttpApiException;
use App\Models\Expense;

final class ExpenseClosedPolicy
{
    public const MESSAGE = 'Esta cobrança já foi finalizada e não pode mais ser alterada.';

    public const CODE = 'EXPENSE_CLOSED';

    public const HTTP_STATUS = 422;

    public static function assertOpen(Expense $expense): void
    {
        if ($expense->status === 'closed') {
            throw new HttpApiException(self::MESSAGE, self::CODE, self::HTTP_STATUS);
        }
    }
}
