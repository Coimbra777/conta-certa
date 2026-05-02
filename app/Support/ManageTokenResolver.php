<?php

namespace App\Support;

use Illuminate\Http\Request;

/** Token de gestão de cobrança pública: aceito somente via header `X-Manage-Token`. */
final class ManageTokenResolver
{
    public static function resolve(Request $request): ?string
    {
        $header = $request->header('X-Manage-Token');
        if (is_array($header)) {
            $header = $header[0] ?? null;
        }
        if ($header !== null && $header !== '') {
            return (string) $header;
        }

        return null;
    }
}
