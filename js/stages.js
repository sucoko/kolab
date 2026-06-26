/*=====================================================
KOLAB STAGES V3
=====================================================*/

let plannerStages = [];

document.addEventListener("DOMContentLoaded", async ()=>{

    await loadThemes();

    await loadStages();

    document
    .getElementById("theme")
    .addEventListener("change",async()=>{

        plannerStages=[];

        renderPlanner();

        await loadStages();

    });

});

/*=====================================================
LOAD THEMES
=====================================================*/

async function loadThemes(){

    try{

        const data=
        await apiGet("getThemes");

        const select=
        document.getElementById("theme");

        select.innerHTML=
        '<option value="">Pilih Tema Projek</option>';

        data.forEach(t=>{

            select.innerHTML+=`
            <option value="${t.ThemeID}">
            ${t.Tema}
            </option>
            `;

        });

    }

    catch(e){

        console.log(e);

        alert("Gagal memuat tema.");

    }

}

/*=====================================================
LOAD STAGES
=====================================================*/

async function loadStages(){

    const container=
    document.getElementById("stageContainer");

    container.innerHTML="Memuat...";

    try{

        const themeId=
        document.getElementById("theme").value;

        let data=
        await apiGet("getStages");

        if(themeId){

            data=data.filter(

            s=>s.ThemeID===themeId

            );

        }

        data.sort(

        (a,b)=>

        Number(a.Urutan)-

        Number(b.Urutan)

        );

        if(data.length===0){

            container.innerHTML=
            "<p>Belum ada tahapan.</p>";

            return;

        }

        let html="";

        data.forEach(stage=>{

            html+=`

<div class="stage-card">

<div class="stage-header">

<div class="stage-title">

${stage.Urutan}.
${stage.NamaTahap}

</div>

<span class="badge-week">

${stage.MingguMulai}
-
${stage.MingguSelesai}

</span>

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

        container.innerHTML=html;

    }

    catch(e){

        console.log(e);

        container.innerHTML=
        "Gagal memuat data.";

    }

}
/*=====================================================
AI STAGE PLANNER
=====================================================*/

async function generateTahapanAI(){

    try{

        const theme=await getSelectedTheme();

        if(!theme){

            alert("Pilih Tema Projek terlebih dahulu.");

            return;

        }

        plannerStages=[];

        const durasi=
        Number(theme.DurasiMinggu);

        const daftar=[

        "Identifikasi Masalah",

        "Observasi Lapangan",

        "Perencanaan Projek",

        "Perancangan Solusi",

        "Pengembangan Produk",

        "Pengujian Produk",

        "Presentasi Hasil",

        "Refleksi"

        ];

        const blok=
        Math.max(
        1,
        Math.floor(durasi/daftar.length)
        );

        let mulai=1;

        daftar.forEach((nama,index)=>{

            let selesai;

            if(index==daftar.length-1){

                selesai=durasi;

            }else{

                selesai=
                mulai+
                blok-
                1;

            }

            plannerStages.push({

                checked:true,

                urutan:index+1,

                nama:nama,

                deskripsi:"",

                mulai:mulai,

                selesai:selesai

            });

            mulai=
            selesai+1;

        });

        renderPlanner();

    }

    catch(err){

        console.log(err);

        alert("Generate AI gagal.");

    }

}

/*=====================================================
RENDER PLANNER
=====================================================*/

function renderPlanner(){

    const box=
    document.getElementById("aiStageList");

    if(plannerStages.length==0){

        box.innerHTML=
        "<p>Belum ada usulan tahapan.</p>";

        return;

    }

    let html="";

    plannerStages.forEach((s,index)=>{

        html+=`

<div class="ai-item">

<input
type="checkbox"

${s.checked?"checked":""}

onchange="plannerStages[${index}].checked=this.checked">

<div style="flex:1;">

<b>

${s.urutan}.
${s.nama}

</b>

<div class="ai-week">

Minggu
${s.mulai}
-
${s.selesai}

</div>

</div>

</div>

`;

    });

    box.innerHTML=html;

}

/*=====================================================
PILIH SEMUA
=====================================================*/

function pilihSemuaAI(){

    plannerStages.forEach(s=>{

        s.checked=true;

    });

    renderPlanner();

}

/*=====================================================
HAPUS PILIHAN
=====================================================*/

function hapusPilihanAI(){

    plannerStages.forEach(s=>{

        s.checked=false;

    });

    renderPlanner();

}

/*=====================================================
TAMBAH TAHAPAN MANUAL
=====================================================*/

function tambahTahapanManual(){

    const nama=
    document.getElementById("customNama").value;

    const desk=
    document.getElementById("customDeskripsi").value;

    const mulai=
    document.getElementById("customMulai").value;

    const selesai=
    document.getElementById("customSelesai").value;

    if(nama.trim()==""){

        alert("Nama Tahapan belum diisi.");

        return;

    }

    plannerStages.push({

        checked:true,

        urutan:
        plannerStages.length+1,

        nama:nama,

        deskripsi:desk,

        mulai:mulai,

        selesai:selesai

    });

    document.getElementById("customNama").value="";

    document.getElementById("customDeskripsi").value="";

    document.getElementById("customMulai").value="";

    document.getElementById("customSelesai").value="";

    renderPlanner();

}
/*=====================================================
SIMPAN TAHAPAN TERPILIH
=====================================================*/

async function simpanTahapanTerpilih(){

    const themeId=
    document.getElementById("theme").value;

    if(!themeId){

        alert("Pilih Tema Projek terlebih dahulu.");

        return;

    }

    const dipilih=

    plannerStages.filter(

        s=>s.checked

    );

    if(dipilih.length==0){

        alert("Belum ada tahapan yang dipilih.");

        return;

    }

    const btn=

    document.getElementById(

    "btnSimpanSemua"

    );

    btn.disabled=true;

    btn.innerHTML=

    "⏳ Menyimpan...";

    try{

        for(const stage of dipilih){

            const url=

            API_URL+

            "?action=saveStage"+

            "&themeId="+
            encodeURIComponent(themeId)+

            "&urutan="+
            encodeURIComponent(stage.urutan)+

            "&namaTahap="+
            encodeURIComponent(stage.nama)+

            "&deskripsiTahap="+
            encodeURIComponent(stage.deskripsi)+

            "&mingguMulai="+
            encodeURIComponent(stage.mulai)+

            "&mingguSelesai="+
            encodeURIComponent(stage.selesai);

            const res=

            await fetch(url);

            await res.json();

        }

        alert(

        dipilih.length+

        " tahapan berhasil disimpan."

        );

        plannerStages=[];

        renderPlanner();

        await loadStages();

    }

    catch(err){

        console.log(err);

        alert(

        "Gagal menyimpan."

        );

    }

    finally{

        btn.disabled=false;

        btn.innerHTML=

        "💾 Simpan Semua Tahapan";

    }

}

/*=====================================================
EDIT TAHAPAN PLANNER
=====================================================*/

function editPlanner(index){

    const s=

    plannerStages[index];

    document.getElementById(

    "customNama"

    ).value=s.nama;

    document.getElementById(

    "customDeskripsi"

    ).value=s.deskripsi;

    document.getElementById(

    "customMulai"

    ).value=s.mulai;

    document.getElementById(

    "customSelesai"

    ).value=s.selesai;

    plannerStages.splice(

    index,

    1

    );

    renderPlanner();

}

/*=====================================================
HAPUS TAHAPAN PLANNER
=====================================================*/

function hapusPlanner(index){

    if(

    !confirm(

    "Hapus tahapan ini?"

    )

    ) return;

    plannerStages.splice(

    index,

    1

    );

    plannerStages.forEach(

    (s,i)=>{

        s.urutan=i+1;

    }

    );

    renderPlanner();

}

/*=====================================================
NAIKKAN URUTAN
=====================================================*/

function naikPlanner(index){

    if(index==0) return;

    [

    plannerStages[index],

    plannerStages[index-1]

    ]=

    [

    plannerStages[index-1],

    plannerStages[index]

    ];

    plannerStages.forEach(

    (s,i)=>{

        s.urutan=i+1;

    }

    );

    renderPlanner();

}

/*=====================================================
TURUNKAN URUTAN
=====================================================*/

function turunPlanner(index){

    if(

    index>=

    plannerStages.length-1

    ) return;

    [

    plannerStages[index],

    plannerStages[index+1]

    ]=

    [

    plannerStages[index+1],

    plannerStages[index]

    ];

    plannerStages.forEach(

    (s,i)=>{

        s.urutan=i+1;

    }

    );

    renderPlanner();

}
/*=====================================================
RENDER PLANNER (VERSI FINAL)
=====================================================*/

function renderPlanner(){

    const box=document.getElementById("aiStageList");

    if(plannerStages.length===0){

        box.innerHTML="<p>Belum ada usulan tahapan.</p>";

        return;

    }

    let html="";

    plannerStages.forEach((s,index)=>{

        html+=`

<div class="ai-item">

<div style="display:flex;align-items:flex-start;width:100%;">

<div style="margin-right:10px;">

<input
type="checkbox"

${s.checked?"checked":""}

onchange="plannerStages[${index}].checked=this.checked">

</div>

<div style="flex:1;">

<b>

${s.urutan}. ${escapeHtml(s.nama)}

</b>

<div class="ai-week">

📅 Minggu

${s.mulai}

-

${s.selesai}

</div>

<div style="font-size:13px;color:#666;margin-top:5px;">

${escapeHtml(s.deskripsi)}

</div>

<div style="margin-top:10px;display:flex;gap:5px;flex-wrap:wrap;">

<button onclick="naikPlanner(${index})">

⬆

</button>

<button onclick="turunPlanner(${index})">

⬇

</button>

<button onclick="editPlanner(${index})">

✏ Edit

</button>

<button onclick="hapusPlanner(${index})">

🗑 Hapus

</button>

</div>

</div>

</div>

</div>

`;

    });

    box.innerHTML=html;

}

/*=====================================================
GET SELECTED THEME
=====================================================*/

async function getSelectedTheme(){

    const themeId=

    document.getElementById("theme").value;

    if(!themeId) return null;

    const data=

    await apiGet("getThemes");

    return data.find(

    t=>t.ThemeID===themeId

    );

}

/*=====================================================
DELETE STAGE
=====================================================*/

async function hapusTahap(stageId){

    if(!confirm("Yakin menghapus tahapan ini?"))

    return;

    try{

        const result=

        await fetch(

        API_URL+

        "?action=deleteStage"+

        "&stageId="+

        encodeURIComponent(stageId)

        );

        const json=

        await result.json();

        alert(json.message);

        loadStages();

    }

    catch(err){

        console.log(err);

        alert("Gagal menghapus.");

    }

}

/*=====================================================
HELPER
=====================================================*/

function escapeHtml(text){

    if(!text) return "";

    return text

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;");

}

/*=====================================================
CLEAR PLANNER
=====================================================*/

function clearPlanner(){

    plannerStages=[];

    renderPlanner();

}

/*=====================================================
STATUS
=====================================================*/

function setStatus(text){

    const el=

    document.getElementById("status");

    if(el){

        el.innerHTML=text;

    }

}

/*=====================================================
VERSI
=====================================================*/

console.log(

"KOLAB STAGES V3 READY"

);
