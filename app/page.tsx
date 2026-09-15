"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State Praktikum Keamanan Web
  const [sqliInput, setSqliInput] = useState("");
  const [sqliResult, setSqliResult] = useState<any>(null);

  const [xssInput, setXssInput] = useState("");
  const [xssCommentList, setXssCommentList] = useState<
    { id: number; name: string; comment: string }[]
  >([
    { id: 1, name: "Aang Burhanudin Badsah", comment: "Halo kawan-kawan XI TKJ 3!" },
  ]);

  const [pathInput, setPathInput] = useState("../../etc/passwd");
  const [pathResult, setPathResult] = useState<any>(null);

  // Data Lengkap 32 Siswa XI TKJ 3
  const studentNames = [
    "Aang Burhanudin Badsah",
    "Adinda Ramadhani",
    "Anisa Septia Nur Aini",
    "Annisa Ramadhani Putri Adiwanto",
    "Ariel Ardanta",
    "Azkia Safira",
    "Byantara Al Hakim Nadhif",
    "Cleosya Kapila Bilqis",
    "Dewi Lestari",
    "Ezar Brilliant Sugiono",
    "Farhan Auliya Abrar",
    "Ferdinand Silva",
    "Gusti Putra Hakim Khaqiqi",
    "Hatta Muhlasin Luhur",
    "Indra Pratama",
    "Iqbal Ilmi",
    "Ivander Ardell Alvaro",
    "Kenza Almeira",
    "M. Rafa Rizky Effendi",
    "Mochammad Davin Al Fidan",
    "Muhammad Fakhri",
    "Muhammad Hamizan Zuhri",
    "Muhammad Kemal Raza",
    "Nabilah Putri",
    "Nazriel Ahiy Putra Veangga",
    "Nizar Zulmi Firmansyah",
    "Putri Amelia",
    "Rahel Maryam",
    "Satria Banyu Seki",
    "Valvizzy Prameswari",
    "Yohan Alim Wijaya",
    "Ziyadatul Ilman Nafiah",
  ];

  // Logika Khusus Nama Panggilan (M. Rafa Rizky -> rafa)
  const getNickname = (fullName: string) => {
    if (fullName.includes("M. Rafa Rizky")) return "rafa";
    if (fullName.includes("Byantara Al Hakim Nadhif")) return "Byan";
    if (fullName.includes("Aang Burhanudin Badsah")) return "Aang";
    if (fullName.includes("Ezar Brilliant Sugiono")) return "Ezar";
    if (fullName.includes("Ivander Ardell Alvaro")) return "Ivander";
    return fullName.split(" ")[0];
  };

  const filteredStudents = studentNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      {/* Header Navigation */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-8 gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-xl text-lg">
            TKJ 3
          </span>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">
              XI TKJ 3 Digital Profile
            </h1>
            <p className="text-xs text-slate-500">Web Security Practice Lab</p>
          </div>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 font-medium rounded-xl text-sm transition ${
              activeTab === "home"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 font-medium rounded-xl text-sm transition ${
              activeTab === "students"
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daftar Siswa
          </button>
          <button
            onClick={() => setActiveTab("lab")}
            className={`px-4 py-2 font-medium rounded-xl text-sm transition ${
              activeTab === "lab"
                ? "bg-rose-100 text-rose-700 shadow-sm"
                : "text-rose-600 hover:text-rose-700"
            }`}
          >
            Lab Keamanan
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      {activeTab === "home" && (
        <>
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-8">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              SMK TELKOM MALANG
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Profil Resmi & Portfolio <br /> Kelas XI TKJ 3
            </h2>
            <p className="text-blue-50 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              Selamat datang di portal resmi kelas XI TKJ 3. Wadah kreativitas, daftar siswa, serta pusat pembelajaran interaktif simulasi analisis kerentanan keamanan web.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab("students")}
                className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-50 transition"
              >
                Eksplor Daftar Siswa
              </button>
              <button
                onClick={() => setActiveTab("lab")}
                className="bg-blue-900/40 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-blue-900/60 transition"
              >
                Buka Lab Keamanan
              </button>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 font-bold text-xl px-4 py-3 rounded-xl">
                32
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Siswa</p>
                <p className="font-bold text-slate-800">Siswa Terdaftar</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 font-bold text-xl px-3 py-3 rounded-xl">
                DB
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Database Engine</p>
                <p className="font-bold text-slate-800">MariaDB System</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-rose-100 text-rose-600 font-bold text-xl px-3 py-3 rounded-xl">
                LAB
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Fokus Praktikum</p>
                <p className="font-bold text-slate-800">SQLi, XSS, Path</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Tab Daftar Siswa */}
      {activeTab === "students" && (
        <section className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Daftar Siswa XI TKJ 3</h2>
              <p className="text-sm text-slate-500">32 Anggota Kelas Terdaftar</p>
            </div>
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStudents.map((name, index) => (
              <div
                key={index}
                onClick={() => setSelectedStudent(name)}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-800 text-sm">{name}</p>
                  <p className="text-xs text-blue-600 font-medium">
                    Panggilan: "{getNickname(name)}"
                  </p>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-400">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab Lab Keamanan */}
      {activeTab === "lab" && (
        <section className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-rose-600">Simulasi Lab Keamanan Web</h2>
            <p className="text-sm text-slate-500">
              Modul Praktikum Kerentanan Keamanan Aplikasi Web untuk XI TKJ 3
            </p>
          </div>

          <div className="space-y-8">
            {/* SQL Injection Lab */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">1. SQL Injection (SQLi) Practice</h3>
              <p className="text-xs text-slate-500 mb-4">
                Uji pencarian pengguna dengan payload SQL Injection (Contoh: <code className="bg-slate-200 px-1 py-0.5 rounded">' OR '1'='1</code>)
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Masukkan Username / Query..."
                  value={sqliInput}
                  onChange={(e) => setSqliInput(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSqliResult(sqliInput.includes("' OR '1'='1") ? studentNames : [sqliInput])}
                  className="bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  Eksekusi
                </button>
              </div>
              {sqliResult && (
                <div className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono">
                  <p className="text-slate-400 mb-2">// Direct Query Result:</p>
                  {Array.isArray(sqliResult) ? (
                    sqliResult.map((item, idx) => <p key={idx}>- {item}</p>)
                  ) : (
                    <p>{sqliResult}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}