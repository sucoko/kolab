//==================================================
// KOLAB STAGES V4
//==================================================

console.log("KOLAB STAGES V4 Loaded");

//==================================================
// STATE
//==================================================

let daftarTema = [];

let daftarTahapanAI = [];

let sedangMenyimpan = false;

let sedangGenerate = false;


//==================================================
// INIT
//==================================================

document.addEventListener("DOMContentLoaded", initStages);

async function initStages(){

    try{

        await loadThemes();

        await loadStages();

        tampilStatus(
            "Modul Tahapan siap digunakan.",
            "success"
        );

    }catch(err){

        console.error(err);

        tampilStatus(
            "Gagal memuat data.",
            "error"
        );

    }

}
//==================================================
// STATUS
//==================================================

function tampilStatus(pesan, tipe="success"){

    const box =
    document.getElementById("status");

    if(!box) return;

    box.style.display = "block";

    box.innerHTML = pesan;

    if(tipe==="error"){

        box.style.background="#fee2e2";

        box.style.color="#991b1b";

    }else{

        box.style.background="#ecfdf5";

        box.style.color="#166534";

    }

}
//==================================================
// BUTTON LOADING
//==================================================

function setButtonLoading(id, loading, text){

    const btn =
    document.getElementById(id);

    if(!btn) return;

    if(loading){

        btn.disabled=true;

        btn.dataset.oldText=
            btn.innerHTML;

        btn.innerHTML=
            "⏳ "+text;

    }else{

        btn.disabled=false;

        btn.innerHTML=
            btn.dataset.oldText;

    }

}
