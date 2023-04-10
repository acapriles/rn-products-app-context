import { useEffect, useRef, useState } from "react"
import cafeApi from "../api/cafeApi";
import axios, { AxiosError, CancelTokenSource } from "axios";
import { CategoriesRespose, Category } from "../interfaces/appInterfaces";

export const useCategories = () => {

    const [ isLoading, setIsLoading ] = useState( true );
    const [ categories, setCategories ] = useState<Category[]>();
    const isMounted = useRef<boolean>( true );
  
    useEffect(() => {
        const source = axios.CancelToken.source(); 
        getCategories( source );

        return () => {
            source.cancel();
            isMounted.current = false;
        }
    }, []);

    const getCategories = async ( { token }: CancelTokenSource ) => {
        
        try {
            const resp = await cafeApi.get<CategoriesRespose>('categorias', {
                cancelToken: token
            });

            if ( !isMounted.current ) return;
            
            setCategories( resp.data.categorias );
            setIsLoading( false );
            
        } catch (error) {
            const err = error as AxiosError;
            console.log( err.message );
            setIsLoading( false );
        }
    }
    

    return {
        // Properties
        categories,
        isLoading,

        // Methods

    }
}
