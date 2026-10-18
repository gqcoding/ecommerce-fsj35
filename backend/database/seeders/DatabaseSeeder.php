<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Botella Terra', 'description' => 'Botella reutilizable de diseño minimalista para acompañarte cada día.', 'price' => 18.50, 'stock' => 30],
            ['name' => 'Bolso Forma', 'description' => 'Bolso práctico y versátil para tus esenciales cotidianos.', 'price' => 32.00, 'stock' => 20],
            ['name' => 'Lámpara Aura', 'description' => 'Luz ambiental cálida con una silueta contemporánea.', 'price' => 45.00, 'stock' => 12],
            ['name' => 'Taza Bruma', 'description' => 'Taza cerámica para convertir tu pausa diaria en un ritual.', 'price' => 12.75, 'stock' => 40],
            ['name' => 'Cuaderno Norte', 'description' => 'Cuaderno de tapa resistente para ideas, planes y proyectos.', 'price' => 9.50, 'stock' => 50],
            ['name' => 'Vaso Oliva', 'description' => 'Vaso de líneas simples para tu mesa de todos los días.', 'price' => 14.00, 'stock' => 24],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product + ['active' => true]);
        }
    }
}
