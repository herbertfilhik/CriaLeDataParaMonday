const fs = require('fs');
const mondaySdk = require('monday-sdk-js');
const monday = new mondaySdk();
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzOTg0MzYxNCwidWlkIjo0MDE5MTg1MCwiaWFkIjoiMjAyMy0wMi0yNVQyMDoyNTo1NC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTU1NjU4NDcsInJnbiI6InVzZTEifQ.mpGJ1J8iQpo67JNWyKKAScNAlK3TfH8YFCgw5vI-gwg';
const XLSX = require('xlsx');
const path = require('path');
const filePath = 'file/fileCustomer.xlsx';
const adaptedPath = path.normalize(filePath);
const workbook = XLSX.readFile(adaptedPath);
const sheetName = 'Customer';
const worksheet = workbook.Sheets[sheetName];

// Converter o novo arquivo em JSON
const newWorkbookData = XLSX.readFile(filePath);
const newWorkbookSheet = newWorkbookData.Sheets[newWorkbookData.SheetNames[0]];
let newWorkbookJson = XLSX.utils.sheet_to_json(newWorkbookSheet);

// Renomear a chave "Abba Contract" para "customer"
newWorkbookJson = newWorkbookJson.map(row => {
  if (row["Abba Contract"]) {
    row["customer"] = row["Abba Contract"];
    delete row["Abba Contract"];
  }
  return row;
});

// Separar as informações em seções separadas quando houver 3 linhas em branco
const newWorkbookJsonSeparated = [];
let section = [];
let counterEmptyRows = 0;

newWorkbookJson.forEach(row => {
  if (Object.values(row).every(cell => !cell)) {
    counterEmptyRows += 1;
    if (counterEmptyRows === 3) {
      newWorkbookJsonSeparated.push(section);
      newWorkbookJsonSeparated.push({ "Empty Rows": "I found three empty rows" });
      section = [];
      counterEmptyRows = 0;
    }
  } else {
    section.push(row);
    counterEmptyRows = 0;
  }
});

if (section.length > 0) {
  newWorkbookJsonSeparated.push(section);
}

//gravar esse json como um arquivo fileCustomer.json
const jsonFilePath = 'file/fileCustomer.json';
fs.writeFileSync(jsonFilePath, JSON.stringify(newWorkbookJsonSeparated), 'utf8');
console.log('Novo arquivo Json criado em:', jsonFilePath);

//Output
monday.api(`query { users { id, name } }`, { token })
  .then(res => {
    console.log('Arquivo xls em:', filePath);
    console.log('Novo arquivo em formato JSON:', newWorkbookJsonSeparated);
  })
  .catch(err => {
    console.log(err);
  });
