import React, { useState } from 'react';
import api from '../api';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(false);
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            // Gunakan Navigate dari react-router-dom untuk pengalaman UX yang lebih baik
            // Namun karena kita belum setup context, pakai window.location dulu tidak apa-apa
            window.location.href = '/dashboard';
        } catch (err) {
            alert("Login Gagal! Jaringan sibuk atau email/password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600/10 text-blue-600 p-4 rounded-full mb-4">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-950">Project Tabungan</h2>
                    <p className="text-slate-500 mt-2">Selamat datang kembali! Silakan masuk.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            required
                            type="email" 
                            placeholder="Alamat Email Anda" 
                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            required
                            type="password" 
                            placeholder="Kata Sandi Minimal 8 Karakter" 
                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition duration-150 shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Mencoba Masuk...' : 'Masuk Sekarang'}
                    </button>
                    
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Atau</span></div>
                    </div>
                    
                    <p className="text-center text-slate-600">
                        Belum punya akun? <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700">Daftar Gratis</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;