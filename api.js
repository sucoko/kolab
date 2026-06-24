const API_URL='https://script.google.com/macros/s/AKfycbwGMiiD73Assn_UXuvkZQSrWJp4K6_QiulkGCGKPPHNp9aBrVa9EnNseu3aVQJdDvDr/exec';

async function loadCompetencies(){
 const res=await fetch(API_URL+'?action=getCompetencies');
 const data=await res.json();
 const select=document.getElementById('kompetensi');
 if(!select) return;
 data.forEach(item=>{
   const opt=document.createElement('option');
   opt.value=item.CompetencyID;
   opt.textContent=item['Nama KK'];
   select.appendChild(opt);
 });
}

async function simpanTema(){
 const payload={
  action:'saveTheme',
  competencyId:document.getElementById('kompetensi').value,
  tema:document.getElementById('tema').value,
  deskripsi:document.getElementById('deskripsi').value,
  durasi:document.getElementById('durasi').value
 };

 const res=await fetch(API_URL,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(payload)
 });

 const hasil=await res.json();
 document.getElementById('status').innerText=hasil.message;
}

loadCompetencies();
