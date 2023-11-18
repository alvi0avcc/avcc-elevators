import { ElevatorOnline } from './elevatorOnline.js';

class cUser {
    constructor() {
        this.email   = '';
        this.password   = '';
        this.name       = '';
        this.surname    = '';
        this.loginStatus    = false;
        this.response   = '';
        this.responseDate = null;
        this.Comments   = '';
    }

    get get_UserInfo() {
        return User;
    }
    get get_LoginStatus() {
        return ( this.loginStatus );
    }

    get get_ServerResponse() {
        let result = {
            response    : '',
            date        : null
        }
        if ( this.loginStatus ) {
            result.response = this.response;
            result.date = this.responseDate;
            }

        return ( result );
    }

    set set_ServerResponse( response ) {
        this.response = response;
        this.responseDate = new Date;

        console.log('set_ServerResponse =',response);

        if ( response.login ) {
            this.loginStatus = true;
            this.email = response.email;
            this.name = response.name;
            this.surname = response.surname;
        } else {
            this.loginStatus = false;
            this.name = '';
            this.surname = '';
            //alert('Error ! Server response - errno = ' + response.errno + ', code = ' + response.code +', syscall = ' + response.syscall);
        }
        console.log(User.get_UserInfo);
    }

    get ServerOnline(){
        let result = false;
        fetch( ElevatorOnline.get_ServerPath , { method: 'GET', credentials: 'include' })
            .then((res) => res.json())
            .then((status) => result = status.online );
            
        return result;
    }

    SignIn( email, pass ){

        if ( email == '' || email == null ) email = 'demo';
        if ( pass == '' || pass == null ) pass = 'demo';

       // console.log('SignIn=',login,pass);
        //console.log('{}=',{ login: login, password: pass });
        //console.log('Path =',ElevatorOnline.get_ServerPath);

        return new Promise ( function(resolve, reject) {
        fetch( ElevatorOnline.get_ServerPath + "login" , { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            credentials: 'include',
            keepalive: true,
            body: JSON.stringify( { email: email, password: pass } )
        } ).then(response => response.json()).then((data) => {
            console.log('SignIn server response = ',data);
            User.set_ServerResponse = data;
            if ( !data.login ) alert('Error ! Server response - errno = ' + data.errno + ', code = ' + data.code +', syscall = ' + data.syscall + ', message = ' + data.message);
            //console.log(User.get_UserInfo);
            //ElevatorOnline.get_Inspection_List({filter: 'all'});
            resolve( User.loginStatus );
            } );

        });
    }

    SignOut(){
        return new Promise ( function(resolve, reject) {
        fetch( ElevatorOnline.get_ServerPath + "logout" , { 
            method: 'POST',
            credentials: 'include'
        } ).then(response => response.json()).then((data) => {
            User.set_ServerResponse = data;
            console.log('SignOut server response = ',data);
            console.log(User.get_UserInfo);
            //ElevatorOnline.get_Inspection_List({filter: 'all'});
            resolve( User.loginStatus );
            } );

        });
    }

    get get_UserFullName(){
        console.log('get_UserFullName = ', this.get_UserInfo);
        let result = '';
        if ( this.name ) result = this.name;
        if ( this.surname ) result = result + ' ' + this.surname;
        if ( result == '' ) result = this.email;
        return ( result );
    }

    get get_UserFullNameAndEmail(){
        console.log('get_UserFullName = ', this.get_UserInfo);
        let result = '';
        if ( this.name ) result = this.name;
        if ( this.surname ) result = result + ' ' + this.surname;
        if ( result == '' ) result = this.email
            else result = result + ' ( ' + this.email + ' )';
        return ( result );
    }

    get get_UserName(){
        return this.name;
    }
    get get_UserSurname(){
        return this.surname;
    }
};

export let User = new cUser();