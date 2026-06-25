loadThemes();

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

}

