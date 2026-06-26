</>javascript
// ================================
// THEMES.JS
// ================================

window.onload = function () {
    loadCompetencies();
    loadThemes();
};

// ================================
// LOAD KONSENTRASI KEAHLIAN
// ================================

async function loadCompetencies() {

    try {

        const data = await apiGet("getCompetencies");

        const select = document.getElementById("kompetensi");

        select.innerHTML = "";

        data.forEach(item => {

            select.innerHTML += `
                <option value="${item.CompetencyID}">
                    ${item["Nama KK"]}
                </option>
            `;

        });

    } catch (err) {

        console.error(err);
        alert("Gagal memuat Konsentrasi Keahlian.");

    }

}


// ================================
// LOAD DAFTAR TEMA
// ================================

async function loadThemes() {

    try {

        const data = await apiGet("getThemes");

        const list = document.getElementById("themeList");

        if (data.length == 0) {

            list.innerHTML =
                "<p>Belum ada Tema Projek.</p>";

            return;

        }

        let html = "";

        data.forEach(item => {

            html += `

            <div class="theme-card">

                <h3>${item.Tema}</h3>

                <p>
                    <b>Konsentrasi :</b>
                    ${item.CompetencyID}
                </p>

                <p>
                    <b>Durasi :</b>
                    ${item.DurasiMinggu} Minggu
                </p>

                <p>
                    ${item.Deskripsi}
                </p>

            </div>

            `;

        });

        list.innerHTML = html;

    } catch (err) {

        console.error(err);

    }

}



// ================================
// SIMPAN
// ================================

async function simpanTema() {

    const btn = document.getElementById("btnSimpan");

    if (btn.disabled) return;

    const competencyId =
        document.getElementById("kompetensi").value;

    const tema =
        document.getElementById("tema").value.trim();

    const deskripsi =
        document.getElementById("deskripsi").value.trim();

    const durasi =
        parseInt(document.getElementById("durasi").value);

    if (tema == "") {

        alert("Tema belum diisi.");

        return;

    }

    if (durasi < 1 || isNaN(durasi)) {

        alert("Durasi minimal 1 minggu.");

        return;

    }

    btn.disabled = true;
    btn.innerHTML = "⏳ Menyimpan...";

    try {

        const url =
            API_URL +
            "?action=saveTheme" +
            "&competencyId=" + encodeURIComponent(competencyId) +
            "&tema=" + encodeURIComponent(tema) +
            "&deskripsi=" + encodeURIComponent(deskripsi) +
            "&durasi=" + encodeURIComponent(durasi);

        const res = await fetch(url);

        const hasil = await res.json();

        document.getElementById("status").innerHTML =
            hasil.message;

        // reset form

        document.getElementById("tema").value = "";
        document.getElementById("deskripsi").value = "";
        document.getElementById("durasi").value = "";

        hideForm();

        await loadThemes();

    } catch (err) {

        console.error(err);

        alert("Gagal menyimpan data.");

    }

    btn.disabled = false;
    btn.innerHTML = "💾 Simpan Tema";

}
