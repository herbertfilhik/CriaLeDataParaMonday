const axios = require('axios'); // para o axios
const fs = require('fs');

const csvFilePath = 'C:/Users/herbe/projetos_hlima/IncluirContasMondayDotCom/file/customerCSV.csv';

// Lê o arquivo CSV e converte para um array de objetoscls
function csvToArray(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j];
    }

    data.push(row);
  }

  return data;
}

// Lê o arquivo CSV e preenche a tabela
async function criarTabelaComDadosDoCSV() {
  try {
    const csv = await fs.promises.readFile(csvFilePath, 'utf-8');
    const data = csvToArray(csv);
    const table = document.getElementById('tabela-dados');

    // Cria o cabeçalho da tabela
    const headerRow = document.createElement('tr');
    for (let key in data[0]) {
      const headerCell = document.createElement('th');
      headerCell.appendChild(document.createTextNode(key));
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Preenche a tabela com os dados
    data.forEach(rowData => {
      const row = document.createElement('tr');
      for (let key in rowData) {
        const cell = document.createElement('td');
        cell.appendChild(document.createTextNode(rowData[key]));
        row.appendChild(cell);
      }
      table.appendChild(row);
    });
  } catch (error) {
    console.log(error);
  }
}


criarTabelaComDadosDoCSV();
