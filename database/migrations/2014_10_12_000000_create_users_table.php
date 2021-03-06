<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->decimal('uurloon', 6, 3)->nullable();
            $table->string('adres', 80)->nullable();
            $table->string('postcode', 6)->nullable();
            $table->string('stad', 60)->nullable();
            $table->integer('lijftijd')->nullable();
            $table->string('telefoon', 12)->nullable();
            $table->string('thuis_telefoon', 12)->nullable();
            $table->string('bsn')->nullable();
            $table->enum('status', ['nvt', 'verwijdert', 'indienst']);
            $table->integer('uren_contract')->nullable();
            $table->boolean('confirmed')->default(0);
            $table->string('confirmation_code')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
