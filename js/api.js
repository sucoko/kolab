const API_URL='https://script.google.com/macros/s/AKfycbwGMiiD73Assn_UXuvkZQSrWJp4K6_QiulkGCGKPPHNp9aBrVa9EnNseu3aVQJdDvDr/exec';

async function loadCompetencies(){

 try{

   console.log("Mulai load");

   const res = await fetch(API_URL+'?action=getCompetencies');

   console.log("Status:", res.status);

   const data = await res.json();

   console.log("Data:", data);

   const select = document.getElementById('kompetensi');

   console.log("Select:", select);

   if(!select) return;

   data.forEach(item=>{

     const opt = document.createElement('option');

     opt.value = item.CompetencyID;
     opt.textContent = item['Nama KK'];

     select.appendChild(opt);

   });

   console.log("Selesai");

 }catch(err){

   console.error("ERROR:", err);

 }

}

async function simpanTema(){

 const durasi = parseInt(
   document.getElementById('durasi').value
 );

 if(durasi < 1){
   alert('Durasi minimal 1 minggu');
   return;
 }

 const payload={
  action:'saveTheme',
  competencyId:document.getElementById('kompetensi').value,
  tema:document.getElementById('tema').value,
  deskripsi:document.getElementById('deskripsi').value,
  durasi:durasi
 };

 const res=await fetch(API_URL,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(payload)
 });

 const hasil=await res.json();

 document.getElementById('status').innerText =
   hasil.message;
}

loadCompetencies();
