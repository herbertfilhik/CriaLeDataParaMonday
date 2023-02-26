const Papa = require('papaparse');
const fs = require('fs');
const excel = require('exceljs');
const { clearScreenDown } = require('readline');

const csvFilePath = './file/customerCSV.csv';
const csvContent = fs.readFileSync(csvFilePath, 'utf8');

const rows = Papa.parse(csvContent, { delimiter: ',', header: false }).data;
const customers = [];

let customer = {};

const nameRegex = /^[a-zA-Z\s]{1,}[^0-9]$/;

rows.forEach(row => {clearScreenDown
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

console.log(customers);

// Cria um novo arquivo XLS
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Dados');

// Adiciona as colunas Name, Site e Comentários
worksheet.columns = [
  { header: 'Name', key: 'name' },
  { header: 'Site', key: 'site' },
  { header: 'Comentários', key: 'comment' },
];

// Insere os dados do array de objetos no arquivo XLS
customers.forEach((row) => {
  worksheet.addRow({
    name: row.name,
    site: row.site,
    comment: row.comment,
  });
});

// Salva o arquivo XLS
workbook.xlsx.writeFile('dados.xlsx')
  .then(() => {
    console.log('Arquivo XLS criado com sucesso!');
  })
  .catch((err) => {
    console.log(err);
  });
