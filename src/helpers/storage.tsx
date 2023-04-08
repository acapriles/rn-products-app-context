import AsyncStorage from "@react-native-async-storage/async-storage";


type StorageDataProps = {
    name: string;
    value: string | object;
};

export const storeData = async ( { name, value }: StorageDataProps ): Promise<void> => {
    try {
        if ( typeof value === 'object' ) {
            value = JSON.stringify( value );
            await AsyncStorage.setItem( name, value);
        } else {
            await AsyncStorage.setItem( name, value);
        }
    } catch ( error ) {
        console.log('save error');
    }
}

export const getData = async ( name: string ): Promise<string | object | undefined> => {
    try {
        const value = await AsyncStorage.getItem( name );

        if ( !value ) return;

        if ( typeof value === 'object' ) {
            return JSON.parse( value );
        } else {
            return value;
        }
    } catch( error ) {
        console.log('read error');
    }
}

export const removeData = async ( name: string ): Promise<void> => {
    try {
        await AsyncStorage.removeItem( name );
    } catch( error ) {
        console.log('remove error');
    }
}
  