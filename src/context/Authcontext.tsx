import React,{createContext, useContext, useState,use, useEffect} from "react";
import axios from "axios";
import { API_BASE_URL, endpoints } from "../Configuration/Config";
import { deleteToken, getToken, saveToken } from "../utilities/SecureStorage";


interface AuthProps {
    authState?:{ token:string|null; authenticated:boolean|null;};
    onSignup?: (email:string, password:string) => Promise<any>;
    onLogin?: (email:string, password:string) => Promise<any>;
    onLogout?: () => Promise<any>;
}
const AuthContext = createContext<AuthProps>({});

export const useauth    = () => {
    return useContext(AuthContext);
};
export const AuthProvider= ({children}:any) => {
const [authState, setAuthState] = useState<
{
     token:string|null; 
     authenticated:boolean|null;   
}>({
    token: null,
    authenticated: null,
});  
useEffect( () => {
    const checkToken = async () => {
     const token = await getToken();
     if (token) {       
        setAuthState({
            token:token
            , authenticated:true});
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     }
     else 
      { 
        setAuthState({
            token:null,
            authenticated:false
        });
      }
 
    }
    checkToken();
}, []);

const Signup = async (email:string, password:string) => {
    try {
        return await axios.post(`${API_BASE_URL}${endpoints.signup}`,{email,password});    
    } catch(e) {
        return {error:true, msg:(e as any).response.data.msg};
    }
}  
const Login = async (email:string, password:string) => {
    try {
        const response= await axios.post(`${API_BASE_URL}${endpoints.login}`,{email,password});
        setAuthState(
            {token:response.data.token, 
            authenticated: true
        });   
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; 
        await saveToken(response.data.token);
        return
    } catch(e) { 
        return {error:true, msg:(e as any).response.data.msg};
    }
}  
 const Logout = async () => {
        await deleteToken()
     axios.defaults.headers.common['Authorization']='';
     setAuthState(
        {token:null, 
         authenticated:false
    });
 }
 const value={
    onSignup:Signup,
    onLogin:Login,
    onLogout:Logout,
    authState,

};
return<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};




