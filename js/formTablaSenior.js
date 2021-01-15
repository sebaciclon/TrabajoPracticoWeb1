
"use strict";

let url = "https://web-unicen.herokuapp.com/api/groups/leoRauch/prueba";
let contenedor = document.querySelector("#mensaje");

let cantInscripciones; // para saber cuantas inscripciones hay
let elemEditar; 
let elemEliminar;
mostrarDatos();
crearCaptcha();
buscar();

document.querySelector("#btnAdd1").addEventListener("click", enviarx1);
document.querySelector("#btnAdd3").addEventListener("click", enviarx3);
document.querySelector("#btnErase").addEventListener("click", vaciar);
document.querySelector("#terminoAbuscar").addEventListener("keyup", buscar);

/*********************************ENVIAR DATOS AL SERVIDOR**********************************/

function enviarDatosx1(){
    let nombre = document.querySelector("#nombre").value;
    let edad = document.querySelector("#edad").value;
    let fechaNacimiento = document.querySelector("#fecha").value;
    let puesto = document.querySelector("#puesto").value;

    if(nombre === "" || edad === "" || fechaNacimiento === "" || puesto === "Seleccione"){
        alert("Todos los campos son obligatorios");
        return;
    }
    if(validarCaptchaSenior()) {
        let datos = {
            "thing": {
                "nombre": nombre,
                "edad": edad,
                "fecha": fechaNacimiento,
                "puesto": puesto
            }
        };
        fetch(url, {
            "method": "POST",
            "mode": 'cors',
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(datos)
        })
        .then(function(r){
            if(!r.ok){
                console.log("error")
            }
            return r.json();
        })
        .then(function(json){

        })
        .catch(function(e){
            console.log(e);
        })
    }
}        
        
/**************************GENERACION Y VALIDACION DEL CAPTCHA******************************/
function numeroAleatorio(){
    return Math.floor(Math.random() * 9) + 1;
}

function crearCodigoAleatorio(){
    let arreglo = [];
    let max = 5;

    for (let i = 0; i < max; i++){
        arreglo.push(numeroAleatorio());
    }
    let cadena = arreglo.join("");
    return cadena;
}

function crearCaptcha() {
    document.querySelector("#numerosCaptcha").innerHTML = crearCodigoAleatorio();
}

function validarCaptchaSenior() {
    let numIngresadoCaptcha = document.getElementById("captcha").value;
    let numCaptcha = document.getElementById("numerosCaptcha").innerHTML;
    if(numIngresadoCaptcha === numCaptcha) {
        return true;
    }
    else{
        return false;
    }
} 

/*************************BORRAR TODOS LOS DATOS DEL SERVIDOR****************************/

function vaciar(){
    
    if(validarCaptchaSenior()){
        fetch(url, {
            "method": "GET",
            "mode": "cors"
        })
        .then(function(r) {
            if(!r.ok){
                console.log("error");
            }
            return r.json();
        })
        .then(function(json) {
            if(json.prueba.length === 0) {
                alert("No hay nada guardado en el servidor");
            } 
            else {
                for(let i = 0; i < json.prueba.length; i++){
                    fetch(url +"/"+ json.prueba[i]._id, {
                        "method": "DELETE",
                        "mode": "cors"
                    })
                    .then(function(r) {
                        if(!r.ok){
                            console.log("error");
                        }
                        return r.json();
                    })
                    .catch(function(e) {
                      console.log(e);
                    })
                }
                alert("Borrado Exitodo");
            }
        })
    }
    else {
        alert("Captcha Invalido - Intenta nuevamente");
        return;
    }
    vaciarTabla();
    crearCaptcha();
}

/*****************MOSTRAR EN LA TABLA LOS DATOS GUARDADOS EN EL SERVIDOR*********************/

function mostrarDatos() {
    fetch(url, {
        "method": "GET",
        "mode": "cors"
    })
    .then(function(r) {
        if(!r.ok){
            console.log("error");
        }
        return r.json();
    })
    .then(function(json) {
        console.log(json.prueba);
        for(let i = 0; i < json.prueba.length; i++) {
            let fila = tabla.insertRow (2);
            let col0 = fila.insertCell (0);
            let col1 = fila.insertCell (1);
            let col2 = fila.insertCell (2);
            let col3 = fila.insertCell (3);
            let col4 = fila.insertCell (4);
            let col5 = fila.insertCell (5);

            let botonEliminar = document.createElement("button");
            botonEliminar.innerHTML = "Eliminar";
            botonEliminar.setAttribute("data",json.prueba[i]._id);
            botonEliminar.classList.add("btnBorrarUno");
            botonEliminar.addEventListener("click",eliminar);

            let botonEditar = document.createElement("button");
            botonEditar.innerHTML = "Editar";
            botonEditar.setAttribute("type","reset");
            botonEditar.setAttribute("data",json.prueba[i]._id);
            botonEditar.classList.add("btnEditar");
            botonEditar.addEventListener("click",editar);
            
            cantInscripciones = json.prueba.length; // Guardo la cantidad de inscripciones
            
            col0.innerHTML = i+1;
            col1.innerHTML = json.prueba[i].thing.nombre;
            col2.innerHTML = json.prueba[i].thing.edad;
            col3.innerHTML = json.prueba[i].thing.fecha;
            col4.innerHTML = json.prueba[i].thing.puesto;
            col5.appendChild(botonEliminar,);
            col5.appendChild(botonEditar);
            
            if(json.prueba[i].thing.puesto === "Arquero")
                fila.className = "resaltarArquero";
            else
                if(json.prueba[i].thing.puesto === "Defensor")
                    fila.className = "resaltarDefensor";
                else
                    if(json.prueba[i].thing.puesto === "Volante")
                        fila.className = "resaltarVolante";
                    else
                        if(json.prueba[i].thing.puesto === "Delantero")
                            fila.className = "resaltarDelantero";
        }
    })
    .catch(function(e) {
        console.log(e);
    })
}

