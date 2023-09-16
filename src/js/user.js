import { ElevatorOnline } from './elevatorOnline.js';

class cUser {
    constructor() {
        this.username   = '';
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

        console.log('set_ServerResponse',response);

        if ( response.password == 'ok' ) {
            this.loginStatus = true;
            this.name = response.name;
            this.surname = response.surname;
        } else {
            this.loginStatus = false;
            this.name = '';
            this.surname = '';
        }
        console.log(User.get_UserInfo);
    }

    get ServerOnline(){
        let result = false;
        fetch( ElevatorOnline.get_ServerPath , { method: 'GET' })
            .then((res) => res.json())
            .then((status) => result = status.online );
            
        return result;
    }

    SignIn( login, pass ){

        if ( login == '' || login == null ) login = 'demo';
        if ( pass == '' || pass == null ) pass = 'demo';

       // console.log('SignIn=',login,pass);
        //console.log('{}=',{ login: login, password: pass });
        //console.log('Path =',ElevatorOnline.get_ServerPath);

        return new Promise ( function(resolve, reject) {
        fetch( ElevatorOnline.get_ServerPath + "login" , { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            credentials: 'include',
            body: JSON.stringify( { login: login, password: pass } )
        } ).then(response => response.json()).then((data) => {
            User.set_ServerResponse = data;
            console.log('SignIn server response = ',data);
            //console.log(User.get_UserInfo);
            ElevatorOnline.get_Inspection_List({filter: 'all'});
            resolve( User.loginStatus );
            } );

        });
    }

    SignOut(){
        return new Promise ( function(resolve, reject) {
        fetch( ElevatorOnline.get_ServerPath + "logout" , { 
            method: 'GET',
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
        return ( this.name + ' ' + this.surname );
    }

    get get_UserName(){
        return this.name;
    }
    get get_UserSurname(){
        return this.surname;
    }
};

export let User = new cUser();