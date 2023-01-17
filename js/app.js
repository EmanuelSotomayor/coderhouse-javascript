/*Importación de modulos*/
import { popUpConfig } from './popUp.js';
import { Token } from './token.js';

/*Hacemos referencia al documentElement, para poder traer las variables declaradas en css,
a través del objeto document.*/
const documentEl = document.documentElement;
/*CONSTANTES CSS*/
const darkModeVar = getComputedStyle(documentEl).getPropertyValue("--dark-color-background");
const ligthModeVar = getComputedStyle(documentEl).getPropertyValue("--light-color-background");
const darkModeText = getComputedStyle(documentEl).getPropertyValue("--dark-text-color");
const ligthModeText = getComputedStyle(documentEl).getPropertyValue("--light-text-color");
const darkModeBackgroundColor = getComputedStyle(documentEl).getPropertyValue("--dark-datatable-background-color");
const ligthModeBackgroundColor = getComputedStyle(documentEl).getPropertyValue("--light-datatable-color");
const ligthModeSwitch = getComputedStyle(documentEl).getPropertyValue("--light-switch-background-color");
const darkPopUpItemBackgroundColor = getComputedStyle(documentEl).getPropertyValue("--dark-popUpItem-background-color");
const lightPopUpItemBackgroundColor = getComputedStyle(documentEl).getPropertyValue("--ligth-popUpItem-background-color");
/*RESTO DE CONSTANTES*/
const switchButton = document.querySelector(".switch-item");
const switchContainer = document.querySelector(".switch-container");
const sunIcon = document.querySelector("#sun");
const moonIcon = document.querySelector("#moon");
const searchInput = document.querySelector("#search-header input");
const searchContainer = document.querySelector("#search-header");
const tableContent = document.querySelector("#table-content table tbody");
const tableBody = document.querySelector("#table-content");
const tableAllHeaders = document.querySelector("#table-content table thead tr");
const popUpContainer = document.querySelector(".popUpContainer");
const popUpItem = document.querySelector("#popUp");
const popUpCloseBtn = document.querySelector(".closeBtn");
/*CONTROLES DE PAGINACIÓN*/
const btnPrev = document.querySelector("#btn_prev");
const btnProx = document.querySelector("#btn_prox");

let tokenListAux = [];
let pagina_actual = 1;
let tokens_por_pagina = 8;

const obtenerTokens = async (pagina, tokensPorPagina) =>{

    const URLBase = "https://api.coingecko.com/api/v3/coins/markets";

    try{
        const fetchData = await fetch(`${URLBase}?vs_currency=usd&order=market_cap_desc&per_page=${tokensPorPagina}&page=${pagina}&sparkline=false`);
        const data = await fetchData.json();
        return data;
    }catch(error){
        console.log(error);
    }
};

const llenarArrayTokens = async (data)=>{

    /*Usamos esta expresión regular para detectar cuando el precio de un token
    viene con notación exponencial "e", va a detectar sí viene la e en minuscula o mayuscula*/
    const regExp = /[e]|[E]/gi;

    data.forEach((token)=>{
        let tokenAux = new Token();
        tokenAux.nombre = token.name;
        tokenAux.acronimo = token.symbol;

        /*Convertirmos el precio a string, para poder pasar la expresión regular,
        sí el precio contiene una notación exponencial, entonces le pasamos la función
        transformarDecimales() que toma el precio en float y calcula los decimales
        que debe aplicarle, en este caso, 12.
        De lo contrario, solo setea el precio normalmente.*/

        regExp.test(token.current_price.toString()) ? 
        tokenAux.precio = transformarDecimales(token.current_price, 12) : 
        tokenAux.precio = token.current_price;

        tokenAux.capitalMercado = token.market_cap;
        tokenAux.accionCirculacion = token.total_volume;
        tokenAux.imgs.push({"src": "./assets/icons/add.png"}
        );
        tokenAux.imgs.push({"src": "./assets/icons/remove.png"}
        );
        tokenAux.imgs.push({"src": `${token.image}`});
        tokenListAux.push(tokenAux);
    });
};

btnPrev.addEventListener("click", async ()=>{
    if(pagina_actual > 1){
        pagina_actual--;
        const tokenData = await obtenerTokens(pagina_actual, tokens_por_pagina);
        llenarArrayTokens(tokenData);
        cargarTokens(tokenListAux);
        tokenListAux.length = 0;
    }
});

