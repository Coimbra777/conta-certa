<?php

namespace App\Rules;

use App\Support\PhoneNormalizer;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class BrazilPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! PhoneNormalizer::isValid(is_scalar($value) ? (string) $value : null)) {
            $fail(PhoneNormalizer::INVALID_MESSAGE);
        }
    }
}
