import React, { useEffect, useState } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, PlusCircle, History, LogOut, X, Info, Tag, FileText } from 'lucide-react';
import api from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_masuk: 0, total_keluar: 0, saldo_akhir: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ deskripsi: '', tipe: 'masuk', nominal: '', kategori: 'Umum' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Gagal ambil data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      setShowModal(false);
      setFormData({ deskripsi: '', tipe: 'masuk', nominal: '', kategori: 'Umum' });
      fetchData(); 
    } catch (err) {
      alert("Gagal simpan transaksi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // --- FUNGSI CETAK PDF (VERSI AMAN) ---
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('LAPORAN PROJECT TABUNGAN', 14, 22);
      doc.setFontSize(10);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

      // Tabel 1: Ringkasan
      doc.autoTable({
        startY: 35,
        head: [['Total Pemasukan', 'Total Pengeluaran', 'Saldo Akhir']],
        body: [[
          formatRupiah(summary.total_masuk),
          formatRupiah(summary.total_keluar),
          formatRupiah(summary.saldo_akhir)
        ]],
        headStyles: { fillColor: [37, 99, 235] }
      });

      // Tabel 2: Detail Transaksi
      const tableRows = transactions.map(t => [
        new Date(t.created_at).toLocaleDateString('id-ID'),
        t.deskripsi,
        t.kategori || 'Umum',
        t.tipe === 'masuk' ? 'MASUK' : 'KELUAR',
        formatRupiah(t.nominal)
      ]);

      // Menggunakan fallback '60' jika doc.lastAutoTable tidak terbaca oleh library
      const nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60;

      doc.autoTable({
        head: [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Nominal']],
        body: tableRows,
        startY: nextY,
      });

      doc.save(`Laporan_Tabungan_Rayan.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat mencetak PDF. Pastikan jspdf-autotable sudah terinstall dengan benar.");
    }
  };

  const formatRupiah = (angka) => {
    return Number(angka).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('Rp', 'Rp ');
  };

  // --- LOGIKA GRAFIK (SALDO BERJALAN) ---
  const getChartData = () => {
    let runningBalance = 0;
    return [...transactions]
      .reverse() // Balikkan urutan agar dari yang paling lama ke terbaru
      .map(t => {
        const nominal = parseFloat(t.nominal);
        // Kalau masuk saldo nambah, kalau keluar saldo berkurang
        if (t.tipe === 'masuk') {
          runningBalance += nominal;
        } else {
          runningBalance -= nominal;
        }
        return {
          name: new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
          amount: runningBalance // Data ini yang bikin grafik bisa naik-turun sesuai saldo asli
        };
      })
      .slice(-10); // Tampilkan 10 riwayat terakhir di grafik
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-[#f4f7fa] font-sans text-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-2.5 rounded-xl text-xl">PT</span>
              Project Tabungan
            </h1>
            <p className="text-slate-500 mt-1">Halo, Rayan! Pantau progres tabunganmu.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={exportPDF} className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition font-semibold text-sm shadow-sm">
              <FileText size={18} /> Cetak PDF
            </button>
            <button onClick={() => setShowModal(true)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-100 font-semibold text-sm">
              <PlusCircle size={20} /> Catat
            </button>
            <button onClick={handleLogout} className="bg-white border border-slate-200 text-slate-500 p-3 rounded-xl hover:text-rose-600 transition shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Ringkasan Saldo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <CardSummary title="Total Saldo" amount={summary.saldo_akhir} icon={<Wallet />} color="blue" />
          <CardSummary title="Pemasukan" amount={summary.total_masuk} icon={<ArrowUpCircle />} color="emerald" />
          <CardSummary title="Pengeluaran" amount={summary.total_keluar} icon={<ArrowDownCircle />} color="rose" />
        </div>

        {/* Visualisasi Grafik */}
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 mb-10">
          <h3 className="font-extrabold text-xl text-slate-950 mb-6">Visualisasi Tren Saldo</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `Rp ${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value), "Saldo"]}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel Transaksi */}
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <History className="text-slate-400" size={24} />
              <h3 className="font-extrabold text-2xl text-slate-950">Riwayat Transaksi</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-10">Memuat data...</p>
            ) : transactions.length > 0 ? (
              <table className="w-full text-left">
                <thead className="text-sm text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="pb-4">Deskripsi</th>
                    <th className="pb-4">Kategori</th>
                    <th className="pb-4">Tanggal</th>
                    <th className="pb-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-5 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.tipe === 'masuk' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {t.tipe === 'masuk' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                        </div>
                        <span className="font-semibold">{t.deskripsi}</span>
                      </td>
                      <td className="py-5">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">{t.kategori || 'Umum'}</span>
                      </td>
                      <td className="py-5 text-sm text-slate-500">
                        {new Date(t.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                      </td>
                      <td className={`py-5 text-right font-bold ${t.tipe === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.tipe === 'masuk' ? '+' : '-'} {formatRupiah(t.nominal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-slate-400">Belum ada transaksi tercatat.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Input */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h3 className="text-2xl font-extrabold mb-6 text-slate-950 text-center">Catat Transaksi</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="text" placeholder="Judul Transaksi" className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                <input required type="number" placeholder="Nominal" className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold" onChange={(e) => setFormData({...formData, nominal: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button type="button" onClick={() => setFormData({...formData, tipe: 'masuk'})} className={`py-2 rounded-lg font-bold text-xs ${formData.tipe === 'masuk' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500'}`}>UANG MASUK</button>
                <button type="button" onClick={() => setFormData({...formData, tipe: 'keluar'})} className={`py-2 rounded-lg font-bold text-xs ${formData.tipe === 'keluar' ? 'bg-rose-600 text-white shadow' : 'text-slate-500'}`}>UANG KELUAR</button>
              </div>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Kategori (Opsional)" className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" onChange={(e) => setFormData({...formData, kategori: e.target.value})} />
              </div>
              <button className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition mt-4">Simpan Data</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const CardSummary = ({ title, amount, icon, color }) => {
  const colors = {
    blue: "bg-blue-600/10 text-blue-600",
    emerald: "bg-emerald-600/10 text-emerald-600",
    rose: "bg-rose-600/10 text-rose-600"
  };
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 flex items-start gap-6 hover:translate-y-[-2px] transition-transform">
      <div className={`${colors[color]} p-4 rounded-2xl`}>{React.cloneElement(icon, { size: 28 })}</div>
      <div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <h2 className="text-3xl font-black text-slate-950 mt-1">{Number(amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('Rp', 'Rp ')}</h2>
      </div>
    </div>
  );
};

export default dashboard;