btnProx.addEventListener("click", async ()=>{
    if(pagina_actual >= 1){
        pagina_actual++;
        const tokenData = await obtenerTokens(pagina_actual, tokens_por_pagina);
        llenarArrayTokens(tokenData);
        cargarTokens(tokenListAux);
        tokenListAux.length = 0;
    }
});

/*Cuando el DOM está cargado, muestra los primero 8 tokens*/
document.addEventListener("DOMContentLoaded", async ()=>{
    const tokenData = await obtenerTokens(1, 8);
    llenarArrayTokens(tokenData);
    cargarTokens(tokenListAux);
    tokenListAux.length = 0;
});

/*Esta función permite formatear un número con notacion exponencial
a decimales, ya que la API en algunos tokens, retorna su precio
como notación cientifica porque tiene muchos decimales*/
function transformarDecimales(value, precision = 0){
    if ( (0.9).toFixed() !== '1' ){
        return value.toFixed(precision);
    }
    let pow = Math.pow( 10, precision );
    return (Math.round( value * pow ) / pow).toFixed(precision);
}                                                           

const agregarTokenALista = (token)=>{

    return `
        <tr class="token">
            <td><img class="tokenImg" src="${token.imgs[2].src}" alt="Imagen no encontrada"/> 
            ${token.nombre}</td>
            <td>${token.acronimo.toUpperCase()}</td>
            <td>${token.precio}</td>
            <td>${token.capitalMercado}</td>
            <td>${token.accionCirculacion}</td>
            <td>
                <img class="actionIcon add" src="${token.imgs[0].src}" alt="Imagen no encontrada"/>
                <img class="actionIcon remove" src="${token.imgs[1].src}" alt="Imagen no encontrada"/>
            </td>
        </tr>
    `;
}

const filtrarTokens = async ()=>{
    //Le damos longitud 0 al array para que todos sus elementos se borren
    tokenListAux.length = 0;
    //Limpiamos todo lo que hay en el contenedor de la tabla
    tableContent.innerHTML = "";
    let datosBuscador = searchInput.value.trim().toLowerCase();
    let data = await obtenerTokens(1, 250);
    llenarArrayTokens(data);
    let tokensFiltrados = tokenListAux.filter((token)=>{
        return token.nombre.toLowerCase().includes(datosBuscador);
    });
        if(tokensFiltrados.length > 0){
            cargarTokens(tokensFiltrados);
        }

        if(searchInput.value == ""){
            tokenListAux.length = 0;
            pagina_actual = 1;
            let data = await obtenerTokens(pagina_actual, tokens_por_pagina);
            llenarArrayTokens(data);
            cargarTokens(tokenListAux);
        }
};

searchInput.addEventListener("input", filtrarTokens);

const cargarTokens = (tokensFiltrados)=>{
    let tabla = "";
    tokensFiltrados.forEach((token)=>{
        tabla+= agregarTokenALista(token);
    });
    tableContent.innerHTML = tabla;
    verificarAccion();
};

const verificarAccion = ()=>{
    const allImgs = document.querySelectorAll(".actionIcon");
        Array.from(allImgs).forEach((nodo)=>{
            nodo.addEventListener("click", (e)=>{
                const tokenSeleccionado = e.target.parentElement.parentElement;
                if(e.target.classList.contains("add")){
                    if(verificarTokenExistente(tokenSeleccionado) === null){
                        guardarTokenLocal(tokenSeleccionado);
                        abrirPopUp(popUpConfig[0].titulo, popUpConfig[0].src, popUpConfig[0].color);
                    }else{
                        abrirPopUp(popUpConfig[2].titulo, popUpConfig[2].src, popUpConfig[2].color);
                    }
                }else{
                    if(verificarTokenExistente(tokenSeleccionado)){
                        borrarTokenLocal(tokenSeleccionado);
                        abrirPopUp(popUpConfig[1].titulo, popUpConfig[1].src, popUpConfig[1].color);
                    }else{
                        abrirPopUp(popUpConfig[3].titulo, popUpConfig[3].src, popUpConfig[3].color);
                    }
                }
            });
        });
};

