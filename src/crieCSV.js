const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'C:/Users/herbe/projetos_hlima/IncluirContasMondayDotCom/file/customer.xlsx';
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const csvData = XLSX.utils.sheet_to_csv(worksheet);

const csvFilePath = 'C:/Users/herbe/projetos_hlima/IncluirContasMondayDotCom/file/customerCSV.csv';
fs.writeFileSync(csvFilePath, csvData, 'utf-8');
console.log('Arquivo CSV criado em:', csvFilePath);