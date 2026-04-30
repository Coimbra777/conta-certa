<?php

namespace App\Support;

use App\Http\Resources\ExpenseParticipantResource;
use App\Models\Charge;

/**
 * Único ponto de fallback entre snapshot oficial ({@see Charge::$expense_participant_id})
 * e vínculo legado ({@see Charge::$team_member_id} / {@see \App\Models\TeamMember}).
 */
final class ChargeParticipantResolver
{
    /**
     * Relações necessárias em {@see Charge} para resolver nome/telefone do participante.
     *
     * @var list<string>
     */
    public const CHARGE_SNAPSHOT_RELATIONS = ['expenseParticipant', 'teamMember'];

    /**
     * @return list<string>
     */
    public static function chargeRelationsWithProofs(): array
    {
        return [...self::CHARGE_SNAPSHOT_RELATIONS, 'paymentProofs'];
    }

    /**
     * @return array<string, \Closure>
     */
    public static function eagerLoadChargesWithSnapshots(): array
    {
        return [
            'charges' => fn ($q) => $q->with(self::CHARGE_SNAPSHOT_RELATIONS),
        ];
    }

    /**
     * @return array<string, \Closure>
     */
    public static function eagerLoadChargesWithSnapshotsAndProofs(): array
    {
        return [
            'charges' => fn ($q) => $q->with(self::chargeRelationsWithProofs()),
        ];
    }

    public static function loadSnapshotRelations(Charge $charge): void
    {
        $charge->loadMissing(self::CHARGE_SNAPSHOT_RELATIONS);
    }

    /**
     * @return array{id: int|string|null, name: string|null, phone: string|null}
     */
    public static function identitySnapshot(Charge $charge): array
    {
        self::loadSnapshotRelations($charge);
        if ($charge->expenseParticipant) {
            $p = $charge->expenseParticipant;

            return [
                'id' => $p->id,
                'name' => $p->name,
                'phone' => $p->phone,
            ];
        }
        if ($charge->teamMember) {
            $m = $charge->teamMember;

            return [
                'id' => $m->id,
                'name' => $m->name,
                'phone' => $m->phone,
            ];
        }

        return ['id' => null, 'name' => null, 'phone' => null];
    }

    /**
     * Campo `participant` em {@see ChargeResource} — mesmo formato que {@see ExpenseParticipantResource}.
     *
     * @return array<string, mixed>|null
     */
    public static function participantPayloadForChargeJson(Charge $charge): ?array
    {
        self::loadSnapshotRelations($charge);
        if ($charge->expenseParticipant) {
            return (new ExpenseParticipantResource($charge->expenseParticipant))->resolve(request());
        }
        if ($charge->teamMember) {
            $m = $charge->teamMember;

            return [
                'id' => $m->id,
                'name' => $m->name,
                'phone' => $m->phone,
                'email' => $m->email,
                'role' => 'participant',
                'has_account' => $m->user_id !== null,
                'user_id' => $m->user_id,
                'amount' => $charge->amount,
                'created_at' => $m->created_at,
            ];
        }

        return null;
    }

    /**
     * Lista detalhada no modo gestão do link público (uma linha por cobrança).
     *
     * @return array{id: int|string|null, name: string|null, phone: string|null, charge_id: int, charge_status: mixed, amount: mixed}
     */
    public static function publicManageParticipantRow(Charge $charge): array
    {
        $row = self::identitySnapshot($charge);

        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'phone' => $row['phone'],
            'charge_id' => $charge->id,
            'charge_status' => $charge->status,
            'amount' => $charge->amount,
        ];
    }

    public static function legacyTeamMemberId(Charge $charge): ?int
    {
        self::loadSnapshotRelations($charge);

        return $charge->teamMember?->id;
    }

    public static function expenseParticipantId(Charge $charge): ?int
    {
        self::loadSnapshotRelations($charge);

        return $charge->expenseParticipant?->id;
    }
}
