<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use App\Http\Resources\SanPhamResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SanPhamController extends Controller
{
    
    public function index()
    {
        $sanPhams = SanPham::latest('ngay_tao')->paginate(10);
        return SanPhamResource::collection($sanPhams);
    }

}