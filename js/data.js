let stopWords = []; //Vector con todas las Stop Words
let myMatrix = []; //Matriz inicial sin simbolos ni stopwords
let matrixHash = []; //Matriz para calcular los TF, IDF y TF-IDF
let words = []; //Matriz con todas las palabras de todos los documentos sin repetir
let wordsHash = {}; //Hash con en numero de veces que cada palabra se repite en todos los documentos (para IDF)
let numDocuments = 0; //Numero total de documentos
let similaridad = []; //Matriz para calcular la similaridad

//Funcion para ver si una matriz esta limpia
function limpio(matriz) {
  for (x in matriz) {
    for (y in matriz[x]) {
      if (matriz[x][y] === "" || matriz[x][y] === " " || matriz[x][y] === "-") {
        return false;
      }
    }
  }
  return true;
}

//Funcion para limpiar una matriz
function limpiar(matriz) {
  while (!limpio(matriz)) {
    for (x in matriz) {
      for (y in matriz[x]) {
        if (
          matriz[x][y] === "" ||
          matriz[x][y] === " " ||
          matriz[x][y] === "-"
        ) {
          if (matriz[x].length === 1) {
            matriz.length--;
          } else {
            matriz[x].splice(y, 1);
          }
        }
      }
    }
  }
}

//Funcion que llena el vector de Stop Words
function llenar_stopWords(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        stopWords = rawFile.responseText.replace(/\r/g, "").split("\n");
        stopWords = stopWords.filter((pal) => pal !== "");
      }
    }
  };
  rawFile.send(null);
  console.log(`Vector de Stop Words:`);
  console.log(stopWords);
}

//Cuenta cuantas veces esta contenida una palabra en todos los documentos (Sin contar repeticion en mismo documento)
function llenar_wordsHash() {
  numDocuments = 0;
  wordsHash = [];
  for (x in myMatrix) {
    numDocuments++;
    for (y in myMatrix[x]) {
      if (!words.includes(myMatrix[x][y].toLowerCase())) {
        words.push(myMatrix[x][y].toLowerCase());
        wordsHash[myMatrix[x][y].toLowerCase()] =
          (wordsHash[myMatrix[x][y].toLowerCase()] || 0) + 1;
      }
    }
    words = [];
  }
  console.log(`Hash de todas las palabras:`);
  console.log(wordsHash);
}

//Junta todas las palabras de todos los documentos
function llenar_words() {
  words = [];
  for (x in myMatrix) {
    for (y in myMatrix[x]) {
      if (!words.includes(myMatrix[x][y].toLowerCase())) {
        words.push(myMatrix[x][y].toLowerCase());
      }
    }
  }
  console.log(`Todas las palabras:`);
  console.log(words);
}

//Llena la matriz similaridad
function llenar_similaridad() {
  similaridad = [];
  for (x in myMatrix) {
    if (myMatrix[x].length > 1) {
      for (y in words) {
        similaridad.push(words[y]);
      }
      similaridad.push(" ");
    }
  }
  similaridad = similaridad.join(" ").split("   ");
  for (x in similaridad) {
    similaridad[x] = similaridad[x].split(" ");
  }
  for (x in similaridad) {
    for (y in similaridad[x]) {
      if (similaridad[x][y] != "") {
        documentHash = {};
        myMatrix[x].forEach(function (word) {
          documentHash[word.toLowerCase()] =
            (documentHash[word.toLowerCase()] || 0) + 1;
        });
        if (documentHash[similaridad[x][y].toLowerCase()]) {
          similaridad[x][y] = documentHash[similaridad[x][y].toLowerCase()];
        } else {
          similaridad[x][y] = 0;
        }
      }
    }
  }
  limpiar(similaridad);

  console.log(`Matriz similaridad limpia:`);
  console.log(similaridad);
}

//Llena la matriz hash
function llenar_matrizHash() {
  matrixHash = [];
  for (x in myMatrix) {
    matrixHash.push("-a");
  }
  matrixHash = matrixHash.join(" ").split(" ");
  for (x in matrixHash) {
    matrixHash[x] = matrixHash[x].split("a");
  }
  for (x in myMatrix) {
    documentHash = {};
    myMatrix[x].forEach(function (word) {
      documentHash[word.toLowerCase()] =
        (documentHash[word.toLowerCase()] || 0) + 1;
    });
    for (y in Object.keys(documentHash)) {
      const dupla = {
        palabra: Object.keys(documentHash)[y],
        veces: documentHash[Object.keys(documentHash)[y]],
      };
      matrixHash[x].push(dupla);
    }
  }

  limpiar(matrixHash);

  console.log(`MatrizHash:`);
  console.log(matrixHash);
}

