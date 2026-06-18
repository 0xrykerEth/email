import React from 'react';
import './Auth.css'
import { useSelector,useDispatch } from 'react-redux';
import { AuthAction } from '../Store/auth-slice';
import { useRef } from 'react';


const Auth = () => {

    const authStatus = useSelector(state => state.auth.isLoginForm);
    const loginStatus = useSelector(state => state.auth.isLoggedIn)
    const dispatch = useDispatch();
    const email = useRef();
    const password = useRef();
    const confirm = useRef();

    const loginHandler = async(e) => {
        e.preventDefault(); 
        
        try{
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',{
                method : 'POST',
                body : JSON.stringify({
                    email : email.current.value,
                    password : password.current.value,
                }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
            if(!response.ok){
                throw new Error('Something went wrong...')
            }
            const data = await response.json();
            console.log(data)
            dispatch(AuthAction.loginStatus())
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
        {authStatus ?  (<div className='parent'>
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
                    />

                    <input
                        type="password"
                        placeholder='Password'
                    />

                    <button type='submit'>
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