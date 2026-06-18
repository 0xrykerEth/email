import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoginForm : false,
    isLoggedIn : false,
}

const AuthSlice = createSlice({
    name : 'Auth',
    initialState,
    reducers : {
        authentication(state){
            state.isLoginForm = !state.isLoginForm;
        },
        loginStatus(state){
            state.isLoggedIn = true
        }
    }
})

export const AuthAction = AuthSlice.actions;
export default AuthSlice.reducer;