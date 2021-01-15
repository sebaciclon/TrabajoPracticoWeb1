function loadClick(event){
    event.preventDefault();
    //fetch("https://web-unicen.herokuapp.com/api/html?")
    fetch("http://localhost/proyectos/TPE3/partialRender.html").then( function(response){
        console.log("ok");  
        console.log(response);  
        response.text().then(t=> document.querySelector("#use-ajax").innerHTML = t);
    });
}
let jsloads = document.querySelectorAll(".js-load");
jsloads.forEach(e=> e.addEventListener("click", loadClick));
