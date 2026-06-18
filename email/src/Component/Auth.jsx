import React from 'react';
import './Auth.css'
import { useSelector,useDispatch } from 'react-redux';
import { AuthAction } from '../Store/auth-slice';
import { useRef } from 'react';
import {useNavigate} from 'react-router-dom'


const Auth = () => {

    const authStatus = useSelector(state => state.auth.isLoginForm);
    const loginStatus = useSelector(state => state.auth.isLoggedIn)
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const email = useRef();
    const password = useRef();
    const confirm = useRef();
    let url = null

    const loginHandler = async(e) => {
        e.preventDefault(); 
        if(email.current.value === '' || password.current.value === ''){
          alert('Email and password cannot be empty')
          return;
        }

        if(authStatus === false){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
        }else{
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
        }
        console.log('authStatus:', authStatus);
        
        try{
            const response = await fetch(url,{
                method : 'POST',
                body : JSON.stringify({
                    email : email.current.value,
                    password : password.current.value,
                    ...(authStatus && { returnSecureToken: true }),
                }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            })

            const data = await response.json();
            if(!response.ok){
                throw new Error('Something went wrong...')
            }
            
            console.log(data)
            dispatch(AuthAction.loginStatus())
            console.log('User has successfully signed up')
            navigation('/home')
        }catch(err){
            console.log(err)
        }finally{

        }
    }

    const authHandler = (e) => {
        e.preventDefault();
        dispatch(AuthAction.authentication())
    }
    console.log(authStatus)

    return (
        <React.Fragment>
        {!authStatus ?  (<div className='parent'>
            <div className='form'>
                <form >
                    <h1>Sign Up</h1>
                    <input type="text" placeholder='Email' ref={email}/>
                    <input type="password" placeholder='Password' ref={password}/>
                    <input type="password" placeholder='Confirm Password' ref={confirm}/>
                    <button type='submit'style={{backgroundColor: 'skyblue'}} onClick={loginHandler}>Sign Up</button>
                    <button type='button' onClick={authHandler}>Have a Account? Login</button>
                </form>
            </div>
        </div>) : 
        (<div className='parent'>
            <div className='form'>
                <form>
                    <h1>Login</h1>

                    <input
                        type="text"
                        placeholder='Email'
                        ref={email}
                    />

                    <input
                        type="password"
                        placeholder='Password'
                        ref={password}
                    />

                    <button type='submit' onClick={loginHandler}>
                        Login
                    </button>

                    <button type='button' onClick={authHandler}>
                        Don't have an account? Sign Up
                    </button>
                </form>
             </div>
            </div>)}
        </React.Fragment>
    )
}

export default Auth;