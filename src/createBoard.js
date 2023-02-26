const axios = require('axios');

const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzOTg0MzYxNCwidWlkIjo0MDE5MTg1MCwiaWFkIjoiMjAyMy0wMi0yNVQyMDoyNTo1NC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTU1NjU4NDcsInJnbiI6InVzZTEifQ.mpGJ1J8iQpo67JNWyKKAScNAlK3TfH8YFCgw5vI-gwg';
const boardName = 'CRM Board';

axios.post('https://api.monday.com/v2', {
  query: `mutation {
    create_board(board_name: "${boardName}", board_kind: "public") {
      id
      name
    }
  }`,
  headers: {
    Authorization: apiKey,
  },
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.error(err);
});
