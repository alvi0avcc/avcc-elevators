export function DateIsoToString( date ) {
    let result = date.getFullYear() + '-' + 
                ( date.getMonth() < 9 ? '0' : '' ) + ( date.getMonth() + 1 ) + '-' +
                ( date.getDate() < 10 ? '0' : '' ) + date.getDate();
    return result;
}

//--------------------------------------------
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
//--------------------------------------------
