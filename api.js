const API_URL =
"https://script.google.com/macros/s/AKfycbwGMiiD73Assn_UXuvkZQSrWJp4K6_QiulkGCGKPPHNp9aBrVa9EnNseu3aVQJdDvDr/exec";

async function apiGet(action){

  const response =
    await fetch(
      API_URL + "?action=" + action
    );

  return await response.json();

}
