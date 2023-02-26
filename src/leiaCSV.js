const Papa = require('papaparse');
const fs = require('fs');
const excel = require('exceljs');
const XLSX = require('xlsx');

const xlsxFilePath = './file/customer.xlsx';
const csvFilePath = './file/customerCSV.csv';

// Lê o arquivo XLSX e converte para CSV
const workbook = XLSX.readFile(xlsxFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const csvData = XLSX.utils.sheet_to_csv(worksheet);
fs.writeFileSync(csvFilePath, csvData, 'utf-8');
console.log('Arquivo CSV criado em:', csvFilePath);

// Lê o arquivo CSV e processa os dados
const csvContent = fs.readFileSync(csvFilePath, 'utf8');
const rows = Papa.parse(csvContent, { delimiter: ',', header: false }).data;
const customers = [];

let customer = {};

const nameRegex = /^[a-zA-Z\s]{1,}[^0-9]$/;

rows.forEach(row => {
  const text = row[0];

  if (text) {
    if (text.match(/^http/)) {
      customer.site = text;
    } else if (text.match(/^\d{1,2}\/\d{1,2}\/\d{2}: /)) {
      customer.comment = text;
    } else if (nameRegex.test(text)) {
      if (Object.keys(customer).length) {
        customers.push(customer);
        customer = {};
      }

      customer.name = text;
    } else {
      customer.comment = text;
    }
  }
});

if (Object.keys(customer).length) {
  customers.push(customer);
}

// Cria um novo arquivo XLSX e insere os dados por coluna
const workbook2 = new excel.Workbook();
const worksheet2 = workbook2.addWorksheet('dataFormatedForMonday');

worksheet2.columns = [
  { header: 'Name', key: 'name' },
  { header: 'Site', key: 'site' },
  { header: 'Comentários', key: 'comment' },
];

customers.forEach((row) => {
  worksheet2.addRow({
    name: row.name || '',
    site: row.site || '',
    comment: row.comment || '',
  });
});

workbook2.xlsx.writeFile('./file/dataFormatedForMonday.xlsx')
  .then(() => {
    console.log('Arquivo XLSX criado com sucesso!');
  })
  .catch((err) => {
    console.log(err);
  });
