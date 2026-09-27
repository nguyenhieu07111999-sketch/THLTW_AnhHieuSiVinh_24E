<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::active()                        // scope ở Model
            ->whereNull('parent_id')                            // chỉ lấy danh mục cha
            ->with(['children' => fn ($q) => $q->active()])     
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }
}