export function MyRound(value, decimal){
    let MyPow;
    let result;
    MyPow = Math.pow(10,decimal);
    result = Math.round( value*MyPow ) / MyPow;
    return Number(result);
}

function Mass(w) {
        let S_Osnovaniya;
        let S_Vershini;
        let SS;
        let Scobka;
        let V1, V2;
        let UdPogrV;
        S_Osnovaniya = w.dx2 * w.dy2;
        S_Vershini = w.ux *w.uy;
        SS = S_Osnovaniya * S_Vershini;
        Scobka = S_Osnovaniya + S_Vershini + Math.sqrt(SS);
        V1 = w.dx1 * w.dy1 * w.dh1;
        V2 = w.dh2 * Scobka / 3;
        w.Result.V = V1 + V2;
        UdPogrV = 1000 / w.Natura;
        w.Result.M = w.Result.V / UdPogrV;
    return w;
}
export {Mass};