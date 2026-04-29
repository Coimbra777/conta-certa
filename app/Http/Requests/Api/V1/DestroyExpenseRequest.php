<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Expense;
use App\Models\Team;
use Illuminate\Foundation\Http\FormRequest;

class DestroyExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User|null $user */
        $user = $this->user();
        if (! $user) {
            return false;
        }

        /** @var Team|null $team */
        $team = $this->route('team');
        /** @var Expense|null $expense */
        $expense = $this->route('expense');
        if (! $team instanceof Team || ! $expense instanceof Expense) {
            return false;
        }
        if ((int) $expense->team_id !== (int) $team->id) {
            return false;
        }

        $membership = $team->members()->where('user_id', $user->id)->first();

        return $membership && $membership->role === 'admin';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
