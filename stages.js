loadThemes();
loadStages();

async function loadThemes(){

  const data =
    await apiGet("getThemes");

  const select =
    document.getElementById("theme");

  select.innerHTML =
    '<option value="">Pilih Tema</option>';

  data.forEach(theme=>{

    select.innerHTML += `
      <option value="${theme.ThemeID}">
        ${theme.Tema}
      </option>
    `;

  });

}

async function loadStages(){

  const data =
    await apiGet("getStages");

  const container =
    document.getElementById(
      "stageContainer"
    );

  container.innerHTML = "";

  data.sort(
    (a,b)=>
    Number(a.Urutan) -
    Number(b.Urutan)
  );

  data.forEach(stage=>{

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

            Hapus

          </button>

        </div>

      </div>
    `;

  });

}

async function simpanTahap(){

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
    "&themeId=" + themeId +
    "&urutan=" + urutan +
    "&namaTahap=" + encodeURIComponent(namaTahap) +
    "&deskripsiTahap=" + encodeURIComponent(deskripsiTahap) +
    "&mingguMulai=" + mingguMulai +
    "&mingguSelesai=" + mingguSelesai;

  const result =
    await fetch(url);

  const json =
    await result.json();

  alert(json.message);

  loadStages();

}
async function hapusTahap(stageId){

  const konfirmasi =
    confirm("Yakin hapus tahapan ini?");

  if(!konfirmasi){
    return;
  }

  const result =
    await fetch(
      API_URL +
      "?action=deleteStage" +
      "&stageId=" + stageId
    );

  const json =
    await result.json();

  alert(json.message);

  loadStages();

}
async function generateTahapanAI(){

  const themeId =
    document.getElementById("theme").value;

  if(!themeId){
    alert("Pilih tema terlebih dahulu");
    return;
  }

  const themes =
    await apiGet("getThemes");

  const theme =
    themes.find(
      t => t.ThemeID === themeId
    );

  if(!theme){
    alert("Tema tidak ditemukan");
    return;
  }

  const durasi =
    parseInt(theme.DurasiMinggu);

  let tahapan = [];

  if(durasi <= 8){

    tahapan = [
      "Analisis Kebutuhan",
      "Perencanaan Projek",
      "Pelaksanaan Projek",
      "Presentasi Hasil"
    ];

  }else if(durasi <= 16){

    tahapan = [
      "Analisis Kebutuhan",
      "Perencanaan Projek",
      "Persiapan Alat dan Bahan",
      "Pelaksanaan Projek",
      "Evaluasi",
      "Presentasi Hasil"
    ];

  }else{

    tahapan = [
      "Analisis Kebutuhan",
      "Perencanaan Projek",
      "Desain Solusi",
      "Persiapan",
      "Pelaksanaan Tahap 1",
      "Pelaksanaan Tahap 2",
      "Evaluasi",
      "Presentasi Hasil"
    ];

  }

  const blok =
    Math.floor(durasi / tahapan.length);

  let html =
    `<h4>Usulan Tahapan AI</h4><ol>`;

  let mingguAwal = 1;

  tahapan.forEach((nama,index)=>{

    let mingguAkhir;

    if(index === tahapan.length - 1){
      mingguAkhir = durasi;
    }else{
      mingguAkhir =
        mingguAwal + blok - 1;
    }

    html += `
      <li>
        ${nama}
        (Minggu ${mingguAwal}-${mingguAkhir})
      </li>
    `;

    mingguAwal =
      mingguAkhir + 1;

  });

  html += "</ol>";

  document.getElementById(
    "aiResult"
  ).innerHTML = html;

}
