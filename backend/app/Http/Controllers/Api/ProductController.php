<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Product::query()->where('active', true)->orderByDesc('created_at')->get(),
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->active, 404);
        return response()->json(['data' => $product]);
    }
}
