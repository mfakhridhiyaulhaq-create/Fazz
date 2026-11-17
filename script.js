let daftarPemasukan = JSON.parse(localStorage.getItem('daftarPemasukan')) || [];
let daftarPengeluaran = JSON.parse(localStorage.getItem('daftarPengeluaran')) || [];

const gajiLama = parseFloat(localStorage.getItem('totalGaji'));
if (gajiLama > 0 && daftarPemasukan.length === 0) {
    daftarPemasukan.push({ id: Date.now(), sumber: '💰 Pemasukan / Gaji', jumlah: gajiLama });
    localStorage.setItem('daftarPemasukan', JSON.stringify(daftarPemasukan));
    localStorage.removeItem('totalGaji');
}

document.querySelectorAll('.input-rupiah').forEach(input => {
    input.addEventListener('input', function() {
        let angka = this.value.replace(/[^0-9]/g, '');
        this.value = angka ? parseInt(angka, 10).toLocaleString('id-ID') : '';
    });
});

function ambilAngkaMurni(idElement) {
    const nilai = document.getElementById(idElement).value.replace(/\./g, '');
    return parseFloat(nilai) || 0;
}

function tambahCepat(idElement, nominalTambah) {
    const sekarang = ambilAngkaMurni(idElement);
    const totalBaru = sekarang + nominalTambah;
    document.getElementById(idElement).value = totalBaru.toLocaleString('id-ID');
}

function formatRupiah(angka) {
    return "Rp " + Math.round(angka).toLocaleString('id-ID');
}

function bukaTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cekPilihanPengeluaran() {
    const pilihan = document.getElementById('pilihanPengeluaran').value;
    const groupLainnya = document.getElementById('groupInputLainnya');
    
    if (pilihan === 'lainnya') {
        groupLainnya.style.display = 'block';
        document.getElementById('namaPengeluaran').focus();
    } else {
        groupLainnya.style.display = 'none';
        document.getElementById('namaPengeluaran').value = '';
    }
}

function tambahkanEmojiOtomatis(teks) {
    let t = teks.toLowerCase();
    
    if (t.includes('makan') || t.includes('nasi') || t.includes('sarapan') || t.includes('dinner') || t.includes('lunch')) {
        return teks + ' 🍱';
    } else if (t.includes('jajan') || t.includes('snack') || t.includes('camilan') || t.includes('chiki')) {
        return teks + ' 🍟';
    } else if (t.includes('game') || t.includes('top up') || t.includes('diamond') || t.includes('uc')) {
        return teks + ' 🎮';
    } else if (t.includes('minum') || t.includes('boba') || t.includes('kopi') || t.includes('es') || t.includes('tea')) {
        return teks + ' 🧋';
    } else if (t.includes('bensin') || t.includes('pertamax') || t.includes('pertalite') || t.includes('motor') || t.includes('mobil')) {
        return teks + ' ⛽';
    } else if (t.includes('belanja') || t.includes('supermarket') || t.includes('mall')) {
        return teks + ' 🛒';
    } else if (t.includes('pulsa') || t.includes('kuota') || t.includes('internet')) {
        return teks + ' 📱';
    } else if (t.includes('listrik') || t.includes('token') || t.includes('wifi') || t.includes('air')) {
        return teks + ' ⚡';
    } else if (t.includes('obat') || t.includes('dokter')) {
        return teks + ' 💊';
    }
    
    return teks + ' 💸';
}

function tambahPemasukan() {
    const jumlah = ambilAngkaMurni('gaji');

    if (jumlah <= 0) {
        alert("Masukkan nominal pemasukan yang valid!");
        return;
    }

    const dataBaru = {
        id: Date.now(),
        sumber: "💰 Pemasukan / Gaji",
        jumlah: jumlah
    };

    daftarPemasukan.push(dataBaru);
    localStorage.setItem('daftarPemasukan', JSON.stringify(daftarPemasukan));
    document.getElementById('gaji').value = '';

    updateTampilan();
    bukaTab('tab-budget', document.querySelectorAll('.nav-item')[0]);
}

function hapusPemasukan(id) {
    daftarPemasukan = daftarPemasukan.filter(item => item.id !== id);
    localStorage.setItem('daftarPemasukan', JSON.stringify(daftarPemasukan));
    updateTampilan();
}

