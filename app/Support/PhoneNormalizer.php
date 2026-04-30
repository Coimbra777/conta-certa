<?php

namespace App\Support;

class PhoneNormalizer
{
    public const INVALID_MESSAGE = 'Telefone inválido. Use um número com DDD.';

    public static function digits(?string $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        return preg_replace('/\D+/', '', $value) ?? '';
    }

    public static function isValid(?string $value): bool
    {
        $digits = self::digits($value);
        $length = strlen($digits);

        if (($length !== 10 && $length !== 11) || preg_match('/^(\d)\1+$/', $digits) === 1) {
            return false;
        }

        return $length === 11
            ? $digits[2] === '9'
            : $digits[2] !== '9';
    }
}
