'use client';

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Authentication & Edit Status
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Data Dynamic 32 Siswa XI TKJ 3 (Bisa Diedit)
  const [studentsData, setStudentsData] = useState([
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
  ].map((name, index) => {
    let nickname = name.split(' ')[0];
    if (name.includes("M. Rafa Rizky")) nickname = "Rafa";
    else if (nickname.toLowerCase() === 'muhammad' && name.split(' ').length > 1) {
      nickname = name.split(' ')[1];
    }
    return {
      id: index + 1,
      nama: name,
      panggilan: nickname,
      email: `${nickname.toLowerCase()}@smk.sch.id`,
      kelas: 'XI TKJ 3',
      keahlian: 'CyberSecurity',
      hobi: 'Troubleshooting & Web Security',
      citaCita: 'Cyber Security Engineer',
      deskripsi: `Siswa aktif XI TKJ 3 dengan fokus pendalaman di bidang CyberSecurity & Penetration Testing.`
    };
  }));

  // State Edit Profil Form
  const [editFormData, setEditFormData] = useState<any>({});

  // State Komentar XSS khusus per Siswa
  const [studentComments, setStudentComments] = useState<{ [key: number]: Array<{ id: number; name: string; comment: string }> }>({});
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState("<script>alert('XSS Executed!')</script>");

  // State Path Traversal
  const [pathInput, setPathInput] = useState('../../../etc/passwd');
  const [pathResult, setPathResult] = useState<any>(null);

  // Handler Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = loginEmail.trim().toLowerCase();
    
    // Pencocokan Email atau Nama
    const matchedStudent = studentsData.find(s => 
      s.email.toLowerCase() === cleanInput ||
      s.nama.toLowerCase().includes(cleanInput) ||
      s.panggilan.toLowerCase() === cleanInput
    );

    if (matchedStudent) {
      setCurrentUser(matchedStudent);
      alert(`Berhasil login sebagai ${matchedStudent.nama}!`);
    } else {
      alert("Siswa tidak ditemukan! Pastikan nama/email sesuai daftar siswa.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsEditing(false);
  };

  // Handler Edit Profil
  const handleStartEdit = () => {
    setEditFormData({
      hobi: selectedStudent.hobi,
      citaCita: selectedStudent.citaCita,
      keahlian: selectedStudent.keahlian,
      deskripsi: selectedStudent.deskripsi
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedStudents = studentsData.map(s => {
      if (s.id === selectedStudent.id) {
        return { ...s, ...editFormData };
      }
      return s;
    });

    setStudentsData(updatedStudents);
    const updatedSelected = { ...selectedStudent, ...editFormData };
    setSelectedStudent(updatedSelected);
    if (currentUser?.id === selectedStudent.id) {
      setCurrentUser(updatedSelected);
    }
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  // Logika SQLi Search Bar
  const isSqliPayload = searchQuery.includes("'") || 
                        searchQuery.toLowerCase().includes("or") || 
                        searchQuery.includes("1=1") || 
                        searchQuery.includes("1'='1");

  const filteredStudents = studentsData.filter(s => {
    if (!searchQuery.trim()) return true;
    if (isSqliPayload) return true;
    return s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.panggilan.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.keahlian.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handler Komentar Stored XSS
  const handleAddComment = (studentId: number) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: commenterName.trim() || (currentUser ? currentUser.panggilan : 'Pengunjung Anonim'),
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
        content: `root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`,
        explanation: 'Path Traversal Berhasil! File sistem terbaca.'
      });
    } else {
      setPathResult({ content: `[Data Image ${pathInput}]`, explanation: 'File normal.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 px-3.5 py-1.5 rounded-xl text-white font-black text-xl shadow-md">
              TKJ 3
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                XI TKJ 3 Digital Profile
              </h1>
              <p className="text-xs font-semibold text-slate-500">Web Security Practice Lab</p>
            </div>
          </div>

          <nav className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
              >
                Beranda
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'students' || activeTab === 'detail' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
              >
                Daftar Siswa
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
              >
                {currentUser ? `Profil (${currentUser.panggilan})` : 'Login'}
              </button>
              <button
                onClick={() => setActiveTab('vulnerability')}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'vulnerability' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' : 'text-rose-600'}`}
              >
                Lab Keamanan
              </button>
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* TAB BERANDA */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 rounded-3xl text-white shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-5">
                <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">
                  SMK Network & System Administration
                </span>
                <h1 className="text-5xl font-black leading-tight">
                  Profil Resmi & Portfolio Kelas <br />
                  <span className="text-yellow-300">XI TKJ 3</span>
                </h1>
                <p className="text-indigo-100 text-base font-medium">
                  Portal resmi kelas XI TKJ 3. Login untuk mengedit informasi profil Anda sendiri atau jelajahi modul simulasi keamanan web.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('students')} className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg">
                    Eksplor Daftar Siswa
                  </button>
                  <button onClick={() => setActiveTab('login')} className="bg-indigo-950/40 text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 backdrop-blur-md">
                    Login Siswa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB LOGIN */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto space-y-6">
            {!currentUser ? (
              <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Login Siswa XI TKJ 3</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Masuk untuk mengelola dan merubah data profil pribadi Anda.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    {/* Note di atas column command / input login */}
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-xl text-xs font-bold mb-2 flex items-center gap-1.5">
                      <span>💡</span> Note: Disarankan Memakai Email Sekolah (Contoh: aang@smk.sch.id) atau Ketik Nama Siswa
                    </div>
                    
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email / Nama Siswa</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan email/nama (Contoh: Aang)"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                  >
                    Masuk Sekarang
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 text-3xl font-black rounded-full flex items-center justify-center mx-auto">
                  {currentUser.panggilan[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{currentUser.nama}</h2>
                  <p className="text-xs font-bold text-indigo-600">{currentUser.email}</p>
                </div>
                <div className="pt-2 flex gap-3 justify-center">
                  <button
                    onClick={() => { setSelectedStudent(currentUser); setActiveTab('detail'); }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Buka & Edit Profil Saya
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB DAFTAR SISWA */}
        {activeTab === 'students' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Daftar Siswa XI TKJ 3</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Menampilkan {filteredStudents.length} dari {studentsData.length} siswa
                </p>
              </div>
              <input
                type="text"
                placeholder="Cari nama (Coba SQLi: ' OR '1'='1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
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
                  <div className="w-full h-44 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl flex flex-col items-center justify-center relative">
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
                    onClick={() => { setSelectedStudent(student); setIsEditing(false); setActiveTab('detail'); }}
                    className="w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
                  >
                    Lihat Profil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAIL & EDIT PROFIL SISWA */}
        {activeTab === 'detail' && selectedStudent && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setActiveTab('students')} 
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl"
              >
                ← Kembali ke Daftar Siswa
              </button>

              {/* Tampilkan Tombol Edit Jika Siswa Login Sesuai Profil Ini */}
              {currentUser && currentUser.id === selectedStudent.id && !isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5"
                >
                  ✏️ Edit Profil Saya
                </button>
              )}
            </div>

            {/* View Profil / Edit Form */}
            {!isEditing ? (
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
                    <p className="text-xs font-semibold text-slate-400 mt-1">{selectedStudent.email}</p>
                    <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                      {selectedStudent.keahlian}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedStudent.deskripsi}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Minat / Hobi</span>
                      <span className="text-slate-800 font-extrabold text-sm">{selectedStudent.hobi}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Cita-cita</span>
                      <span className="text-slate-800 font-extrabold text-sm">{selectedStudent.citaCita}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MODUL FORM EDIT PROFIL */
              <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-xl space-y-6">
                <h3 className="text-xl font-black text-slate-800 border-b pb-3">Edit Detail Profil ({selectedStudent.panggilan})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Hobi / Minat</label>
                    <input
                      type="text"
                      value={editFormData.hobi}
                      onChange={(e) => setEditFormData({ ...editFormData, hobi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cita - Cita</label>
                    <input
                      type="text"
                      value={editFormData.citaCita}
                      onChange={(e) => setEditFormData({ ...editFormData, citaCita: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Keahlian Utama</label>
                    <input
                      type="text"
                      value={editFormData.keahlian}
                      onChange={(e) => setEditFormData({ ...editFormData, keahlian: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={3}
                      value={editFormData.deskripsi}
                      onChange={(e) => setEditFormData({ ...editFormData, deskripsi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-100 text-slate-600 text-xs font-bold px-6 py-2.5 rounded-xl"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* FITUR KOMENTAR XSS PER SISWA */}
            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-md space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b pb-3">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
                Komentar Pengunjung ({selectedStudent.panggilan})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="text-sm font-bold text-purple-900">Beri Komentar</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nama Anda..."
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs font-medium"
                    />
                    <textarea
                      rows={3}
                      placeholder="Tulis komentar atau payload XSS..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono text-purple-700"
                    />
                    <button
                      onClick={() => handleAddComment(selectedStudent.id)}
                      className="w-full bg-purple-600 text-white font-bold text-xs py-3 rounded-xl shadow-md"
                    >
                      Kirim Komentar
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700">Daftar Komentar</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {(!studentComments[selectedStudent.id] || studentComments[selectedStudent.id].length === 0) ? (
                      <div className="text-xs text-slate-400 italic bg-slate-50 p-6 rounded-2xl border border-dashed text-center">
                        Belum ada komentar untuk {selectedStudent.panggilan}.
                      </div>
                    ) : (
                      studentComments[selectedStudent.id].map((item) => (
                        <div key={item.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-purple-400">{item.name}</div>
                          <div 
                            className="text-xs text-slate-200 font-mono bg-black/40 p-2.5 rounded-lg break-words"
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
            <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-black">Modul Praktikum Keamanan Web (Vulnerable Lab)</h2>
              <p className="text-xs font-medium text-rose-100 mt-1">Simulasi Path Traversal.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-800">Path Traversal</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pathInput}
                  onChange={(e) => setPathInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-xs text-rose-700"
                />
                <button onClick={handlePathSimulate} className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold">
                  Fetch File
                </button>
              </div>
              {pathResult && (
                <div className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-slate-200">
                  <pre className="text-emerald-400">{pathResult.content}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}