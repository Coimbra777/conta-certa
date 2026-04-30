<?php

namespace Tests\Feature\PublicExpense;

use App\Models\ExpenseParticipant;
use App\Services\PublicExpenseCreatorService;
use App\Support\ParticipantListParser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * POST /api/public/expenses está em standby (middleware → 410).
 * Cenários de persistência usam {@see PublicExpenseCreatorService} diretamente.
 */
class StorePublicExpenseTest extends TestCase
{
    use RefreshDatabase;

    private function baseCreatorPayload(): array
    {
        return [
            'owner_name' => 'Ana',
            'owner_phone' => '11988776655',
            'description' => 'Churras',
            'amount' => 100,
            'pix_key' => 'ana@email.com',
            'due_date' => now()->addDays(5)->format('Y-m-d'),
            'participants' => [
                ['name' => 'Beto', 'phone' => '11911112222'],
                ['name' => 'Cris', 'phone' => '11933334444'],
            ],
        ];
    }

    public function test_post_public_expenses_returns_standby(): void
    {
        $response = $this->postJson('/api/public/expenses', $this->baseCreatorPayload());

        $response->assertStatus(410)
            ->assertJson([
                'success' => false,
                'code' => 'PUBLIC_CREATE_EXPENSE_STANDBY',
            ]);

        $this->assertDatabaseCount('expenses', 0);
    }

    public function test_creator_service_creates_expense_participants_and_charges(): void
    {
        $expense = app(PublicExpenseCreatorService::class)->create($this->baseCreatorPayload());

        $this->assertDatabaseHas('expenses', [
            'description' => 'Churras',
            'owner_name' => 'Ana',
            'owner_phone' => '11988776655',
        ]);

        $this->assertEquals(2, $expense->charges()->count());
        $this->assertEquals(2, ExpenseParticipant::where('expense_id', $expense->id)->count());
        $this->assertTrue(
            $expense->charges()->whereNull('expense_participant_id')->doesntExist()
        );
    }

    public function test_creator_accepts_participants_parsed_from_text(): void
    {
        $text = "Ze 61911112222\nLu 61933334444";
        $parsed = ParticipantListParser::parse($text);
        $this->assertCount(2, $parsed);

        $payload = $this->baseCreatorPayload();
        $payload['description'] = 'Pizza';
        $payload['amount'] = 80;
        $payload['participants'] = $parsed;

        $expense = app(PublicExpenseCreatorService::class)->create($payload);

        $this->assertEquals(2, $expense->charges()->count());
    }

    public function test_include_owner_as_participant_adds_owner_to_split(): void
    {
        $payload = $this->baseCreatorPayload();
        $payload['participants'] = [
            ['name' => 'Ana', 'phone' => '11988776655'],
            ['name' => 'Beto', 'phone' => '11911112222'],
        ];

        $expense = app(PublicExpenseCreatorService::class)->create($payload);

        $this->assertEquals(2, $expense->charges()->count());

        $phones = $expense->charges()->with('expenseParticipant')->get()->map(
            fn ($c) => $c->expenseParticipant?->phone
        )->map(fn ($p) => preg_replace('/\D+/', '', (string) $p))->sort()->values()->all();
        $this->assertEquals(['11911112222', '11988776655'], $phones);

        $total = round((float) $expense->charges()->sum('amount'), 2);
        $this->assertEquals(100.0, $total);
    }

    public function test_include_owner_as_participant_does_not_duplicate_phone(): void
    {
        $payload = $this->baseCreatorPayload();
        $payload['participants'] = [
            ['name' => 'Ana Mesmo', 'phone' => '11988776655'],
            ['name' => 'Beto', 'phone' => '11911112222'],
        ];

        $expense = app(PublicExpenseCreatorService::class)->create($payload);

        $this->assertEquals(2, $expense->charges()->count());
        $this->assertEquals(2, ExpenseParticipant::where('expense_id', $expense->id)->count());
    }

    public function test_public_validate_participant_matches_expense_participant(): void
    {
        $expense = app(PublicExpenseCreatorService::class)->create([
            ...$this->baseCreatorPayload(),
            'participants' => [
                ['name' => 'Beto', 'phone' => '11911112222'],
            ],
        ]);

        $hash = $expense->public_hash;
        $this->postJson("/api/v1/public/expenses/{$hash}/validate-participant", [
            'name' => 'Beto',
            'phone' => '11911112222',
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.can_submit_proof', true)
            ->assertJsonPath('data.amount', 100);
    }

    public function test_public_validate_participant_accepts_valid_landline_phone(): void
    {
        $expense = app(PublicExpenseCreatorService::class)->create([
            ...$this->baseCreatorPayload(),
            'participants' => [
                ['name' => 'Beto', 'phone' => '1133334444'],
            ],
        ]);

        $this->postJson("/api/v1/public/expenses/{$expense->public_hash}/validate-participant", [
            'name' => 'Beto',
            'phone' => '(11) 3333-4444',
        ])->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_public_validate_participant_rejects_invalid_phone_format(): void
    {
        $expense = app(PublicExpenseCreatorService::class)->create([
            ...$this->baseCreatorPayload(),
            'participants' => [
                ['name' => 'Beto', 'phone' => '11911112222'],
            ],
        ]);

        $this->postJson("/api/v1/public/expenses/{$expense->public_hash}/validate-participant", [
            'name' => 'Beto',
            'phone' => '1193334444',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('phone');
    }

    public function test_same_normalized_phone_on_two_expenses_creates_two_participants(): void
    {
        $due = now()->addDays(5)->format('Y-m-d');
        $common = ['name' => 'Beto', 'phone' => '11911112222'];
        $creator = app(PublicExpenseCreatorService::class);

        $creator->create([
            ...$this->baseCreatorPayload(),
            'description' => 'Churras A',
            'amount' => 100,
            'due_date' => $due,
            'participants' => [$common],
        ]);

        $creator->create([
            ...$this->baseCreatorPayload(),
            'description' => 'Churras B',
            'amount' => 200,
            'due_date' => $due,
            'participants' => [$common],
        ]);

        $normalized = preg_replace('/\D+/', '', $common['phone']);
        $this->assertEquals(
            2,
            ExpenseParticipant::where('phone_normalized', $normalized)->count()
        );
    }
}
