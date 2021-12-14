class Person {
  constructor(person, matrix, metrica) {
    this.person = person;
    this.matrix = matrix;
    this.matrizCoor = [];
    this.promedio = this.promedio();
    if (metrica == "1.1") { // Correlacion de Pearson
      this.setMatrizCorrZero();
      this.calcPearson();
    }
    if (metrica == "1.2") { // Distancia Coseno
      this.setMatrizCorrZero();
      this.calcCoseno();
    }
    if (metrica == "1.3") { // Distancia Euclidea
      this.setMatrizCorrZero();
      this.calcEuclidea();
    }
  }
  get getPerson() {
    return this.person;
  }
  get getPromedio() {
    return this.promedio;
  }
  promedio() {
    let n = 0;
    let out = 0;
    for (y in this.matrix[this.person]) {
      if (parseInt(this.matrix[this.person][y])) {
        n++;
        out += parseInt(this.matrix[this.person][y]);
      }
    }
    return out / n;
  }
  correlacion(persona) {
    return this.matrizCoor[this.person][persona];
  }
  setMatrizCorrZero() {
    for (let x = 0; x < this.matrix.length; x++) {
      this.matrizCoor[x] = new Array(this.matrix.length);
    }
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix.length; y++) {
        this.matrizCoor[x][y] = 0;
      }
    }
  }
  calcPearson() {
    let outS = "";
    out += `\rSimilaridad:\r`;
    for (x in this.matrix) {
      let correlacion = 0;
      var sx = 0; var sy = 0; var sxy = 0; var sx2 = 0; var sy2 = 0; var n = 0;
      if (parseInt(x) != parseInt(this.person)) {
        for (y in this.matrix[x]) {
          if (parseInt(this.matrix[this.person][y]) && parseInt(this.matrix[x][y])) {
            var xx = parseFloat(this.matrix[this.person][y]);
            var yy = parseFloat(this.matrix[x][y]);
            n++;
            sx = sx + xx; sy = sy + yy;
            sx2 = sx2 + xx * xx; sy2 = sy2 + yy * yy;
            sxy = sxy + xx * yy;
            var mx = (sx / n);
            var my = (sy / n);
            var dtx = Math.sqrt(sx2 / n - mx * mx);
            var dty = Math.sqrt(sy2 / n - my * my);
            var cov = (sxy / n - mx * my);
            correlacion = (cov / (dtx * dty)).toFixed(2);
          }
        }
        this.matrizCoor[this.person][x] = correlacion;
        outS = `sim(Person${this.person}, Person${x}) = ${correlacion}\r`;
        out += outS;
      }
    }
  }
  calcCoseno() {
    let outS = "";
    out += `\rSimilaridad:\r`;
    for (x in this.matrix) {
      let correlacion = 0;
      var sx = 0; var sy = 0; var sxy = 0; var sx2 = 0; var sy2 = 0;
      if (parseInt(x) != parseInt(this.person)) {
        for (y in this.matrix[x]) {
          if (parseInt(this.matrix[this.person][y]) && parseInt(this.matrix[x][y])) {
            var xx = parseFloat(this.matrix[this.person][y]);
            var yy = parseFloat(this.matrix[x][y]);
            sx = sx + xx; sy = sy + yy;
            sx2 = sx2 + xx * xx; sy2 = sy2 + yy * yy;
            sxy = sxy + xx * yy;
            var dtx = Math.sqrt(sx2);
            var dty = Math.sqrt(sy2);
            var cov = sxy;
            correlacion = (cov / (dtx * dty)).toFixed(2);
          }
        }
        this.matrizCoor[this.person][x] = correlacion;
        outS = `sim(Person${this.person}, Person${x}) = ${correlacion}\r`;
        out += outS;
      }
    }
  }
  calcEuclidea() {
    let outS = "";
    out += `\rSimilaridad:\r`;
    for (x in this.matrix) {
      let correlacion = 0;
      var sx = 0; var sy = 0; var sxy = 0; var sx2 = 0; var sy2 = 0;
      if (parseInt(x) != parseInt(this.person)) {
        for (y in this.matrix[x]) {
          if (parseInt(this.matrix[this.person][y]) && parseInt(this.matrix[x][y])) {
            var xx = parseFloat(this.matrix[this.person][y]);
            var yy = parseFloat(this.matrix[x][y]);
            sxy = sxy + xx - yy;
            var cov = sxy * sxy;
            correlacion = Math.sqrt(cov).toFixed(2);
          }
        }
        this.matrizCoor[this.person][x] = correlacion;
        outS = `sim(Person${this.person}, Person${x}) = ${correlacion}\r`;
        out += outS;
      }
    }
  }
}

let myMatrix = [];
let currentPerson;
let out = "";

function guiones() {
  for (a in myMatrix) {
    for (b in myMatrix[a]) {
      if (myMatrix[a][b] == '-') {
        return true;
      }
    }
  }
  return false;
}

