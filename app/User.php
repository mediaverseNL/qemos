<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function userRole()
    {
        return $this->hasMany('App\UserRole', 'user_id', 'id');
    }

    public function order()
    {
        return $this->hasMany('App\Order', 'user_id', 'id');
    }

    public function userLocation()
    {
        return $this->hasMany('App\UserLocation');
    }

    public function locations($transformArr = false)
    {
        $locations = $this->userLocation()->with('location')->get()->pluck('location.adres', 'location.id');

        if($transformArr){
            $a = [];
            foreach ($locations as $i => $v){
                $a[] = [
                    'id' => $i,
                    'location' => $v,
                ];
            }
            return $a;
        }

        return $locations;
    }

    public function locationIds(){
        return collect($this->locations(true))->pluck('id')->toArray();
    }

    public function currentLocation()
    {
        return session('location');
    }

    public function checkRole($roles)
    {
        $user = $this->userRole->pluck('role.role')->toArray();

        foreach ($roles as $role)
        {
            if (in_array($role, $user)){
                return true;
            }
        }

        return false;
    }

}
