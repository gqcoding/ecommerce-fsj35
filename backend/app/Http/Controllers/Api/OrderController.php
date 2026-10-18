<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => Order::where('user_id', $request->user()->id)->with('items')->latest()->get(),
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 404);
        return response()->json(['data' => $order->load('items')]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:25'],
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total' => 0,
            ]);
            $total = 0;

            foreach ($data['items'] as $line) {
                $product = Product::where('active', true)->lockForUpdate()->findOrFail($line['product_id']);
                if ($product->stock < $line['quantity']) {
                    abort(422, "Stock insuficiente para {$product->name}.");
                }
                $unit = (float) $product->price;
                $lineTotal = round($unit * $line['quantity'], 2);
                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $line['quantity'],
                    'unit_price' => $unit,
                    'line_total' => $lineTotal,
                ]);
                $product->decrement('stock', $line['quantity']);
                $total += $lineTotal;
            }

            $order->update(['total' => round($total, 2)]);
            return $order->load('items');
        });

        return response()->json(['data' => $order], 201);
    }

    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate(['order_id' => ['required', 'integer', 'exists:orders,id']]);
        $order = Order::where('user_id', $request->user()->id)->with('items')->findOrFail($data['order_id']);
        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'La orden ya está pagada.'], 422);
        }
        if (!config('services.stripe.secret')) {
            return response()->json(['message' => 'Falta configurar STRIPE_SECRET en el .env de Laravel.'], 503);
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3001')), '/');
        $lineItems = $order->items->map(fn ($item) => [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => ['name' => $item->product_name],
                'unit_amount' => (int) round(((float) $item->unit_price) * 100),
            ],
            'quantity' => $item->quantity,
        ])->all();

        $session = StripeSession::create([
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => $frontend . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontend . '/carrito',
            'metadata' => ['order_id' => (string) $order->id, 'user_id' => (string) $request->user()->id],
        ]);

        $order->update(['stripe_session_id' => $session->id]);
        return response()->json(['url' => $session->url, 'session_id' => $session->id]);
    }
}
