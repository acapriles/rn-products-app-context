import { useContext, useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';


interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'>{};

export const ProductScreen = ( { route, navigation }: Props ) => {

    const { id = '', name = '' } = route.params;

    const [ tempImgUri, setTempImgUri ] = useState<string>();

    const { categories, isLoading } = useCategories();

    const { loadProductById, addProduct, updateProduct, deleteProduct, uploadImage } = useContext( ProductsContext );

    const { _id, categoryId, fullName, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoryId: '',
        fullName: name,
        img: ''
    });

    useEffect(() => {
        if ( _id.length === 0 ) return;

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={ 0.6 }
                    style={{ marginRight: 10 }}
                    onPress={ async () => {
                        const resp = await deleteProduct( _id );
                        if ( resp === 200 ) {
                            navigation.goBack();
                        }
                    }}
                >
                    <Text>Remove</Text>
                </TouchableOpacity>
            )
        });
    
    }, [ _id ]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: ( !!fullName ) ? fullName : 'New product'
        });
    }, [ fullName ]);

    useEffect(() => {
        loadProduct();
    }, []);
    

    const loadProduct = async () => {
        if ( id.length === 0 ) return;
        const product = await loadProductById( id );

        setFormValue({
            _id: id,
            categoryId: product?.categoria._id || '',
            fullName: name,
            img: product?.img || ''
        })
    }

    const saveOrUpdate = async () => {
        if ( id.length > 0 ) {
            // Updating..
            updateProduct(
                categoryId,
                fullName,
                id
            );
        } else {
            // Saving...
            const tempCategoryId = categoryId || categories![0]._id
            const newProduct = await addProduct( tempCategoryId, fullName );  
            onChange( newProduct?._id!, '_id');
        }
    }

    const takePhoto = async () => {
        const responseObj = await launchCamera({
            mediaType: 'photo',
            quality: 0.5
        });
        
        if ( responseObj.didCancel ) return;
        if ( responseObj.assets && !responseObj.assets[0].uri ) return;

        setTempImgUri( responseObj.assets![0].uri );

        uploadImage( responseObj , _id)
        
    }

    const takePhotoFromGallery = async () => {
        const responseObj = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        });
        
        if ( responseObj.didCancel ) return;
        if ( responseObj.assets && !responseObj.assets[0].uri ) return;

        setTempImgUri( responseObj.assets![0].uri );

        uploadImage( responseObj , _id)
        
    }


    return (
        <View style={ styles.container }>
            <ScrollView
                showsVerticalScrollIndicator={ false }
            >
                <Text style={ styles.label }>Product name:</Text>
                <TextInput
                    placeholder='Product...'
                    style={ styles.textInput }
                    value={ fullName }
                    onChangeText={ ( value ) => onChange( value, 'fullName' ) }
                />

                <Text style={ styles.label }>Category:</Text>
                <Picker
                    selectedValue={ categoryId }
                    onValueChange={ ( value ) => onChange( value, 'categoryId') }
                >
                    {
                        categories?.map( ( category ) => (
                            <Picker.Item
                                label={ category.nombre }
                                value={ category._id }
                                key={ category._id }
                            />
                        ))
                    }
                </Picker>

                <Button
                    title='Save'
                    onPress={ saveOrUpdate }
                    color='#5856D6'
                />

                {
                    ( id.length > 0 ) && (
                        <View 
                        style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}
                        >
                            <Button
                                title='Camera'
                                onPress={ takePhoto }
                                color='#5856D6'
                            />

                            <View style={{ width: 10 }} />

                            <Button
                                title='Gallery'
                                onPress={ takePhotoFromGallery }
                                color='#5856D6'
                            />

                        </View>
                    )
                }

                
                {
                    ( img.length > 0 && !tempImgUri ) && (
                        <Image
                            source={{ uri: img }}
                            style={{
                                width: '100%',
                                height: 300,
                                marginTop: 20
                            }}
                        />
                    )
                }

                {/* Show temporal image */}
                {
                    ( tempImgUri ) && (
                        <Image
                            source={{ uri: tempImgUri }}
                            style={{
                                width: '100%',
                                height: 300,
                                marginTop: 20
                            }}
                        />
                    )
                }

                <Text>{ JSON.stringify( form, null, 4 ) }</Text>

            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 15
    }
});