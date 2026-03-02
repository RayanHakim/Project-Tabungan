<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction; // <-- INI WAJIB ADA
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Kita ambil user yang sedang login lewat token
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'User tidak terdeteksi'], 401);
            }

            // Ambil data transaksi milik user tersebut
            $transactions = Transaction::where('user_id', $user->id)
                            ->orderBy('created_at', 'desc')
                            ->get();
            
            // Hitung ringkasan
            $total_masuk = $transactions->where('tipe', 'masuk')->sum('nominal');
            $total_keluar = $transactions->where('tipe', 'keluar')->sum('nominal');

            return response()->json([
                'status' => 'success',
                'data' => $transactions,
                'summary' => [
                    'total_masuk' => (float)$total_masuk,
                    'total_keluar' => (float)$total_keluar,
                    'saldo_akhir' => (float)($total_masuk - $total_keluar)
                ]
            ]);
        } catch (\Exception $e) {
            // Jika error, pesan aslinya akan muncul di React
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'deskripsi' => 'required|string|max:255',
                'tipe' => 'required|in:masuk,keluar',
                'nominal' => 'required|numeric|min:1',
                'kategori' => 'nullable|string'
            ]);

            $transaction = Transaction::create([
                'user_id'   => $request->user()->id,
                'deskripsi' => $validated['deskripsi'],
                'tipe'      => $validated['tipe'],
                'nominal'   => $validated['nominal'],
                'kategori'  => $validated['kategori'] ?? 'Umum',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil dicatat!',
                'data' => $transaction
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal simpan: ' . $e->getMessage()], 500);
        }
    }
}