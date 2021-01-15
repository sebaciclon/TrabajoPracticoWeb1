"use strict";

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
    document.getElementById("numerosCaptcha").innerHTML = crearCodigoAleatorio();
}

crearCaptcha();

function validar() {
    let num = document.getElementById("captcha").value;
    console.log(num);
    let numCaptcha = document.getElementById("numerosCaptcha").innerHTML;
    console.log(numCaptcha);
    if(num === numCaptcha) {
        alert("Envio Exitoso!");
    }else {
        alert("Captcha Invàlido");
    }
} 

document.querySelector("#formulario").addEventListener("submit", validar)




