<?php

namespace Tests\Support;

/**
 * JPEG mínimo válido (1×1 px) para testes de upload sem extensão GD no PHP.
 */
final class ProofUploadFixture
{
    public static function minimalJpeg(): string
    {
        $b64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALCwsNDxkREBQgGBxQICwwfFxsfGDIrIywoIycgSk43NjU9Nik0OVFQUFE9TUtSK0VLUUpNU01KTVNPT09PT09P/2wBDAQ4ODhMQERIUFBUUFhUXGBgYGB4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGf/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFRABAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQAEAj9Af//Z';

        return base64_decode($b64, true) ?: '';
    }

    public static function jpegUploadedFile(string $filename = 'proof.jpg'): \Illuminate\Http\UploadedFile
    {
        return \Illuminate\Http\UploadedFile::fake()->createWithContent($filename, self::minimalJpeg());
    }
}
