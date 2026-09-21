<?php

namespace App\Http\Controllers;

use App\Models\ThuongHieu;
use App\Http\Resources\ThuongHieuResource;
use Illuminate\Http\Request;

class ThuongHieuController extends Controller
{
    public function index()
    {
        $thuongHieus = ThuongHieu::latest('ngay_tao')->paginate(10);
        return ThuongHieuResource::collection($thuongHieus);
    }
}