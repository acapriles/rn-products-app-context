import { useContext, useEffect } from 'react';
import { 
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { loginStyles } from '../theme/loginTheme';
import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { RootStackParams } from '../navigator/Navigator';
import { AuthContext } from '../context/AuthContext';



interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ( { navigation }: Props ) => {

    const { errorMessage, removeError, signUp } = useContext( AuthContext );

    const { name, email, password, onChange} = useForm({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if ( errorMessage.length === 0 ) return;

        Alert.alert( 'Incorrect Register', errorMessage, [{
            text: 'Ok',
            onPress: removeError,
        }]);

    }, [ errorMessage ])

    const onRegister = () => {
        console.log({ name, email, password });
        Keyboard.dismiss();

        signUp({
            nombre: name,
            correo: email,
            password 
        });
    }


    return (
        <>            
            <KeyboardAvoidingView
                style={{ 
                    flex: 1,
                    backgroundColor: '#5856D6',
                }}
                behavior={ ( Platform.OS === 'ios' ? 'padding' : 'height' ) }
            >

                <View style={ loginStyles.formContainer }>

                    <WhiteLogo />

                    <Text style={ loginStyles.title }>Register</Text>

                    <Text style={ loginStyles.label }>Name:</Text>
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="default"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={ ( value ) => onChange( value, 'name' )}
                        value={ name }
                        onSubmitEditing={ onRegister }
                        autoCapitalize="words"
                        autoCorrect={ false }
                    />

                    <Text style={ loginStyles.label }>Email:</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={ ( value ) => onChange( value, 'email' )}
                        value={ email }
                        onSubmitEditing={ onRegister }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />

                    <Text style={ loginStyles.label }>Password:</Text>
                    <TextInput
                        placeholder="********"
                        secureTextEntry
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="default"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={ ( value ) => onChange( value, 'password' )}
                        value={ password }
                        onSubmitEditing={ onRegister }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />

                        
                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity
                            onPress={ onRegister }
                            activeOpacity={ 0.6 }
                            style={ loginStyles.button }
                        >
                            <Text style={ loginStyles.buttonText }>Create account</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity
                        onPress={ () => navigation.replace('LoginScreen') }
                        activeOpacity={ 0.6 }
                        style={ loginStyles.buttonReturn }
                    >
                        <Text style={ loginStyles.buttonText }>Login</Text>
                    </TouchableOpacity>
                    
                </View>

            </KeyboardAvoidingView>
        </>
    )
}