function tambahPengeluaran() {
    const pilihan = document.getElementById('pilihanPengeluaran').value;
    let nama = "";

    if (pilihan === 'lainnya') {
        nama = document.getElementById('namaPengeluaran').value.trim();
        if (!nama) {
            alert("Silakan ketik nama pengeluaran terlebih dahulu!");
            document.getElementById('namaPengeluaran').focus();
            return;
        }
        nama = tambahkanEmojiOtomatis(nama);
    } else {
        if (pilihan === 'Jajan') nama = 'Jajan 🍟';
        else if (pilihan === 'Makan') nama = 'Makan 🍱';
        else if (pilihan === 'Top Up Game') nama = 'Top Up Game 🎮';
    }

    const jumlah = ambilAngkaMurni('jumlahPengeluaran');
    const kategori = document.getElementById('kategoriPengeluaran').value;

    if (jumlah <= 0) {
        alert("Masukkan nominal pengeluaran dengan benar!");
        return;
    }

    const dataBaru = { id: Date.now(), nama, jumlah, kategori };
    daftarPengeluaran.push(dataBaru);
    localStorage.setItem('daftarPengeluaran', JSON.stringify(daftarPengeluaran));

    // Reset Form
    document.getElementById('pilihanPengeluaran').value = 'Jajan';
    document.getElementById('namaPengeluaran').value = '';
    document.getElementById('groupInputLainnya').style.display = 'none';
    document.getElementById('jumlahPengeluaran').value = '';

    updateTampilan();
    bukaTab('tab-budget', document.querySelectorAll('.nav-item')[0]);
}

function hapusPengeluaran(id) {
    daftarPengeluaran = daftarPengeluaran.filter(item => item.id !== id);
    localStorage.setItem('daftarPengeluaran', JSON.stringify(daftarPengeluaran));
    updateTampilan();
}

function resetSemuaData() {
    if (confirm("Yakin ingin menghapus semua data pemasukan dan pengeluaran untuk memulai dari awal?")) {
        daftarPemasukan = [];
        daftarPengeluaran = [];
        localStorage.removeItem('daftarPemasukan');
        localStorage.removeItem('daftarPengeluaran');
        updateTampilan();
    }
}

function hitungSisaHariBulanIni() {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = sekarang.getMonth();
    const hariIni = sekarang.getDate();
    const totalHariBulanIni = new Date(tahun, bulan + 1, 0).getDate();
    return Math.max(1, (totalHariBulanIni - hariIni) + 1);
}

function updateTampilan() {
    const totalGaji = daftarPemasukan.reduce((total, item) => total + item.jumlah, 0);

    const budgetKebutuhan = totalGaji * 0.5;
    const budgetKeinginan = totalGaji * 0.3;
    const budgetTabungan = totalGaji * 0.2;

    document.getElementById('resKebutuhan').innerText = formatRupiah(budgetKebutuhan);
    document.getElementById('resKeinginan').innerText = formatRupiah(budgetKeinginan);
    document.getElementById('resTabungan').innerText = formatRupiah(budgetTabungan);

    const tbodyMasuk = document.getElementById('listPemasukan');
    tbodyMasuk.innerHTML = daftarPemasukan.length === 0 
        ? '<tr><td colspan="3" class="empty-text">Belum ada pemasukan dicatat</td></tr>' : '';
    
    daftarPemasukan.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.sumber}</td>
            <td style="color:#27ae60; font-weight:600;">+${formatRupiah(item.jumlah)}</td>
            <td><button class="btn-hapus" onclick="hapusPemasukan(${item.id})">Hapus</button></td>
        `;
        tbodyMasuk.appendChild(tr);
    });

    let pengeluaranKebutuhan = 0;
    let pengeluaranKeinginan = 0;
    let pengeluaranTabungan = 0;

    const tbodyKeluar = document.getElementById('listPengeluaran');
    tbodyKeluar.innerHTML = daftarPengeluaran.length === 0 
        ? '<tr><td colspan="4" class="empty-text">Belum ada pengeluaran dicatat</td></tr>' : '';

    daftarPengeluaran.forEach(item => {
        if (item.kategori === 'kebutuhan') pengeluaranKebutuhan += item.jumlah;
        if (item.kategori === 'keinginan') pengeluaranKeinginan += item.jumlah;
        if (item.kategori === 'tabungan') pengeluaranTabungan += item.jumlah;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td style="text-transform: capitalize;">${item.kategori}</td>
            <td style="color:#e74c3c; font-weight:600;">-${formatRupiah(item.jumlah)}</td>
            <td><button class="btn-hapus" onclick="hapusPengeluaran(${item.id})">Hapus</button></td>
        `;
        tbodyKeluar.appendChild(tr);
    });

    const totalKeluar = pengeluaranKebutuhan + pengeluaranKeinginan + pengeluaranTabungan;
    const sisaTotal = totalGaji - totalKeluar;

    document.getElementById('displayTotalGaji').innerText = formatRupiah(totalGaji);
    document.getElementById('displayTotalKeluar').innerText = formatRupiah(totalKeluar);
    document.getElementById('displaySisaTotal').innerText = formatRupiah(sisaTotal);

    const elPersen = document.getElementById('persenTerpakai');
    const elStatus = document.getElementById('statusKeuangan');
    const elSisaHari = document.getElementById('sisaHariBulan');
    const elHarian = document.getElementById('estimasiHarian');

    const sisaHari = hitungSisaHariBulanIni();
    elSisaHari.innerText = sisaHari;

    if (totalGaji <= 0) {
        elPersen.innerText = "0%";
        elStatus.innerText = "Belum Ada Saldo";
        elStatus.className = "status-badge badge-neutral";
        elHarian.innerText = "Rp 0/hari";
    } else {
        const persen = Math.round((totalKeluar / totalGaji) * 100);
        elPersen.innerText = persen + "%";

        if (persen < 60) {
            elStatus.innerText = "🟢 Aman";
            elStatus.className = "status-badge badge-safe";
        } else if (persen <= 85) {
            elStatus.innerText = "🟡 Waspada";
            elStatus.className = "status-badge badge-warn";
        } else {
            elStatus.innerText = "🔴 Kritis";
            elStatus.className = "status-badge badge-danger";
        }

        const sisaBelanja = (budgetKebutuhan - pengeluaranKebutuhan) + (budgetKeinginan - pengeluaranKeinginan);
        const danaHarian = sisaBelanja > 0 ? (sisaBelanja / sisaHari) : 0;
        elHarian.innerText = formatRupiah(danaHarian) + "/hari";
    }

    updateKategoriUI('Kebutuhan', budgetKebutuhan, pengeluaranKebutuhan);
    updateKategoriUI('Keinginan', budgetKeinginan, pengeluaranKeinginan);
    updateKategoriUI('Tabungan', budgetTabungan, pengeluaranTabungan);
}

