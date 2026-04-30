<?php

namespace App\Http\Resources;

use App\Models\Charge;
use App\Support\ChargeParticipantResolver;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChargeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Charge $charge */
        $charge = $this->resource;
        ChargeParticipantResolver::loadSnapshotRelations($charge);

        $participantPayload = ChargeParticipantResolver::participantPayloadForChargeJson($charge);

        return [
            'id' => $this->id,
            'description' => $this->description,
            'amount' => $this->amount,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'paid_at' => $this->paid_at,
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'participant' => $participantPayload,
            'proof_status' => $this->whenLoaded('paymentProofs', function () {
                return $this->paymentProofs->sortByDesc('id')->first()?->status;
            }),
            'has_proof' => $this->whenLoaded('paymentProofs', fn () => $this->paymentProofs->isNotEmpty()),
        ];
    }
}
