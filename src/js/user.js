import { ElevatorOnline } from './elevatorOnline.js';

class cUser {
    constructor() {
        this.username   = 'user';
        this.password   = 'user';
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
        fetch("http://localhost:3001/", { method: 'GET' })
            .then((res) => res.json())
            .then((status) => result = status.online );
            
        return result;
    }

    SignIn( login, pass ){
        let user = {
            username: login,
            password: pass,
          };

        this.username = login;
        this.password = pass;
        //console.log('SignIn');

        return new Promise ( function(resolve, reject) {
        fetch("http://localhost:3001/connect" , { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(user)
        } ).then(response => response.json()).then((data) => {
            User.set_ServerResponse = data;
            //console.log(User.get_UserInfo);
            ElevatorOnline.get_Inspection_List({filter: 'all'});
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