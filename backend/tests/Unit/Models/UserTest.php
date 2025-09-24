<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_user_has_expected_fillable_attributes(): void
    {
        $user = new User();

        $this->assertEquals([
            'name',
            'email',
            'password',
        ], $user->getFillable());
    }

    public function test_user_has_expected_hidden_attributes(): void
    {
        $user = new User();

        $this->assertContains('password', $user->getHidden());
        $this->assertContains('remember_token', $user->getHidden());
    }

    public function test_user_has_expected_casts(): void
    {
        $user = new User();

        $this->assertArrayHasKey('email_verified_at', $user->getCasts());
        $this->assertEquals('datetime', $user->getCasts()['email_verified_at']);
        $this->assertArrayHasKey('password', $user->getCasts());
        // Note: Laravel 10 doesn't use 'hashed' cast by default, it uses mutator
    }

    public function test_user_password_is_hashed_when_set(): void
    {
        $user = new User();
        $plainPassword = 'plain_password';
        
        $user->password = $plainPassword;
        
        $this->assertTrue(Hash::check($plainPassword, $user->password));
        $this->assertNotEquals($plainPassword, $user->password);
    }

    public function test_user_attributes(): void
    {
        $user = new User();

        $this->assertContains('name', $user->getFillable());
        $this->assertContains('email', $user->getFillable());
        $this->assertContains('password', $user->getFillable());
    }
}
