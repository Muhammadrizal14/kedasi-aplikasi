function tampilkanMenu(topik) {
    const konten = document.getElementById("konten");
    let judul = "";
    let idPrefix = "";
    let videoSrc = "";

    // Menentukan judul dan video berdasarkan topik
    switch (topik) {
        case 'gunung':
            judul = "Gunung Meletus";
            idPrefix = "gunung meletus";
            videoSrc = "gunung-meletus.mp4";
            break;
        case 'gempa':
            judul = "Gempa Bumi";
            idPrefix = "gempa";
            videoSrc = "gempa-bumi.mp4";
            break;
        case 'bullying':
            judul = "Bullying";
            idPrefix = "bullying";
            videoSrc = "bullying.mp4";
            break;
    }

    konten.innerHTML = `
        <h2>${judul}</h2>
        <video width="100%" height="auto" controls>
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        
        <form id="form_${idPrefix}">
            <label><strong>Judul Teks:</strong></label><br>
            <input type="text" id="${idPrefix}_judul" placeholder="Tulis judul teks..."><br><br>

            <label><strong>Pernyataan Umum:</strong></label><br>
            <textarea id="${idPrefix}_pernyataan" placeholder="Tulis pernyataan umum..."></textarea><br><br>

            <label><strong>Deretan Penjelas:</strong></label><br>
            <textarea id="${idPrefix}_penjelas" placeholder="Tulis penjelasan proses..."></textarea><br><br>

            <label><strong>Interpretasi / Kesimpulan:</strong></label><br>
            <textarea id="${idPrefix}_kesimpulan" placeholder="Tulis kesimpulan..."></textarea><br><br>

            <button type="button" onclick="simpanLatihan('${idPrefix}')">Simpan</button>
            <button type="button" onclick="koreksiTeks('${idPrefix}')">Koreksi</button>
            <button type="reset">Reset</button>
        </form>

        <div id="hasil_${idPrefix}" style="margin-top: 20px;"></div>
        <div id="feedback_${idPrefix}" style="margin-top: 10px;"></div>
    `;
}

