const switchButton = document.querySelector(".switch-item");
const switchContainer = document.querySelector(".switch-container");
const sunIcon = document.querySelector("#sun");
const moonIcon = document.querySelector("#moon");
const searchInput = document.querySelector("#search-header input");
const tableContent = document.querySelector("#table-content table tbody");
/*Hacemos referencia al documentElement, para poder traer las variables declaradas en css,
a través del objeto document.*/
const documentEl = document.documentElement;
/*Declaración de la lista de tokens y de monedas actualmente más usadas*/
let fiatCoins = ["USD", "EUR", "ARS", "YEN"];
let tokensList = [
    {
        "nombre": "Bitcoin",
        "acronimo": "BTC",
        "precio": "16851,16",
        "capitalMercado": "324,449,150,088",
        "accionCirculacion": "19,253,075"
    },
    {
        "nombre": "Ethereum",
        "acronimo": "ETH",
        "precio": "1250,02",
        "capitalMercado": "152,957,326,533",
        "accionCirculacion": "122,373,866"
    },
    {
        "nombre": "Tether",
        "acronimo": "USDT",
        "precio": "0,9998",
        "capitalMercado": "66,251,229,246",
        "accionCirculacion": "66,263,713,430"
    },
    {
        "nombre": "USD Coin",
        "acronimo": "USDC",
        "precio": "1,00",
        "capitalMercado": "44,262,814,059",
        "accionCirculacion": "44,262,113,696"
    },
    {
        "nombre": "BNB",
        "acronimo": "BNB",
        "precio": "256.86",
        "capitalMercado": "41,088,643,455",
        "accionCirculacion": "159,963,937"
    },
    {
        "nombre": "XRP",
        "acronimo": "XRP",
        "precio": "0,3418",
        "capitalMercado": "17,291,548,200",
        "accionCirculacion": "50,563,767,827"
    },
    {
        "nombre": "Dogecoin",
        "acronimo": "Doge",
        "precio": "0,07274",
        "capitalMercado": "9,649,542,739",
        "accionCirculacion": "132,670,764,300"
    },
    {
        "nombre": "Cardano",
        "acronimo": "ADA",
        "precio": "0,2667",
        "capitalMercado": "9,207,472,496",
        "accionCirculacion": "34,518,640,464"
    },
    {
        "nombre": "DAI",
        "acronimo": "DAI",
        "precio": "0,9999",
        "capitalMercado": "5,746,643,526",
        "accionCirculacion": "5,747,338,664"
    },
    {
        "nombre": "LiteCoin",
        "acronimo": "LTC",
        "precio": "74,41",
        "capitalMercado": "5,358,639,265",
        "accionCirculacion": "71,986,542"
    }
];

const agregarTokenALista = (token)=>{
    return `
        <tr>
            <td>${token.nombre}</td>
            <td>${token.acronimo}</td>
            <td>${token.precio}</td>
            <td>${token.capitalMercado}</td>
            <td>${token.accionCirculacion}</td>
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
            console.log(tokensFiltrados);
            cargarTokens(tokensFiltrados);
        }
};

const cargarTokens = (tokensFiltrados)=>{
    let tabla = "";
    tokensFiltrados.forEach((token)=>{
        tabla+= agregarTokenALista(token);
    });
    tableContent.innerHTML = tabla;
};

const renderTokens = ()=>{
    searchInput.addEventListener("input", filtrarTokens);
};

//Invocación para renderizar los tokens
renderTokens();


const switchPageMode = ()=>{

    const darkModeVar = getComputedStyle(documentEl).getPropertyValue("--dark-color-background");
    const ligthModeVar = getComputedStyle(documentEl).getPropertyValue("--light-color-background");
    const darkModeText = getComputedStyle(documentEl).getPropertyValue("--dark-text-color");
    const ligthModeText = getComputedStyle(documentEl).getPropertyValue("--light-text-color");
    const ligthModeSwitch = getComputedStyle(documentEl).getPropertyValue("--light-switch-background-color");

    switchButton.addEventListener('click', ()=>{
        switchButton.classList.toggle("ligthMode");
        switchButton.classList.toggle("darkMode");
            if(switchButton.classList.contains("darkMode")){
                switchButton.style.transform = "translate(125%, -50%)";
                switchContainer.style.backgroundColor = ligthModeSwitch;
                switchButton.style.backgroundColor = darkModeVar;
                changeIcons(moonIcon, sunIcon, "darkMode");
                changeBackground(darkModeVar);
            }else{
                switchButton.style.transform = "translate(15%, -50%)";
                switchContainer.style.backgroundColor = darkModeVar;
                switchButton.style.backgroundColor = ligthModeSwitch;
                changeIcons(moonIcon, sunIcon, "sunMode");
                changeBackground(ligthModeVar);
            }
    });
};

const changeBackground = (backgroundColor)=>{
    document.body.style.setProperty("background-color", backgroundColor);
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