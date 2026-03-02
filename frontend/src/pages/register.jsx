import React, { useState } from 'react';
import api from '../api';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(false);
        try {
            await api.post('/register', formData);
            alert("Pendaftaran Berhasil! Sekarang silakan login.");
            window.location.href = '/login';
        } catch (err) {
            alert("Pendaftaran Gagal. Email mungkin sudah digunakan atau password tidak cocok.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-emerald-600/10 text-emerald-600 p-4 rounded-full mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-950">Project Tabungan</h2>
                    <p className="text-slate-500 mt-2">Buat akun barumu sekarang.</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input required type="text" placeholder="Nama Lengkap" className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input required type="email" placeholder="Alamat Email" className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input required type="password" placeholder="Kata Sandi (Min. 8 Karakter)" className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input required type="password" placeholder="Konfirmasi Kata Sandi" className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition" 
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition duration-150 shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-70">
                        {loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
                    </button>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun? <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Masuk ke Sini</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;