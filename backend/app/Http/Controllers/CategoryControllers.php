<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    // GET /api/categories -> tất cả danh mục (cha + con, cả đang ẩn)
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::orderBy('thu_tu')
            ->orderBy('id')
            ->get();

        return CategoryResource::collection($categories);
    }
}