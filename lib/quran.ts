// equran.id API v2 types and helpers

export interface Surah {
  nomor: number;
  nama: string;        // Arabic name
  namaLatin: string;   // Latin name
  jumlahAyat: number;
  tempatTurun: string; // Makkah / Madinah
  arti: string;        // Indonesian meaning of surah name
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string; jumlahAyat: number } | false;
}

const BASE_URL = 'https://equran.id/api/v2';

export async function getAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surat`, { next: { revalidate: 86400 } }); // cache 24h
  if (!res.ok) throw new Error('Failed to fetch surahs');
  const json = await res.json();
  return json.data;
}

export async function getSurahDetail(nomor: number): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surat/${nomor}`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch surah ${nomor}`);
  const json = await res.json();
  return json.data;
}
