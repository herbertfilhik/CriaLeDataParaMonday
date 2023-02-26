const Papa = require('papaparse');
const fs = require('fs');

const csvFilePath = './file/customerCSV.csv';
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

console.log(customers);
