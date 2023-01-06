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

popUpCloseBtn.addEventListener("click", ()=>{
    popUpContainer.classList.remove("opened");
});

//Objeto de configuración que contiene los mensajes a mostrar en el popUp

const popUpConfig = [
    {
        "titulo": "Token guardado con éxito",
        "src": "./assets/icons/added.png",
        "color": "#4CAF50"
    },
    {
        "titulo": "Token eliminado",
        "src": "./assets/icons/removed.png",
        "color": "#FF3D00"
    },
    {
        "titulo": "El token ya se encuentra almacenado",
        "src": "./assets/icons/warning.png",
        "color": "#FFCA28"
    },
    {
        "titulo": "El token no se encuentra almacenado",
        "src": "./assets/icons/error.png",
        "color": "#F44336"
    }
];

/*Declaración de la lista de tokens y de monedas actualmente más usadas*/
let fiatCoins = ["USD", "EUR", "ARS", "YEN"];

let tokensList = [
    {
        "nombre": "Bitcoin",
        "acronimo": "BTC",
        "precio": "16851,16",
        "capitalMercado": "324,449,150,088",
        "accionCirculacion": "19,253,075",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "Ethereum",
        "acronimo": "ETH",
        "precio": "1250,02",
        "capitalMercado": "152,957,326,533",
        "accionCirculacion": "122,373,866",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "Tether",
        "acronimo": "USDT",
        "precio": "0,9998",
        "capitalMercado": "66,251,229,246",
        "accionCirculacion": "66,263,713,430",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "USD Coin",
        "acronimo": "USDC",
        "precio": "1,00",
        "capitalMercado": "44,262,814,059",
        "accionCirculacion": "44,262,113,696",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "BNB",
        "acronimo": "BNB",
        "precio": "256.86",
        "capitalMercado": "41,088,643,455",
        "accionCirculacion": "159,963,937",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "XRP",
        "acronimo": "XRP",
        "precio": "0,3418",
        "capitalMercado": "17,291,548,200",
        "accionCirculacion": "50,563,767,827",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "Dogecoin",
        "acronimo": "Doge",
        "precio": "0,07274",
        "capitalMercado": "9,649,542,739",
        "accionCirculacion": "132,670,764,300",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "Cardano",
        "acronimo": "ADA",
        "precio": "0,2667",
        "capitalMercado": "9,207,472,496",
        "accionCirculacion": "34,518,640,464",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "DAI",
        "acronimo": "DAI",
        "precio": "0,9999",
        "capitalMercado": "5,746,643,526",
        "accionCirculacion": "5,747,338,664",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    },
    {
        "nombre": "LiteCoin",
        "acronimo": "LTC",
        "precio": "74,41",
        "capitalMercado": "5,358,639,265",
        "accionCirculacion": "71,986,542",
        "imgs":[
            {
                "src": "./assets/icons/add.png"
            },
            {
                "src": "./assets/icons/remove.png"
            }
        ]
    }
];

const agregarTokenALista = (token)=>{

    return `
        <tr class="token">
            <td>${token.nombre}</td>
            <td>${token.acronimo}</td>
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

const filtrarTokens = ()=>{
    let datosBuscador = searchInput.value.trim().toLowerCase();
    console.log(datosBuscador);
    let tokensFiltrados = tokensList.filter((token)=>{
        return token.nombre.toLowerCase().includes(datosBuscador);
    });
        if(tokensFiltrados.length > 0){
            cargarTokens(tokensFiltrados);
        }
};

const cargarTokens = (tokensFiltrados)=>{
    let tabla = "";
    tokensFiltrados.forEach((token)=>{
        tabla+= agregarTokenALista(token);
    });
    tableContent.innerHTML = tabla;

    verificarAccion();

};

const renderTokens = () =>{
    searchInput.addEventListener("input", filtrarTokens);
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

    const token = {
        "nombre": nombre,
        "acronimo": acronimo,
        "precio": precio,
        "capitalMercado": capitalMercado,
        "accionCirculacion": accionCirculacion,
        "imgs":[
            {
                "src": infoToken[5].children[0].attributes[1].nodeValue
            },
            {
                "src": infoToken[5].children[1].attributes[1].nodeValue
            }
        ]
    }
        localStorage.setItem(token.nombre, JSON.stringify(token));
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

//Invocación para renderizar los tokens
renderTokens();


//Apertura y cierre del popUp al agregar o borrar un token del localStorage

const abrirPopUp = (titulo, icono, colorBoton)=>{
    popUpContainer.classList.add("opened");
    popUpItem.innerHTML = `
        <img src="${icono}" alt="Icono no encontrado"/>
        <p id="title">${titulo}</p>
    `;
    popUpContainer.children[1].style.setProperty("background-color", colorBoton);
};

const switchPageMode = ()=>{
    switchButton.addEventListener('click', ()=>{
        switchButton.classList.toggle("ligthMode");
        switchButton.classList.toggle("darkMode");
        const trBackgroundElements = document.querySelector(".crypto-list #table-content table tr:nth-child(2n)");
            if(switchButton.classList.contains("darkMode")){
                switchButton.style.transform = "translate(125%, -50%)";
                switchContainer.style.backgroundColor = ligthModeSwitch;
                switchButton.style.backgroundColor = darkModeVar;
                changeIcons(moonIcon, sunIcon, "darkMode");
                changeBackground(darkModeVar);
                changeTableColor(darkModeBackgroundColor, ligthModeText);
            }else{
                switchButton.style.transform = "translate(15%, -50%)";
                switchContainer.style.backgroundColor = darkModeVar;
                switchButton.style.backgroundColor = ligthModeSwitch;
                changeIcons(moonIcon, sunIcon, "sunMode");
                changeBackground(ligthModeVar);
                changeTableColor(ligthModeBackgroundColor, darkModeText);
            }
    });
};

const changeBackground = (backgroundColor)=>{
    document.body.style.setProperty("background-color", backgroundColor);
};

const changeTableColor = (headerBodyColor, textColor) =>{
        searchContainer.style.setProperty("background-color", headerBodyColor);
        tableBody.style.setProperty("background-color", headerBodyColor);
        tableAllHeaders.style.setProperty("color", textColor);
        tableContent.style.setProperty("color", textColor);
};

const changeIcons = (moon, sun, classMode)=>{
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

//Invocación del darkMode-LigthMode
switchPageMode();