function vecinosProximos(num, currentPerson, euclidea) {
  let outF = [];
  out += `\rVecinos seleccionados:\r`;
  let outV = "";
  let array = [];
  for (x in currentPerson.matrizCoor[currentPerson.person]) {
    const dupla = { vecino: x, valor: currentPerson.matrizCoor[currentPerson.person][x] };
    array.push(dupla);
  }
  if (euclidea == "1.3") {
    array.sort(function (a, b) {
      return a.valor - b.valor;
    });
  } else {
    array.sort(function (a, b) {
      return b.valor - a.valor;
    });
  }
  for (let i = 0; i < num; i++) {
    if (array[i].vecino != currentPerson.getPerson) {
      outF.push(array[i].vecino);
      outV = `Vecino ${array[i].vecino}\r`;
      out += outV;
    } else {
      num++;
    }
  }
  return outF;
}

function promedioPersona(matrix, vecino) {
  let n = 0;
  let out = 0;
  for (y in matrix[vecino]) {
    if (parseInt(matrix[vecino][y])) {
      n++;
      out += parseInt(matrix[vecino][y]);
    }
  }
  return out / n;
}

function predecir() {
  let outM = "";
  let outI = "";
  var salidahtml = document.getElementById('matrizNueva');
  var num = document.getElementById('num_vecinos').value;
  var metrica = document.getElementById('metrica').value;
  var prediccion = document.getElementById('prediccion').value;
  if (metrica == 1 || prediccion == 2 || num == '') {
    salidahtml.innerHTML = "Faltan parametros por especificar";
  } else {
    if (num >= myMatrix.length || num == 0) {
      salidahtml.innerHTML = "Numero de vecinos incorrecto";
    } else {
      let button = document.querySelector(".button");
      while (guiones()) {
        for (x in myMatrix) {
          for (w in myMatrix[x]) {
            if (myMatrix[x][w] == '-') {
              currentPerson = new Person(x, myMatrix, metrica);
              if (prediccion == "2.1") { // Prediccion simple
                let item;
                let top = 0;
                let bot = 0;
                let vecinos = vecinosProximos(num, currentPerson, metrica);
                for (let i = 0; i < vecinos.length; i++) {
                  top += currentPerson.matrizCoor[currentPerson.getPerson][vecinos[i]] * myMatrix[vecinos[i]][w];
                }
                for (let i = 0; i < vecinos.length; i++) {
                  bot += parseFloat(currentPerson.matrizCoor[currentPerson.getPerson][vecinos[i]]);
                }
                item = (top / bot).toFixed(2);
                if (isNaN(item) || item <= 0 || item > 5) {
                  item = currentPerson.getPromedio.toFixed(2);
                  myMatrix[currentPerson.getPerson][w] = item;
                } else {
                  myMatrix[currentPerson.getPerson][w] = item;
                }
                out += `\rCalculo de cada prediccion:\r`;
                outI = `rˆ(Person${currentPerson.getPerson}, Item${parseInt(w) + 1}) = ${item}\r`;
                out += outI;
              } else { //Diferencia con la media
                let item;
                let top = 0;
                let bot = 0;
                let vecinos = vecinosProximos(num, currentPerson, metrica);
                for (let i = 0; i < vecinos.length; i++) {
                  top += (currentPerson.matrizCoor[currentPerson.getPerson][vecinos[i]] * (myMatrix[vecinos[i]][w] - promedioPersona(myMatrix, vecinos[i])));
                }
                for (let i = 0; i < vecinos.length; i++) {
                  bot += parseFloat(currentPerson.matrizCoor[currentPerson.getPerson][vecinos[i]]);
                }
                item = (currentPerson.getPromedio + top / bot).toFixed(2);
                if (isNaN(item)) {
                  item = currentPerson.getPromedio.toFixed(2);
                  myMatrix[currentPerson.getPerson][w] = item;
                } else {
                  myMatrix[currentPerson.getPerson][w] = item;
                }
                out += `\rCalculo de cada prediccion:\r`;
                outI = `rˆ(Person${currentPerson.getPerson}, Item${parseInt(w) + 1}) = ${item}\r`;
                out += outI;
              }
            }
          }
        }
      }
      //Salida
      for (x in myMatrix) {
        for (y in myMatrix[x]) {
          outM += myMatrix[x][y] + " ";
        }
        outM += '\r';
      }
      salidahtml.innerHTML = `Matriz de utilidad:\r` + outM + out;
      button.disabled = true;
    }
  }
}

function read(input) {
  let button = document.querySelector(".button");
  button.disabled = false;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var contents = e.target.result;
      myMatrix = contents.split("\n");
      for (x in myMatrix) {
        myMatrix[x] = myMatrix[x].replace('\r', '');
        myMatrix[x] = myMatrix[x].split(" ");
      }
      mostrarMatrizOri(myMatrix);
    };
    reader.readAsText(input.files[0]);
  }
  out = "";
}

function mostrarMatrizOri(matriz) {
  console.log(myMatrix);
  let out = "";
  var elemento = document.getElementById('matrizOriginal');
  for (x in matriz) {
    for (y in matriz[x]) {
      out += matriz[x][y] + " ";
    }
    out += '\r';
  }
  elemento.innerHTML = out;
}
