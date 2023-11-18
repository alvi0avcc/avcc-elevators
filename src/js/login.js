import React from 'react';
import { User } from './user';
import { create } from '@mui/material/styles/createTransitions';


export default function LoginForm(props){
    const status = props.status;
    const user = props.user;
    const loginStatus = props.loginStatus;
    const callback_setUser = props.callback_setUser;
    const callback_setLoginStatus = props.callback_setLoginStatus;

    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [pass_rep, setPass_rep] = React.useState('');

    const dialog_SignIn = document.getElementById('signin');
    const dialog_Register = document.getElementById('register');

    const handleEmail = (e)=>{ setEmail( e.target.value ) }

    const handlePass = (e)=>{ setPass( e.target.value ) }
    const handlePass_rep = (e)=>{ setPass_rep( e.target.value ) }

    const handleEnter = (e)=>{
        if ( e.keyCode == 13 ) {
            User.SignIn( email, pass ).then ( (result) => {
                callback_setLoginStatus(result);
                callback_setUser(User.get_UserFullNameAndEmail );
            });
        }
    }

    return (
    <div style={{ display: ( status ? 'flex ' : 'none' ) }} >

        <div className = 'block_row' style={{ display: ( !loginStatus ? 'flex ' : 'none' ) }} >

            <button onClick={ ()=> ( dialog_SignIn.showModal(), document.getElementById('email').focus() ) }>Sign In</button>

            <dialog 
                id='signin'
                onClose={ ()=> ( setEmail(''), setPass('') ) }
                >
                <div style={{ display: 'flex', backgroundColor: 'blue', justifyContent: 'space-between' }} >
                    <span style={{ color: 'white' }}>Please fill for Sign In</span>
                    <button class="close" onClick={ ()=> ( dialog_SignIn.close() ) }>&times;</button>
                </div>

                <form 
                    method="dialog" 
                    style={{ 
                        display: 'grid', 
                        gridTemplateRows: '1fr 1 fr 1fr', 
                        justifyItems: 'center',
                        padding: '5px'
                    }}
                    >
                    <label for="email"> Email:</label>
                    <input
                        value={email}
                        onChange={handleEmail}
                        onKeyUp={handleEnter}
                        type="email" id="email" name="email" required size="20"
                    />

                    <label for="pass">Password:</label>
                    <input 
                        value={pass}
                        onChange={handlePass}
                        onKeyUp={handleEnter}
                        type="password" id="pass" name="password" required size="20"
                    />
                
                    <br/>
                    <button
                        style={{ width: '80px' }}
                        onClick={ () => (
                            ( email && pass ?
                                User.SignIn( email, pass ).then ( (result) => {
                                    callback_setLoginStatus(result);
                                    callback_setUser(User.get_UserFullNameAndEmail );
                                    })
                                : ''
                            )
                            )
                        }
                    >Sign in</button>

                </form>
        </dialog>
        
        <button disabled onClick={ ()=> ( dialog_Register.showModal() ) }>Register</button>

            <dialog id='register'>
                <div style={{ display: 'flex', backgroundColor: 'blue', justifyContent: 'space-between' }} >
                    <span style={{ color: 'white' }}>Please fill for Register new User</span>
                    <button class="close" onClick={ ()=> ( dialog_Register.close() ) }>&times;</button>
                </div>

                <form 
                    method="dialog" 
                    style={{ 
                        display: 'grid', 
                        gridTemplateRows: '1fr 1 fr 1fr', 
                        justifyItems: 'center',
                        padding: '5px'
                    }}
                    >
                    <label for="email"> Email:</label>
                    <input
                        value={email}
                        onChange={handleEmail}
                        onKeyUp={handleEnter}
                        type="email" id="email_reg" name="email" required size="20"
                    />

                    <label for="pass">Password:</label>
                    <input 
                        value={pass}
                        onChange={handlePass}
                        onKeyUp={handleEnter}
                        type="password" id="pass_reg" name="password" required size="20"
                    />
                    <label for="pass">Password again:</label>
                    <input 
                        value={pass}
                        onChange={handlePass_rep}
                        onKeyUp={handleEnter}
                        type="password" id="pass_rep" name="password_rep" required size="20"
                    />
                
                    <br/>
                    <button
                        style={{ width: '80px' }}
                        onClick={ () => (
                            ( email && pass ?
                                User.SignIn( email, pass ).then ( (result) => {
                                    callback_setLoginStatus(result);
                                    callback_setUser(User.get_UserFullNameAndEmail );
                                    })
                                : ''
                            )
                            )
                        }
                    >Register</button>

                </form>
        </dialog>

        </div>


        <div className = 'block_row' style={{ display: ( loginStatus ? 'flex ' : 'none' ) }}>
            <button
                onClick={()=> User.SignOut().then( (result) => {
                    callback_setLoginStatus(result);
                    callback_setUser('');
                }) }
            >Sign out</button>
        </div>

    </div>
    )
}