function updateKategoriUI(namaKategori, budget, terpakai) {
    const sisa = budget - terpakai;
    const elSisa = document.getElementById(`sisa${namaKategori}`);
    const elBar = document.getElementById(`bar${namaKategori}`);
    const elCard = document.getElementById(`card${namaKategori}`);
    const elAlert = document.getElementById(`alert${namaKategori}`);

    elSisa.innerText = formatRupiah(sisa);

    if (sisa < 0) {
        elSisa.style.color = '#c0392b';
        elCard.classList.add('over-budget-card');
        elAlert.style.display = 'inline-block';
        elBar.style.width = '100%';
        elBar.style.backgroundColor = '#e74c3c';
    } else {
        elSisa.style.color = 'inherit';
        elCard.classList.remove('over-budget-card');
        elAlert.style.display = 'none';
        elBar.style.backgroundColor = '';

        let persenSisa = budget > 0 ? Math.max(0, Math.min(100, (sisa / budget) * 100)) : 0;
        elBar.style.width = persenSisa + '%';
    }
}

function eksporKeExcel() {
    if (daftarPengeluaran.length === 0 && daftarPemasukan.length === 0) {
        alert("Belum ada data untuk diekspor!");
        return;
    }

    let htmlExcel = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/1999/xhtml">
        <head><meta charset="UTF-8"></head>
        <body>
        <table border="1">
            <tr><th colspan="3" style="font-size:16px; font-weight:bold;">LAPORAN KEUANGAN</th></tr>
            <tr><th colspan="3" style="background:#dff0d8;">PEMASUKAN</th></tr>
            <tr><th>Sumber</th><th colspan="2">Jumlah (Rp)</th></tr>
    `;

    daftarPemasukan.forEach(item => {
        htmlExcel += `<tr><td>${item.sumber}</td><td colspan="2">${item.jumlah}</td></tr>`;
    });

    htmlExcel += `
            <tr><th colspan="3" style="background:#f2dede;">PENGELUARAN</th></tr>
            <tr><th>Nama Pengeluaran</th><th>Kategori Dana</th><th>Jumlah (Rp)</th></tr>
    `;

    daftarPengeluaran.forEach(item => {
        htmlExcel += `<tr><td>${item.nama}</td><td>${item.kategori}</td><td>${item.jumlah}</td></tr>`;
    });

    htmlExcel += '</table></body></html>';

    const uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(htmlExcel);
    const a = document.createElement('a');
    a.href = uri;
    a.download = 'Laporan_Keuangan.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

updateTampilan();