function simpanLatihan(prefix) {
    const judul = document.getElementById(`${prefix}_judul`).value.trim();
    const pernyataan = document.getElementById(`${prefix}_pernyataan`).value.trim();
    const penjelas = document.getElementById(`${prefix}_penjelas`).value.trim();
    const kesimpulan = document.getElementById(`${prefix}_kesimpulan`).value.trim();

    if (!judul || !pernyataan || !penjelas || !kesimpulan) {
        alert("Silakan lengkapi semua bagian sebelum menyimpan dokumen.");
        return;
    }

    const isiDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Dokumen KEDASI</title></head>
        <body>
            <h2 style="text-align: center;">${judul}</h2>
            <p><strong>Pernyataan Umum:</strong><br>${pernyataan}</p>
            <p><strong>Deretan Penjelas:</strong><br>${penjelas}</p>
            <p><strong>Interpretasi / Kesimpulan:</strong><br>${kesimpulan}</p>
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', isiDoc], {
        type: 'application/msword'
    });

    const namaFile = `${prefix}_latihan.doc`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = namaFile;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function koreksiTeks(prefix) {
    const judul = document.getElementById(`${prefix}_judul`).value.trim();
    const pernyataan = document.getElementById(`${prefix}_pernyataan`).value.trim();
    const penjelas = document.getElementById(`${prefix}_penjelas`).value.trim();
    const kesimpulan = document.getElementById(`${prefix}_kesimpulan`).value.trim();

    let feedback = "";
    let adaKesalahan = false; // Tambahkan flag untuk memeriksa kesalahan

    const kataKunciTopik = {
        "gunung meletus": ["magma", "letusan", "lava", "abu", "vulkanik", "gunung api"],
        "gempa": ["lempeng", "seismik", "tektonik", "getaran", "retakan", "episentrum"],
        "bullying": ["kekerasan", "pelecehan", "korban", "pelaku", "verbal", "fisik", "intimidasi"]
    };

    const kataKunci = kataKunciTopik[prefix];
    
    // ======== 1. JUDUL ========
    if (judul === "") {
        feedback += "❌ <strong>Judul</strong> belum diisi.<br>";
        adaKesalahan = true;
    } else if (!judul.toLowerCase().includes(prefix)) {
        feedback += `⚠️ <strong>Judul</strong> belum menyebutkan topik dengan jelas. Pastikan judul mengandung kata "<em>${prefix}</em>".<br>`;
        adaKesalahan = true;
    } else {
        feedback += "✅ <strong>Judul</strong> sudah sesuai dengan topik.<br>";
    }

    // ======== 2. PERNYATAAN UMUM ========
    if (pernyataan === "") {
        feedback += "❌ <strong>Pernyataan Umum</strong> belum diisi.<br>";
        adaKesalahan = true;
    } else {
        let poin = 0;

        // a. Definisi
        if (/(adalah|merupakan|ialah|yakni|disebut sebagai)/i.test(pernyataan)) {
            feedback += "✅ <strong>Pernyataan Umum</strong> sudah memuat definisi.<br>";
            poin++;
        } else {
            feedback += `⚠️ <strong>Pernyataan Umum</strong> sebaiknya mengandung kata seperti <em>adalah</em>, <em>merupakan</em>, dll.<br>`;
            adaKesalahan = true;
        }

        // b. Relevansi topik
        const cocok = kataKunci.some(kata => pernyataan.toLowerCase().includes(kata));
        if (cocok) {
            feedback += "✅ <strong>Pernyataan Umum</strong> sesuai dengan topik.<br>";
            poin++;
        } else {
            feedback += `⚠️ <strong>Pernyataan Umum</strong> belum menunjukkan topik <em>${prefix}</em> dengan jelas.<br>`;
            feedback += `💡 Sertakan kata seperti <em>${kataKunci.slice(0, 4).join("</em>, <em>")}...</em><br>`;
            adaKesalahan = true;
        }

        if (poin === 2) {
            feedback += "🎯 <em>Pernyataan Umum sangat baik!</em><br>";
        }
    }

    // ======== 3. DERETAN PENJELAS ========
    if (penjelas === "") {
        feedback += "❌ <strong>Deretan Penjelas</strong> belum diisi.<br>";
        adaKesalahan = true;
    } else {
        let poin = 0;

        // a. Kata penghubung proses
        if (/(karena|sehingga|akibatnya|pertama|kemudian|selanjutnya|akhirnya)/i.test(penjelas)) {
            feedback += "✅ <strong>Deretan Penjelas</strong> sudah menjelaskan proses secara logis.<br>";
            poin++;
        } else {
            feedback += `⚠️ <strong>Deretan Penjelas</strong> belum menjelaskan proses atau sebab-akibat dengan jelas.<br>`;
            feedback += `💡 Gunakan kata seperti <em>karena</em>, <em>sehingga</em>, dll.<br>`;
            adaKesalahan = true;
        }

        // b. Relevansi topik
        const cocok = kataKunci.some(kata => penjelas.toLowerCase().includes(kata));
        if (cocok) {
            feedback += "✅ <strong>Deretan Penjelas</strong> sesuai dengan topik.<br>";
            poin++;
        } else {
            feedback += `⚠️ <strong>Deretan Penjelas</strong> belum menunjukkan topik <em>${prefix}</em> secara relevan.<br>`;
            feedback += `💡 Sertakan kata kunci seperti <em>${kataKunci.slice(0, 4).join("</em>, <em>")}...</em><br>`;
            adaKesalahan = true;
        }

        if (poin === 2) {
            feedback += "🎯 <em>Dereretan Penjelas sangat baik!</em><br>";
        }
    }

    // ======== 4. INTERPRETASI / KESIMPULAN ========
    if (kesimpulan === "") {
        feedback += "❌ <strong>Interpretasi</strong> belum diisi.<br>";
        adaKesalahan = true;
    } else {
        let poin = 0;

        // a. Kata penegas/kesimpulan
        if (/(dengan demikian|kesimpulannya|oleh karena itu|dapat disimpulkan|hal ini menunjukkan|maka dapat dikatakan|penting bagi kita)/i.test(kesimpulan)) {
            feedback += "✅ <strong>Interpretasi</strong> sudah menyimpulkan dengan baik.<br>";
            poin++;
        } else {
            feedback += `⚠️ <strong>Interpretasi</strong> sebaiknya memuat kata simpulan seperti <em>dengan demikian</em>, <em>kesimpulannya</em>, dll.<br>`;
            adaKesalahan = true;
        }
        if (poin === 2) {
            feedback += "🎯 <em>Interpretasi sangat baik!</em><br>";
        }
    }

    // Tampilkan hasil feedback
    document.getElementById(`feedback_${prefix}`).innerHTML = `<div class="feedback-box">${feedback}</div>`;

    // Tampilkan notifikasi berdasarkan kesalahan
    if (adaKesalahan) {
        tampilkanNotifikasi("Masih ada bagian yang belum benar. Periksa kembali teksmu.");
    } else {
        tampilkanNotifikasi("✅ Semua bagian sudah benar. Silakan simpan teksmu.", true);
    }
}


function tampilkanNotifikasi(pesan, sukses = false) {
    const notifikasi = document.getElementById("notifikasi");
    notifikasi.innerText = pesan;
    notifikasi.style.backgroundColor = sukses ? "#2ecc71" : "#f44336"; // hijau / merah
    notifikasi.style.display = "block";

    const audio = sukses ? document.getElementById("audio-success") : document.getElementById("audio-error");
    if (audio) audio.play();

    setTimeout(() => {
        notifikasi.style.display = "none";
    }, 3000);
}