function enviarx1(){
    enviarDatosx1();
    vaciarTabla();    
    setTimeout(mostrarDatos,1000);
    crearCaptcha();
}

function enviarx3() {
    enviarDatosx1();
    enviarDatosx1();
    enviarDatosx1();
    vaciarTabla();
    setTimeout(mostrarDatos,1000);
    crearCaptcha();
} 

function vaciarTabla(){
    for(let j = 0; j < cantInscripciones; j++){
        tabla.deleteRow(2);
    }
    cantInscripciones = 0;
}

function eliminar(){
    if(validarCaptchaSenior()){
        elemEliminar = this.getAttribute("data"); //recupero el id del boton que se presiono
        fetch(url +"/"+ elemEliminar, {
            "method": "DELETE",
            "mode": "cors"
        })
        .then(function(r) {
            if(!r.ok){
                console.log("error");
            }
            return r.json();
        })
        .catch(function(e) {
        console.log(e);
        })
        vaciarTabla();
        setTimeout(mostrarDatos,1000);
        crearCaptcha();
    }
    else
        alert("Para eliminar una fila debe poner el Captcha válido");
} 

function editar(){
    if(validarCaptchaSenior()){
        let nombre = document.querySelector("#nombre").value;
        let edad = document.querySelector("#edad").value;
        let fechaNacimiento = document.querySelector("#fecha").value;
        let puesto = document.querySelector("#puesto").value;
        
        if(nombre === "" || edad === "" || fechaNacimiento === "" || puesto === "Seleccione"){
            alert("Para EDITAR debe completar TODOS los campos del formulario y validad el CAPTCHA");
            crearCaptcha();
            return;
        }
        let datos = {
            "thing": {
                "nombre": nombre,
                "edad": edad,
                "fecha": fechaNacimiento,
                "puesto": puesto
            }
        };
        elemEditar = this.getAttribute("data"); //recupero el id del boton que se presiono
        fetch(url +"/"+ elemEditar, {
            "method": "PUT",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(datos)
        })
        .then(function(r){
            if(!r.ok){
                console.log("error");
            }
            return r.json();
        })
        .then(function(json){

        })
        .catch(function(e){
            console.log(e);
        })
        vaciarTabla();
        setTimeout(mostrarDatos,1000);
        crearCaptcha();
    }
    else
        alert("Para EDITAR debe completar TODOS los campos del formulario y validad el CAPTCHA");
}
//********************************BUSCAR DATOS EN LA TABLA**************************************************************************************/
function buscar(){
  const tablaReg = document.querySelector("#tabla");
  const textoBuscado = document.querySelector("#terminoAbuscar").value.toLowerCase();
  let total = 0;
  //  Recorremos todas las filas con contenido de la tabla
  for(let i=2;i<tablaReg.rows.length;i++){
      // Si el td tiene la clase "noBuscar" no se busca en su contenido
      if(tablaReg.rows[i].classList.contains("noBuscar")){
          continue;
      }
      let found=false;
      const celdasFila = tablaReg.rows[i].getElementsByTagName('td');
      // Recorremos todas las celdas
      for(let j=0;j<celdasFila.length-1 && !found;j++){
          const compararCon = celdasFila[j].innerHTML.toLowerCase();
          // Buscamos el texto en el contenido de la celda
          if(textoBuscado.length == 0 || compararCon.indexOf(textoBuscado) > -1){
              found=true;
              total++;
          }
      }
      if(found){
          tablaReg.rows[i].style.display='';
      } else{
          // si no ha encontrado ninguna coincidencia, esconde la
          // fila de la tabla
          tablaReg.rows[i].style.display='none';
      }
  }
  
  // mostramos las coincidencias
  const ultimoTr = tablaReg.rows[tablaReg.rows.length-1];
  const td =ultimoTr.querySelector("td");
  ultimoTr.classList.remove("esconder","rojo");
  if (textoBuscado == "") {
      ultimoTr.classList.add("esconder");
  } else if (total) {
      td.innerHTML="Se ha encontrado "+total+" coincidencia"+((total>1)?"s":"");
  } else {
      ultimoTr.classList.add("rojo");
      td.innerHTML="No se han encontrado coincidencias";
  }
}


/*******************************************************************************************************/

















