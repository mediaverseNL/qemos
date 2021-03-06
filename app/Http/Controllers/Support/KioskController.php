<?php

namespace App\Http\Controllers\Support;

use App\Kiosk;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class KioskController extends Controller
{
    protected $kiosk;

    public function __construct()
    {
        $this->kiosk = new Kiosk();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('support.kiosk.index')->with('kiosks', $this->kiosk->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('support.kiosk.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $kiosk = $this->kiosk;

        $kiosk->location_id = $request->location_id == 'null' ? null : $request->location_id ;
        $kiosk->model_nr = $request->model_nr;
        $kiosk->api_key = $request->api_key;
        $kiosk->status = $request->status;

        $kiosk->save();

        return redirect()->route('support.kiosk.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return view('support.kiosk.edit')->with('kiosk', $this->kiosk->findOrFail($id));
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
        $kiosk = $this->kiosk->findOrFail($id);

        $kiosk->location_id = $request->location_id == 'null' ? null : $request->location_id ;
        $kiosk->model_nr = $request->model_nr;
        $kiosk->api_key = $request->api_key;
        $kiosk->status = $request->status;

        $kiosk->save();

        return redirect()->route('support.kiosk.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