const guardarTokenLocal = (tokenSeleccionado) =>{

    const infoToken = tokenSeleccionado.querySelectorAll("td");
    const nombre = infoToken[0].innerText;
    const precio = infoToken[1].innerText;
    const acronimo = infoToken[2].innerText;
    const capitalMercado = infoToken[3].innerText;
    const accionCirculacion = infoToken[4].innerText;

    const tokenAux = new Token();
    tokenAux.nombre = nombre;
    tokenAux.acronimo = acronimo;
    tokenAux.precio = precio;
    tokenAux.capitalMercado = capitalMercado;
    tokenAux.accionCirculacion = accionCirculacion;
    tokenAux.imgs.push(infoToken[5].children[0].attributes[1].nodeValue);
    tokenAux.imgs.push(infoToken[5].children[1].attributes[1].nodeValue);
    tokenAux.imgs.push(tokenSeleccionado.childNodes[1].childNodes[0].attributes[1].nodeValue);

    localStorage.setItem(tokenAux.nombre, JSON.stringify(tokenAux));
};

const borrarTokenLocal = (tokenSeleccionado)=>{
    const infoToken = tokenSeleccionado.querySelectorAll("td");
    const nombre = infoToken[0].innerText;
    localStorage.removeItem(nombre);
};

const verificarTokenExistente = (tokenSeleccionado)=>{
    const infoToken = tokenSeleccionado.querySelectorAll("td");
    const nombre = infoToken[0].innerText;
    return localStorage.getItem(nombre);
};

//Apertura y cierre del popUp al agregar o borrar un token del localStorage
const abrirPopUp = (titulo, icono, colorBoton)=>{
    popUpContainer.classList.add("opened");
    popUpItem.innerHTML = `
        <img src="${icono}" alt="Icono no encontrado"/>
        <p id="title">${titulo}</p>
    `;
    popUpContainer.children[1].style.setProperty("background-color", colorBoton);
        if(switchButton.classList.contains("darkMode")){
            cambiarPopUp(darkPopUpItemBackgroundColor, ligthModeText);
        }else{
            cambiarPopUp(lightPopUpItemBackgroundColor, darkModeText);
        }
};

popUpCloseBtn.addEventListener("click", ()=>{
    popUpContainer.classList.remove("opened");
});

const cambiarModo = ()=>{
    switchButton.addEventListener('click', ()=>{
        switchButton.classList.toggle("ligthMode");
        switchButton.classList.toggle("darkMode");
        const trBackgroundElements = document.querySelector(".crypto-list #table-content table tr:nth-child(2n)");
            if(switchButton.classList.contains("darkMode")){
                switchButton.style.transform = "translate(125%, -50%)";
                switchContainer.style.backgroundColor = ligthModeSwitch;
                switchButton.style.backgroundColor = darkModeVar;
                cambiarIconos(moonIcon, sunIcon, "darkMode");
                cambiarFondo(darkModeVar);
                cambiarTabla(darkModeBackgroundColor, ligthModeText);
            }else{
                switchButton.style.transform = "translate(15%, -50%)";
                switchContainer.style.backgroundColor = darkModeVar;
                switchButton.style.backgroundColor = ligthModeSwitch;
                cambiarIconos(moonIcon, sunIcon, "sunMode");
                cambiarFondo(ligthModeVar);
                cambiarTabla(ligthModeBackgroundColor, darkModeText);
            }
    });
};

const cambiarFondo = (backgroundColor)=>{
    document.body.style.setProperty("background-color", backgroundColor);
};

const cambiarTabla = (headerBodyColor, textColor) =>{
        searchContainer.style.setProperty("background-color", headerBodyColor);
        tableBody.style.setProperty("background-color", headerBodyColor);
        tableAllHeaders.style.setProperty("color", textColor);
        tableContent.style.setProperty("color", textColor);
};

const cambiarIconos = (moon, sun, classMode)=>{
        if(classMode === "darkMode"){
            moon.style.setProperty("display", "none");
            sun.style.setProperty("display", "block");
            sun.firstElementChild.style.fill = '#FFFFFFFF';
        }else{
            moonIcon.style.setProperty("display", "block");
            sunIcon.style.setProperty("display", "none");
            sunIcon.firstElementChild.style.fill = '#FFFFFFFF';
        }
};

const cambiarPopUp = (backgroundColorPopUp, textColorPopUp, backgroundContainer)=>{
    popUpItem.style.setProperty("background-color", backgroundColorPopUp);
    popUpItem.children[1].style.setProperty("color", textColorPopUp);
    popUpContainer.style.setProperty("background-color", backgroundContainer);
};

//Invocación del Dark mode / Light mode
cambiarModo();