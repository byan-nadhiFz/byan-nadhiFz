'use client';

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Komentar XSS khusus per Siswa (Key: studentId)
  const [studentComments, setStudentComments] = useState<{ [key: number]: Array<{ id: number; name: string; comment: string }> }>({
    1: [{ id: 1, name: 'Pengunjung', comment: 'Halo Aang, semangat belajar TKJ!' }]
  });
  
  // State Form Komentar Aktif
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState("<script>alert('XSS Executed!')</script>");

  // State Praktikum Keamanan Lainnya
  const [pathInput, setPathInput] = useState('../../../etc/passwd');
  const [pathResult, setPathResult] = useState<any>(null);

  // Data Lengkap 32 Siswa XI TKJ 3
  const studentNames = [
    "Aang Burhanudin Badsah", "Adinda Ramadhani", "Anantadewa Wiwasata Putra Maharani",
    "Annisa Ramadhani Putri Adiwanto", "Ariel Ardanta Nurrohman Reyhandy", "Bima Gusto Mahatsafa",
    "Byantara Al Hakim Nadhif", "Cleosya Kapita Bilqist", "Devina Aurelia Hapsari",
    "Ezar Brilliant Sugiono", "Farhan Auliya Abrar", "Flavia Annisa Kurniawan",
    "Gusti Putra Khakim Khaqiqi", "Hatta Muhlasin Luhtari", "Intan Alshani Raffisya",
    "Iqbal Ilmi", "Ivander Ardell Alvaro", "Kenza Almira Yasmin",
    "M. Rafa Rizky Effendi", "Mochammad Davin Al Fida", "Muhammad Faris Anshori",
    "Muhammad Hamizan Zuhri", "Muhammad Kemal Faza", "Muhammad Rifqi Nasywan Athallah",
    "Nazriel Abiy Putra Veangga", "Nizar Zulmi Firmansyah", "Radine Dygtastya Rahmadhani",
    "Rahel Maryam", "Satria Banyu Seki", "Valvizzy Piscesio Lois",
    "Yohan Alim Wijaya", "Ziyadatul Ilman Nafiah"
  ];

  const getNickname = (fullName: string) => {
    if (fullName.includes("M. Rafa Rizky")) {
      return "Rafa";
    }
    const parts = fullName.split(' ');
    if (parts[0].toLowerCase() === 'muhammad' && parts.length > 1) {
      return parts[1];
    }
    return parts[0];
  };

  const students = studentNames.map((name, index) => {
    const nickname = getNickname(name);
    return {
      id: index + 1,
      nama: name,
      panggilan: nickname,
      kelas: 'XI TKJ 3',
      keahlian: 'CyberSecurity',
      hobi: 'Troubleshooting & Web Security',
      citaCita: 'Cyber Security Engineer',
      deskripsi: `Siswa aktif XI TKJ 3 dengan fokus pendalaman di bidang CyberSecurity & Penetration Testing.`
    };
  });

  // Logika Simulasi SQL Injection di Search Bar
  const isSqliPayload = searchQuery.includes("'") || 
                        searchQuery.toLowerCase().includes("or") || 
                        searchQuery.includes("1=1") || 
                        searchQuery.includes("1'='1");

  const filteredStudents = students.filter(s => {
    if (!searchQuery.trim()) return true;
    if (isSqliPayload) return true; // Bypass Query SQLi
    return s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.panggilan.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.keahlian.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handler Kirim Komentar (Vulnerable to Stored XSS)
  const handleAddComment = (studentId: number) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      name: commenterName.trim() || 'Pengunjung Anonim',
      comment: commentText
    };

    setStudentComments(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), newComment]
    }));

    setCommentText('');
  };

  const handlePathSimulate = () => {
    if (pathInput.includes('../') || pathInput.includes('..\\')) {
      setPathResult({
        fileRequested: pathInput,
        status: 'EXPOSED',
        content: `root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nmariadb:x:999:999:MariaDB Server:/var/lib/mysql:/bin/false`,
        explanation: 'Path Traversal Berhasil! Aplikasi membaca file sensitif sistem di luar direktori publik.'
      });
    } else {
      setPathResult({
        fileRequested: pathInput,
        status: 'NORMAL',
        content: `[Binary Image Data of ${pathInput}]`,
        explanation: 'File foto normal dibaca dari direktori publik.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 px-3.5 py-1.5 rounded-xl text-white font-black text-xl shadow-md shadow-indigo-200">
              TKJ 3
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                XI TKJ 3 Digital Profile
              </h1>
              <p className="text-xs font-semibold text-slate-500">Web Security Practice Lab</p>
            </div>
          </div>

          <nav className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'students' || activeTab === 'detail'
                  ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Daftar Siswa
            </button>
            <button
              onClick={() => setActiveTab('vulnerability')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'vulnerability'
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md shadow-red-200'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Lab Keamanan
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* BERANDA */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <div className="relative z-10 max-w-2xl space-y-5">
                <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  SMK Network & System Administration
                </span>
                <h1 className="text-5xl font-black leading-tight">
                  Profil Resmi & Portfolio Kelas <br />
                  <span className="text-yellow-300">XI TKJ 3</span>
                </h1>
                <p className="text-indigo-100 text-base font-medium leading-relaxed">
                  Selamat datang di portal resmi kelas XI TKJ 3. Wadah kreativitas, daftar siswa, serta pusat pembelajaran interaktif simulasi analisis kerentanan keamanan web.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('students')}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-transform active:scale-95"
                  >
                    Eksplor Daftar Siswa
                  </button>
                  <button
                    onClick={() => setActiveTab('vulnerability')}
                    className="bg-indigo-950/40 hover:bg-indigo-950/60 text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 backdrop-blur-md transition-transform active:scale-95"
                  >
                    Buka Lab Keamanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DAFTAR SISWA */}
        {activeTab === 'students' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Daftar Siswa XI TKJ 3</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Menampilkan {filteredStudents.length} dari 32 siswa
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama (Coba SQLi: ' OR '1'='1)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {isSqliPayload && (
              <div className="bg-slate-900 border border-amber-500/50 p-4 rounded-2xl text-xs font-mono text-amber-400 space-y-1">
                <div className="font-bold text-amber-300">⚠️ Live Query Executed (Vulnerable to SQLi):</div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">SELECT</span> * <span className="text-emerald-400">FROM</span> students <span className="text-emerald-400">WHERE</span> name = '{searchQuery}';
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="group bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="w-full h-44 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                    <span className="text-5xl font-black bg-gradient-to-tr from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                      {student.panggilan[0]}
                    </span>
                    <span className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-200/50 px-3 py-1 rounded-full">
                      {student.panggilan}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 line-clamp-1">{student.nama}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                      {student.keahlian}
                    </p>
                  </div>

                  <button
                    onClick={() => { setSelectedStudent(student); setActiveTab('detail'); }}
                    className="w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
                  >
                    Lihat Profil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAIL SISWA & FITUR XSS KOMENTAR TERPISAH */}
        {activeTab === 'detail' && selectedStudent && (
          <div className="space-y-6">
            <button 
              onClick={() => setActiveTab('students')} 
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
            >
              ← Kembali ke Daftar Siswa
            </button>

            {/* Header Profil */}
            <div className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full h-64 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-inner">
                <span className="text-7xl font-black">{selectedStudent.panggilan[0]}</span>
                <span className="mt-3 text-sm font-bold bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                  {selectedStudent.panggilan}
                </span>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-800">{selectedStudent.nama}</h1>
                  <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {selectedStudent.keahlian}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedStudent.deskripsi}</p>
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px] tracking-wider">Nama Panggilan</span>
                    <span className="text-slate-800 font-extrabold text-sm">{selectedStudent.panggilan}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px] tracking-wider">Kelas</span>
                    <span className="text-indigo-600 font-extrabold text-sm">{selectedStudent.kelas}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION FITUR XSS: Form Input Komentar & Hasil Komentar Sebelahnya */}
            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
                    Komentar Pengunjung ({selectedStudent.panggilan})
                  </h3>
                  <p className="text-xs text-purple-600 font-semibold mt-0.5">
                    Modul Stored XSS Practice: Komentar ini disimpan khusus untuk profil {selectedStudent.nama}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* KIRI: Form Input Komentar */}
                <div className="space-y-4 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="text-sm font-bold text-purple-900">Beri Komentar Pengunjung</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Nama Pengunjung</label>
                      <input
                        type="text"
                        placeholder="Masukkan nama Anda..."
                        value={commenterName}
                        onChange={(e) => setCommenterName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Isi Komentar (Vulnerable XSS Input)</label>
                      <textarea
                        rows={3}
                        placeholder="Tulis komentar atau payload XSS..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      onClick={() => handleAddComment(selectedStudent.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-purple-200 transition-all active:scale-95"
                    >
                      Kirim Komentar Ke {selectedStudent.panggilan}
                    </button>
                  </div>
                </div>

                {/* KANAN: Hasil Komentar Siswa Ini */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700">Daftar Komentar Terpublikasi</h4>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(!studentComments[selectedStudent.id] || studentComments[selectedStudent.id].length === 0) ? (
                      <div className="text-xs text-slate-400 italic bg-slate-50 p-6 rounded-2xl border border-dashed text-center">
                        Belum ada komentar untuk {selectedStudent.panggilan}. Jadilah yang pertama berkomentar!
                      </div>
                    ) : (
                      studentComments[selectedStudent.id].map((item) => (
                        <div key={item.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-purple-400 flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono">ID: #{item.id.toString().slice(-4)}</span>
                          </div>
                          {/* Rendering langsung tanpa sanitasi/escape -> Memicu Stored XSS */}
                          <div 
                            className="text-xs text-slate-200 font-mono bg-black/40 p-2.5 rounded-lg border border-purple-900/40 break-words"
                            dangerouslySetInnerHTML={{ __html: item.comment }} 
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAB KEAMANAN LAINNYA */}
        {activeTab === 'vulnerability' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6 rounded-2xl shadow-lg shadow-rose-200">
              <h2 className="text-2xl font-black">Modul Praktikum Keamanan Web (Vulnerable Lab)</h2>
              <p className="text-xs font-medium text-rose-100 mt-1">
                Simulasi kerentanan Path Traversal untuk bahan analisis tugas keamanan web.
              </p>
            </div>

            {/* Path Traversal Lab */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="text-base font-black text-slate-800">Path Traversal</h3>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pathInput}
                  onChange={(e) => setPathInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-xs text-rose-700 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button 
                  onClick={handlePathSimulate} 
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all"
                >
                  Fetch File
                </button>
              </div>
              {pathResult && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <pre className="bg-black/50 p-3 rounded-lg text-emerald-400 font-mono overflow-x-auto">{pathResult.content}</pre>
                  <p className="text-slate-300">{pathResult.explanation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}