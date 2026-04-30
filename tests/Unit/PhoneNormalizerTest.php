<?php

namespace Tests\Unit;

use App\Support\PhoneNormalizer;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PhoneNormalizerTest extends TestCase
{
    public static function validPhoneProvider(): array
    {
        return [
            'mobile' => ['11999999999'],
            'landline' => ['1133334444'],
        ];
    }

    public static function invalidPhoneProvider(): array
    {
        return [
            '10_digits_starting_with_9' => ['1193334444'],
            'short' => ['987013066'],
            'repeated_digits' => ['99999999999'],
        ];
    }

    #[DataProvider('validPhoneProvider')]
    public function test_accepts_valid_brazilian_phones(string $phone): void
    {
        $this->assertTrue(PhoneNormalizer::isValid($phone));
    }

    #[DataProvider('invalidPhoneProvider')]
    public function test_rejects_invalid_brazilian_phones(string $phone): void
    {
        $this->assertFalse(PhoneNormalizer::isValid($phone));
    }
}
