/*=====================================================
  KOLAB STAGES.JS V2
======================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadThemes();
    await loadStages();

    document
        .getElementById("theme")
        .addEventListener("change", loadStages);

});

/*=====================================================
LOAD THEMES
======================================================*/

async function loadThemes() {

    try {

        const data = await apiGet("getThemes");

        const select =
            document.getElementById("theme");

        select.innerHTML =
            '<option value="">Pilih Tema Projek</option>';

        if (!Array.isArray(data) || data.length === 0) {

            select.innerHTML +=
                '<option value="">Belum ada tema</option>';

            return;

        }

        data.forEach(theme => {

            select.innerHTML += `
                <option value="${theme.ThemeID}">
                    ${theme.Tema}
                </option>
            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Gagal memuat daftar tema.");

    }

}

/*=====================================================
LOAD STAGES
======================================================*/

async function loadStages() {

    try {

        const themeId =
            document.getElementById("theme").value;

        let data =
            await apiGet("getStages");

        if (themeId) {

            data =
                data.filter(
                    s => s.ThemeID === themeId
                );

        }

        const container =
            document.getElementById(
                "stageContainer"
            );

        container.innerHTML = "";

        if (data.length === 0) {

            container.innerHTML =
                "<p>Belum ada tahapan.</p>";

            return;

        }

        data.sort(
            (a, b) =>
                Number(a.Urutan) -
                Number(b.Urutan)
        );

        data.forEach(stage => {

            container.innerHTML += `

<div class="stage-card">

<div class="stage-header">

<div class="stage-title">

${stage.Urutan}. ${stage.NamaTahap}

</div>

</div>

<div class="stage-week">

📅 Minggu
${stage.MingguMulai}
-
${stage.MingguSelesai}

</div>

<div class="stage-desc">

${stage.DeskripsiTahap}

</div>

<div class="stage-action">

<button
class="btn-delete"
onclick="hapusTahap('${stage.StageID}')">

🗑 Hapus

</button>

</div>

</div>

`;

        });

    }

    catch (err) {

        console.error(err);

        alert("Gagal memuat tahapan.");

    }

}

/*=====================================================
VALIDASI
======================================================*/

function validasiForm() {

    const themeId =
        document.getElementById("theme").value;

    const urutan =
        document.getElementById("urutan").value;

    const nama =
        document.getElementById("namaTahap").value;

    const mulai =
        document.getElementById("mingguMulai").value;

    const selesai =
        document.getElementById("mingguSelesai").value;

    if (!themeId) {

        alert("Pilih Tema Projek.");

        return false;

    }

    if (!urutan) {

        alert("Urutan belum diisi.");

        return false;

    }

    if (nama.trim() === "") {

        alert("Nama Tahap belum diisi.");

        return false;

    }

    if (!mulai || !selesai) {

        alert("Minggu belum lengkap.");

        return false;

    }

    if (Number(mulai) > Number(selesai)) {

        alert("Minggu mulai tidak boleh lebih besar.");

        return false;

    }

    return true;

}
/*=====================================================
SIMPAN TAHAP
======================================================*/

async function simpanTahap() {

    if (!validasiForm()) return;

    const btn =
        document.getElementById("btnSimpanTahap");

    btn.disabled = true;
    btn.innerHTML = "⏳ Menyimpan...";

    try {

        const themeId =
            document.getElementById("theme").value;

        const urutan =
            document.getElementById("urutan").value;

        const namaTahap =
            document.getElementById("namaTahap").value;

        const deskripsiTahap =
            document.getElementById("deskripsiTahap").value;

        const mingguMulai =
            document.getElementById("mingguMulai").value;

        const mingguSelesai =
            document.getElementById("mingguSelesai").value;

        const url =
            API_URL +
            "?action=saveStage" +
            "&themeId=" + encodeURIComponent(themeId) +
            "&urutan=" + encodeURIComponent(urutan) +
            "&namaTahap=" + encodeURIComponent(namaTahap) +
            "&deskripsiTahap=" + encodeURIComponent(deskripsiTahap) +
            "&mingguMulai=" + encodeURIComponent(mingguMulai) +
            "&mingguSelesai=" + encodeURIComponent(mingguSelesai);

        const response =
            await fetch(url);

        const json =
            await response.json();

        alert(json.message);

        resetForm();

        await loadStages();

    }

    catch (err) {

        console.error(err);

        alert("Gagal menyimpan tahapan.");

    }

    finally {

        btn.disabled = false;
        btn.innerHTML = "💾 Simpan Tahapan";

    }

}

/*=====================================================
RESET FORM
======================================================*/

function resetForm() {

    document.getElementById("urutan").value = "";
    document.getElementById("namaTahap").value = "";
    document.getElementById("deskripsiTahap").value = "";
    document.getElementById("mingguMulai").value = "";
    document.getElementById("mingguSelesai").value = "";

}

/*=====================================================
HAPUS TAHAP
======================================================*/

async function hapusTahap(stageId) {

    const ok =
        confirm("Yakin ingin menghapus tahapan ini?");

    if (!ok) return;

    try {

        const result =
            await fetch(

                API_URL +
                "?action=deleteStage" +
                "&stageId=" +
                encodeURIComponent(stageId)

            );

        const json =
            await result.json();

        alert(json.message);

        await loadStages();

    }

    catch (err) {

        console.error(err);

        alert("Gagal menghapus tahapan.");

    }

}

/*=====================================================
AMBIL DETAIL TEMA
======================================================*/

async function getSelectedTheme() {

    const themeId =
        document.getElementById("theme").value;

    if (!themeId) return null;

    const themes =
        await apiGet("getThemes");

    return themes.find(
        t => t.ThemeID === themeId
    );

}

/*=====================================================
STATUS
======================================================*/

function setStatus(text) {

    const el =
        document.getElementById("status");

    if (!el) return;

    el.innerHTML = text;

}

/*=====================================================
SORTING
======================================================*/

function sortStages(data) {

    return data.sort(

        (a, b) =>

            Number(a.Urutan) -
            Number(b.Urutan)

    );

}

/*=====================================================
BERSIHKAN AI
======================================================*/

function clearAIResult() {

    const box =
        document.getElementById("aiResult");

    if (!box) return;

    box.innerHTML =
        "Belum ada usulan AI.";

}
/*=====================================================
AI GENERATOR
======================================================*/

async function generateTahapanAI() {

    try {

        const theme = await getSelectedTheme();

        if (!theme) {

            alert("Pilih Tema Projek terlebih dahulu.");

            return;

        }

        const durasi =
            Number(theme.DurasiMinggu);

        if (!durasi || durasi < 1) {

            alert("Durasi tema belum tersedia.");

            return;

        }

        const daftarTahapan = [

            "Identifikasi Masalah dan Peluang",

            "Perencanaan Projek",

            "Perancangan Solusi",

            "Pengembangan Produk/Jasa",

            "Pengujian Produk",

            "Implementasi",

            "Presentasi Hasil",

            "Refleksi dan Evaluasi"

        ];

        const blok =
            Math.max(
                1,
                Math.floor(durasi / daftarTahapan.length)
            );

        let mingguAwal = 1;

        let html = `
        <h3>🤖 Usulan Tahapan AI</h3>

        <table>

        <tr>

        <th>Urut</th>

        <th>Tahapan</th>

        <th>Minggu</th>

        </tr>

        `;

        daftarTahapan.forEach((nama,index)=>{

            let mingguAkhir;

            if(index===daftarTahapan.length-1){

                mingguAkhir=durasi;

            }else{

                mingguAkhir=
                mingguAwal+
                blok-
                1;

            }

            html+=`

            <tr>

            <td>${index+1}</td>

            <td>${nama}</td>

            <td>

            ${mingguAwal}
            -
            ${mingguAkhir}

            </td>

            </tr>

            `;

            mingguAwal=
            mingguAkhir+1;

        });

        html+=`

        </table>

        <br>

        <button
        onclick="isiTahapanPertama()">

        Gunakan Tahapan Pertama

        </button>

        `;

        document
        .getElementById("aiResult")
        .innerHTML=html;

    }

    catch(err){

        console.error(err);

        alert("Generate AI gagal.");

    }

}

/*=====================================================
ISI FORM DARI AI
======================================================*/

function isiTahapanPertama(){

    document.getElementById("urutan").value=1;

    document.getElementById("namaTahap").value=
    "Identifikasi Masalah dan Peluang";

    document.getElementById("deskripsiTahap").value=
    "Mengidentifikasi masalah, kebutuhan, peluang, dan menentukan fokus projek.";

    document.getElementById("mingguMulai").value=1;

    document.getElementById("mingguSelesai").value=2;

}

/*=====================================================
TIMELINE
======================================================*/

async function refreshTimeline(){

    await loadStages();

}

/*=====================================================
EDIT TAHAP
======================================================*/

function editTahap(stage){

    document.getElementById("urutan").value=
    stage.Urutan;

    document.getElementById("namaTahap").value=
    stage.NamaTahap;

    document.getElementById("deskripsiTahap").value=
    stage.DeskripsiTahap;

    document.getElementById("mingguMulai").value=
    stage.MingguMulai;

    document.getElementById("mingguSelesai").value=
    stage.MingguSelesai;

}

/*=====================================================
HELPER
======================================================*/

function escapeHtml(text){

    if(!text) return "";

    return text
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");

}

/*=====================================================
VERSI
======================================================*/

console.log(

"KOLAB STAGES V2 Loaded"

);
