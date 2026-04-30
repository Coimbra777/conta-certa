<?php

namespace App\Support;

use App\Models\Expense;
use App\Models\User;

/** Autorização: apenas o criador da cobrança (`created_by`). */
final class ExpenseAuthorizer
{
    public static function canManage(?User $user, Expense $expense): bool
    {
        if ($user === null || $expense->created_by === null) {
            return false;
        }

        return (int) $expense->created_by === (int) $user->id;
    }
}
