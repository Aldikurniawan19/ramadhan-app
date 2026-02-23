'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
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
        <h1 className="text-3xl font-bold text-white mb-1">Aplikasi Ramadhan</h1>
        <p className="text-r-light/50 text-sm">Masuk ke akun Anda</p>
      </div>

      {/* Login Card */}
      <div className="bg-r-light/5 border border-r-light/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

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
                placeholder="••••••••"
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
              'Masuk'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-r-light/50 text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-r-cyan hover:underline font-medium">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-r-light/30 text-xs mt-8">
        Ramadhan 1447 H • Semoga ibadah kita diterima
      </p>
      <p className="text-center text-r-light/30 text-xs mt-8">
        © {new Date().getFullYear()} <a href="https://github.com/ramadhan-app" target="_blank" rel="noopener noreferrer" className="text-r-cyan hover:underline font-medium">Ramadhan App</a> by <a href="https://github.com/aldikurniawan19" target="_blank" rel="noopener noreferrer" className="text-r-cyan hover:underline font-medium">Aldikurniawan</a>
      </p>
    </div>
  );
}
