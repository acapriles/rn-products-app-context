import { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProductsContext } from '../context/ProductsContext';
import { ProductsStackParams } from '../navigator/ProductsNavigator';


interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'>{}

export const ProductsScreen = ( { navigation }: Props ) => {

    const { products, loadProducts } = useContext( ProductsContext );
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={ 0.6 }
                    style={{ marginRight: 10 }}
                    onPress={ () => navigation.navigate('ProductScreen', {}) }
                >
                    <Text>Add</Text>
                </TouchableOpacity>
            )
        })
    
    }, []);
    
    const loadProductsFromBackend = () => {
        setIsRefreshing( true );
        console.log('Refreshing...');
        loadProducts();
        setIsRefreshing( false );
        
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>

            <FlatList
                data={ products }
                keyExtractor={ ( p ) => p._id }
                renderItem={ ({ item }) => (
                    <TouchableOpacity
                        activeOpacity={ 0.6 }
                        onPress={ 
                            () => navigation.navigate('ProductScreen', {
                                id: item._id,
                                name: item.nombre
                            }
                        )}
                    >
                        <Text style={ styles.productName }>{ item.nombre }</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={ () => (
                    <View style={ styles.itemSeparator } />
                )}
                
                // Pull to Refresh
                refreshControl={
                    <RefreshControl
                        refreshing={ isRefreshing }
                        onRefresh={ loadProductsFromBackend }
                        progressViewOffset={ 30 }

                        // Android
                        //progressBackgroundColor={ colors.background }
                        colors={ ['red', 'orange', 'yellow'] }
                        
                        // IOS
                        //style={{ backgroundColor: colors.background }}
                        //tintColor={ dark ? 'white' : 'black' }
                        title="Refreshing"
                        //titleColor={ dark ? 'white' : 'black' }
                    />
                }
            />

        </View>
    )
}


const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)'
    },
});