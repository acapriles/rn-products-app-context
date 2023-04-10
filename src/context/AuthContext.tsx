import { createContext, useEffect, useReducer } from "react";

import { LoginData, LoginResponse, RegisterData, User } from "../interfaces/appInterfaces";
import { AuthReducer, AuthState } from "./authReducer";
import cafeApi from "../api/cafeApi";
import { AxiosError } from "axios";
import { getData, removeData, storeData } from "../helpers/storage";


export type AuthContextProps = {
    errorMessage: string;
    token:        string | null;
    user:         User | null;
    status:      'checking' | 'authenticated' | 'not-authenticated';
    signUp:      ( registerData: RegisterData) => void;
    signIn:      ( loginData: LoginData ) => void;
    logOut:      () => void;
    removeError: () => void;
}


const authInitialstate: AuthState = {
    status:         'checking',
    token:          null,
    user:           null,
    errorMessage:   '',
}

//Todo: Move this part to the interfaces file
/////////////////////////////////////////
interface AuthProviderProps {
	children: JSX.Element | JSX.Element[]
}

type AuthErrorResponse = {
    errors: [{ msg: string }];
    msg: string; 
}
////////////////////////////////////

export const AuthContext = createContext( {} as AuthContextProps );

export const AuthProvider = ( { children }: AuthProviderProps ) => {

    const [ state, dispatch ] = useReducer( AuthReducer, authInitialstate );

    useEffect(() => {
        // Way 1
        /* 
        getData( 'token' )
            .then( ( token ) => {
                console.log({ token });
            })
            .catch( ( error ) => console.log({ error }) );
        */
        
        // Way 2
        // const token = getData( 'token' );
        // console.log( token );

        checkToken();
    }, []);


    const checkToken = async () => {
        const token = await getData( 'token' );
        
        // There is no token
        if ( !token ) return dispatch({ type: 'notAuthenticated'} );

        // There is a token
        const resp = await cafeApi.get('/auth');

        if ( resp.status !== 200 ) return dispatch({ type: 'notAuthenticated' });

        // If only if you want to store the information of the new token (this could be optional).
        await storeData({
            name: 'token',
            value: resp.data.token
        });

        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });

    }
    

    const signIn = async ( { correo, password }: LoginData ) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password } );

            // console.log( data );

            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await storeData({
                name: 'token',
                value: data.token
            });
            
        } catch ( error ) {
            const err = error as AxiosError<AuthErrorResponse>

            dispatch({
                type: 'addError',
                payload: err.response?.data.msg || 'Bad information'
            });

            //console.log( err.response?.data );
            const data =  err.response?.data;
            console.log({ err });
        }
    };


    const signUp = async ( { nombre, correo, password }: RegisterData ) => {

        try {

            const { data } = await cafeApi.post<LoginResponse>('/usuarios', {
                nombre,
                correo,
                password
            });
            
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await storeData({
                name: 'token',
                value: data.token
            });
        } catch (error) {
            const err = error as AxiosError<AuthErrorResponse>

            dispatch({
                type: 'addError',
                payload: err.response?.data.errors[0].msg || 'Review information'
            });

            //console.log( err.response?.data );
            const data =  err.response?.data;
            console.log({ data });
        }


    };
    
    const logOut = async () => {
        await removeData( 'token' );

        dispatch({
            type: 'logout'
        });
    };

    const removeError = () => {
        dispatch({
            type: 'removeError'
        });
    };

    return (
        <AuthContext.Provider value={{
            // Properties
            ...state,

            // Methods
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    )



}
