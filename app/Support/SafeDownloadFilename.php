<?php

namespace App\Support;

use Illuminate\Support\Str;

final class SafeDownloadFilename
{
    /**
     * Nome seguro para Content-Disposition (sem path traversal ou caracteres de controle).
     */
    public static function forProof(string $mimeType, ?string $originalFilename = null): string
    {
        $base = $originalFilename !== null && $originalFilename !== ''
            ? pathinfo($originalFilename, PATHINFO_FILENAME)
            : 'comprovante';
        $base = (string) preg_replace('/[^\pL\pN._-]/u', '_', $base);
        $base = trim($base, '._-') ?: 'comprovante';
        $base = Str::limit($base, 120, '');

        $ext = match (true) {
            str_contains((string) $mimeType, 'pdf') => 'pdf',
            str_contains((string) $mimeType, 'png') => 'png',
            str_contains((string) $mimeType, 'jpeg'), str_contains((string) $mimeType, 'jpg') => 'jpg',
            default => 'bin',
        };

        return $base.'.'.$ext;
    }
}
