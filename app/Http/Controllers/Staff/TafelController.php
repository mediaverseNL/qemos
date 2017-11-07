<?php

namespace App\Http\Controllers\Staff;

use App\Http\Requests\StoreTafel;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\Tafel;

class TafelController extends Controller
{
    protected $tafel;

    public function __construct()
    {
        $this->tafel = new Tafel();
        $this->tafel = $this->tafel->where('location_id', '=', $this->location());
    }

    public function location(){
        return session('location');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('staff.tafel.index')->with('tafels', $this->tafel->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTafel $request)
    {
        $tafel = new Tafel();

        $tafel->tafel_nr = $request->tafel_nr;
        $tafel->location_id = $this->location();
        $tafel->floor_id = 1;
        $tafel->aantal_plaatsen = 0;
//        $tafel->status = $request->status;
        $tafel->status =  'zichtbaar';

        $tafel->save();

        return response()->json($tafel, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tafel = $this->tafel->find($id);

        return response()->json($tafel);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'aantal_plaatsen' => 'required',
            'status' => 'required',
        ];
//
        $validator = Validator::make($request->all(), $rules);
//
        if ($validator->fails())
        {
            return  response()->json($validator->getMessageBag()->toArray(), 422); // 400 being the HTTP code for an invalid request.
        }

        $tafel = $this->tafel->find($id);

        $tafel->aantal_plaatsen = $request->aantal_plaatsen;
        $tafel->status = $request->status;

        $tafel->save();

        return response()->json($tafel, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $tafel = $this->tafel->destroy($id);

        return response()->json($tafel);
    }
}