// Calcular y muestra la tabla de la similaridad Coseno de cada par de documentos
function similaridadCoseno() {
  llenar_similaridad(); //Llena la matriz similaridad para calcular la similaridad coseno

  let salidahtml = document.getElementById("tablaSimilaridad");
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  salidahtml.appendChild(table);
  let row_1 = document.createElement("tr");
  let heading_1 = document.createElement("th");
  heading_1.innerHTML = "Documento";
  let heading_2 = document.createElement("th");
  heading_2.innerHTML = "Documento";
  let heading_3 = document.createElement("th");
  heading_3.innerHTML = "Similaridad Coseno";
  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  thead.appendChild(row_1);

  for (x in similaridad) {
    for (y in similaridad) {
      let row = document.createElement("tr");
      let row_data_1 = document.createElement("td");
      row_data_1.innerHTML = x;
      let row_data_2 = document.createElement("td");
      row_data_2.innerHTML = y;
      let row_data_3 = document.createElement("td");
      let top = [];
      let botI = 0;
      let botD = 0;
      for (z in similaridad[x]) {
        top.push(similaridad[x][z] * similaridad[y][z]);
      }
      top = top.reduce((a, b) => a + b, 0);
      for (z in similaridad[x]) {
        botI += Math.pow(similaridad[x][z], 2);
        botD += Math.pow(similaridad[y][z], 2);
      }
      botI = Math.sqrt(botI);
      botD = Math.sqrt(botD);
      row_data_3.innerHTML =
        (top / (botI * botD)).toFixed(2) == 1
          ? "* " + (top / (botI * botD)).toFixed(0) + " *"
          : (top / (botI * botD)).toFixed(2);
      row.appendChild(row_data_1);
      row.appendChild(row_data_2);
      row.appendChild(row_data_3);
      tbody.appendChild(row);
    }
  }
}

// Calcula y muestra las tablas de TF, IDF, TF-IDF y prepara matrices
function generarTablas() {
  let salidahtml = document.getElementById("tablas");
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  salidahtml.appendChild(table);
  let row_1 = document.createElement("tr");
  let heading_1 = document.createElement("th");
  heading_1.innerHTML = "Indice";
  let heading_2 = document.createElement("th");
  heading_2.innerHTML = "Término";
  let heading_3 = document.createElement("th");
  heading_3.innerHTML = "Repeticiones";
  let heading_4 = document.createElement("th");
  heading_4.innerHTML = "TF";
  let heading_5 = document.createElement("th");
  heading_5.innerHTML = "IDF";
  let heading_6 = document.createElement("th");
  heading_6.innerHTML = "TF-IDF";
  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  row_1.appendChild(heading_4);
  row_1.appendChild(heading_5);
  row_1.appendChild(heading_6);
  thead.appendChild(row_1);

  llenar_wordsHash(); //Cuenta cuantas veces esta contenida una palabra en todos los documentos (Sin contar repeticion en mismo documento)
  llenar_words(); //Junta todas las palabras de todos los documentos
  llenar_matrizHash(); //Llena la matrizHash

  for (x in matrixHash) {
    let row = document.createElement("tr");
    let row_data_1 = document.createElement("td");
    row_data_1.innerHTML = `Documento ${x}`;
    row.appendChild(row_data_1);
    tbody.appendChild(row);

    for (y in matrixHash[x]) {
      let row = document.createElement("tr");
      let row_data_1 = document.createElement("td");
      row_data_1.innerHTML = y;
      let row_data_2 = document.createElement("td");
      row_data_2.innerHTML = matrixHash[x][y].palabra;
      let row_data_3 = document.createElement("td");
      row_data_3.innerHTML = matrixHash[x][y].veces;
      let row_data_4 = document.createElement("td");
      let tf = matrixHash[x][y].veces / myMatrix[x].length;
      row_data_4.innerHTML = tf.toFixed(4);
      let row_data_5 = document.createElement("td");
      let idf = Math.log(numDocuments / wordsHash[matrixHash[x][y].palabra]);
      row_data_5.innerHTML = idf.toFixed(4);
      let row_data_6 = document.createElement("td");
      row_data_6.innerHTML = (tf * idf).toFixed(4);

      row.appendChild(row_data_1);
      row.appendChild(row_data_2);
      row.appendChild(row_data_3);
      row.appendChild(row_data_4);
      row.appendChild(row_data_5);
      row.appendChild(row_data_6);
      tbody.appendChild(row);
    }
  }

  similaridadCoseno(); // Calcular la similaridad Coseno de cada par de documentos

  let button = document.querySelector(".button");
  button.disabled = true;
}

//Funcion que lee el txt y carga la info limpia en myMatrix
function read(input) {
  llenar_stopWords("/stopWords.txt");
  let salida_tablas = document.getElementById("tablas");
  let salida_tablas_similaridad = document.getElementById("tablaSimilaridad");
  salida_tablas.innerHTML = "";
  salida_tablas_similaridad.innerHTML = "";
  myMatrix = [];
  let button = document.querySelector(".button");
  button.disabled = false;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let contents = e.target.result;
      myMatrix = contents.split("\n");
      mostrarDocumentos(myMatrix);
      for (x in myMatrix) {
        myMatrix[x] = myMatrix[x].replace(/\?|!|\.|,|\r|;/g, "");
        myMatrix[x] = myMatrix[x].replace(/\s+/g, " ");
        myMatrix[x] = myMatrix[x].split(" ");
      }
      for (x in myMatrix) {
        for (y in myMatrix[x]) {
          if (stopWords.includes(myMatrix[x][y].toLowerCase())) {
            myMatrix[x][y] = "";
          }
        }
      }
      limpiar(myMatrix);
      console.log(`Matriz inicial limpia:`);
      console.log(myMatrix);
    };
    reader.readAsText(input.files[0]);
  }
}

//Funcion que muestra los documentos originales en el html
function mostrarDocumentos(matriz) {
  let out = "";
  let elemento = document.getElementById("documentos");
  for (x in matriz) {
    for (y in matriz[x]) {
      out += matriz[x][y];
    }
    out += "\r\r";
  }
  elemento.innerHTML = out;
}
