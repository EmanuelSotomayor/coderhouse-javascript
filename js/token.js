export class Token{
    constructor(nombre, acronimo, precio, capitalMercado, accionCirculacion){
        this.nombre = nombre; //name
        this.acronimo = acronimo; //symbol
        this.precio = precio; //current_price
        this.capitalMercado = capitalMercado; //market_cap
        this.accionCirculacion = accionCirculacion; //total_volume
        this.imgs = []; //images array
    }
};