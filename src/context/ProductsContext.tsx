import { createContext, useEffect, useState } from 'react';

import { Product, ProductsResponse } from '../interfaces/appInterfaces';
import cafeApi from '../api/cafeApi';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Asset, ImagePickerResponse } from 'react-native-image-picker';

type ProductsContextProps = {
    products: Product[];
    // loadProducts: ( source: CancelTokenSource ) => Promise<void>;
    loadProducts: ( ) => Promise<void>;
    addProduct: ( categoryId: string, productName: string ) => Promise<Product | undefined>;
    updateProduct: ( categoryId: string, productName: string, productId: string ) => Promise<void>;
    deleteProduct: ( id: string ) => Promise<number | undefined>;
    loadProductById: ( id: string ) => Promise<Product | undefined>;
    uploadImage: ( data: ImagePickerResponse, id: string ) => Promise<void>;
}


//Todo: Move this part to the interfaces file
/////////////////////////////////////////
interface ProductsProviderProps {
	children: JSX.Element | JSX.Element[]
}

type AuthErrorResponse = {
    errors: [{ msg: string }];
    msg: string; 
}
////////////////////////////////////


export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: ProductsProviderProps ) => {

    const [ products, setProducts ] = useState<Product[]>([]);


    useEffect(() => {
        // const source = axios.CancelToken.source(); 
        // loadProducts( source );
        // return () => source.cancel();
       
        loadProducts();

    }, [])
    

    const loadProducts = async() => {
    // const loadProducts = async( { token }: CancelTokenSource ) => {

        try {
            const resp = await cafeApi.get<ProductsResponse>('/productos', 
            {
                params: {
                    limite: 50,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                // timeout: 5000,  // 5 seconds
                //cancelToken: token
            });            
            
            setProducts([ ...resp.data.productos ]);
        } catch ( error ) {
            const err = error as AxiosError;
            console.log( err.message );
        }

    }

    const addProduct = async( categoryId: string, productName: string ): Promise<Product | undefined> => {
        
        try {
            const resp = await cafeApi.post<Product>('/productos', {
                nombre: productName,
                categoria: categoryId,
            });

            console.log({resp});
            

            setProducts([ ...products, resp.data ]);

            return resp.data;
            
        } catch (error) {
            const err = error as AxiosError;
            console.log( err );
        }
    }

    const updateProduct = async( categoryId: string, productName: string, productId: string ) =>{
        try {
            const resp = await cafeApi.put<Product>(`productos/${ productId }`, {
                nombre: productName,
                categoria: categoryId,
            });

            setProducts( products.map( ( product ) => {
                return ( product._id === productId ) ? resp.data : product
            }));
            
        } catch (error) {
            const err = error as AxiosError;
            console.log( err.message );
        }
    }

    const deleteProduct = async( id: string ): Promise<number | undefined> => {
        try {
            const resp = await cafeApi.delete<Product>( `productos/${ id }` );

            setProducts( products.filter( ( product ) => {
                return ( product._id !== resp.data._id )
            }));

            return resp.status;
            
        } catch (error) {
            const err = error as AxiosError;
            console.log( err.message );
            return err.status;
        }
    }

    const loadProductById = async( id: string ): Promise<Product | undefined> => {
        try {
            const resp = cafeApi.get<Product>( `productos/${ id }` );
            //return (await resp).data
            return (await resp).data;

        } catch (error) {
            const err = error as AxiosError;
            console.log( err.message );
        }
        // throw new Error('Not implemented');
    };


    const uploadImage = async( data: ImagePickerResponse, id: string ) => {
        const fileToUpload = {
            uri: data.assets![0].uri,
            type: data.assets![0].type,
            name: data.assets![0].fileName
        }

        console.log(fileToUpload);
        

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            const resp = await cafeApi.put( `/uploads/productos/${ id }`,
            formData,
            {
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "multipart/form-data",
                }
            });
                
            console.log({ resp });
            
        } catch (error) {
            console.log({error});
            
            const err = error as AxiosError;
            console.log( err );
        }

    }

    return(
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            { children }
        </ProductsContext.Provider>
    )
}