'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registrasi gagal');
        return;
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Registrasi berhasil, silakan login manual');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo Area */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-r-blue/20 border-2 border-r-blue mb-4 shadow-[0_0_30px_rgba(84,101,255,0.3)]">
          <i className="fa-solid fa-mosque text-3xl text-r-blue"></i>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Buat Akun Baru</h1>
        <p className="text-r-light/50 text-sm">Mulai perjalanan Ramadhanmu</p>
      </div>

      {/* Register Card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <div>
            <label className="text-r-light/70 text-sm font-medium mb-2 block">Nama Lengkap</label>
            <div className="relative">
              <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-r-light/40"></i>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama"
                required
                className="w-full bg-r-light/5 border border-r-light/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-r-light/30 outline-none focus:border-r-cyan/50 focus:ring-1 focus:ring-r-cyan/30 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-r-light/70 text-sm font-medium mb-2 block">Email</label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-r-light/40"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full bg-r-light/5 border border-r-light/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-r-light/30 outline-none focus:border-r-cyan/50 focus:ring-1 focus:ring-r-cyan/30 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-r-light/70 text-sm font-medium mb-2 block">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-r-light/40"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full bg-r-light/5 border border-r-light/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-r-light/30 outline-none focus:border-r-cyan/50 focus:ring-1 focus:ring-r-cyan/30 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-r-light/70 text-sm font-medium mb-2 block">Konfirmasi Password</label>
            <div className="relative">
              <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-r-light/40"></i>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                required
                className="w-full bg-r-light/5 border border-r-light/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-r-light/30 outline-none focus:border-r-cyan/50 focus:ring-1 focus:ring-r-cyan/30 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-r-blue to-r-cyan rounded-xl text-r-dark font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> Memproses...
              </span>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-r-light/50 text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-r-cyan hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-r-light/30 text-xs mt-8">
        Ramadhan 1447 H • Semoga ibadah kita diterima
      </p>
    </div>
  );
}
