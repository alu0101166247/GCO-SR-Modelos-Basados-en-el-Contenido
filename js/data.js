let myMatrix = [];

function generarTablas() {
  let salidahtml = document.getElementById('tablas');
  
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  table.appendChild(thead);
  table.appendChild(tbody);

  // Adding the entire table to the body tag
  salidahtml.appendChild(table);

  // Creating and adding data to first row of the table
  let row_1 = document.createElement('tr');
  let heading_1 = document.createElement('th');
  heading_1.innerHTML = "Sr. No.";
  let heading_2 = document.createElement('th');
  heading_2.innerHTML = "Name";
  let heading_3 = document.createElement('th');
  heading_3.innerHTML = "Company";

  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  thead.appendChild(row_1);


  // Creating and adding data to second row of the table
  let row_2 = document.createElement('tr');
  let row_2_data_1 = document.createElement('td');
  row_2_data_1.innerHTML = "1.";
  let row_2_data_2 = document.createElement('td');
  row_2_data_2.innerHTML = "James Clerk";
  let row_2_data_3 = document.createElement('td');
  row_2_data_3.innerHTML = "Netflix";

  row_2.appendChild(row_2_data_1);
  row_2.appendChild(row_2_data_2);
  row_2.appendChild(row_2_data_3);
  tbody.appendChild(row_2);


  // Creating and adding data to third row of the table
  let row_3 = document.createElement('tr');
  let row_3_data_1 = document.createElement('td');
  row_3_data_1.innerHTML = "2.";
  let row_3_data_2 = document.createElement('td');
  row_3_data_2.innerHTML = "Adam White";
  let row_3_data_3 = document.createElement('td');
  row_3_data_3.innerHTML = "Microsoft";

  row_3.appendChild(row_3_data_1);
  row_3.appendChild(row_3_data_2);
  row_3.appendChild(row_3_data_3);
  tbody.appendChild(row_3);

  let button = document.querySelector(".button");
  button.disabled = true;
}

function read(input) {
  let button = document.querySelector(".button");
  button.disabled = false;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let contents = e.target.result;
      myMatrix = contents.split("\n");
      mostrarDocumentos(myMatrix);
      for (x in myMatrix) {
        myMatrix[x] = myMatrix[x].replace('\r', '');
        myMatrix[x] = myMatrix[x].replace(/\,/g, '');
        myMatrix[x] = myMatrix[x].replace(/\./g, '');
        myMatrix[x] = myMatrix[x].split(" ");
      }
      console.log(myMatrix);
    };
    reader.readAsText(input.files[0]);
  }
  out = "";
}

function mostrarDocumentos(matriz) {
  let out = "";
  let elemento = document.getElementById('documentos');
  for (x in matriz) {
    for (y in matriz[x]) {
      out += matriz[x][y];
    }
    out += '\r';
  }
  elemento.innerHTML = out;
}
