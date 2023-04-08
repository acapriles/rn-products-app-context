import { 
    Platform,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard, 
    Alert
} from 'react-native';

import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigator/Navigator';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';



interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'>{}

export const LoginScreen = ( { navigation }: Props ) => {

    const { signIn, removeError , errorMessage } = useContext( AuthContext );

    const { email, password, onChange} = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {
        if ( errorMessage.length === 0 ) return;

        Alert.alert( 'Incorrect login', errorMessage, [{
            text: 'Ok',
            onPress: removeError,
        }]);

    }, [ errorMessage ])
    

    const onLogin = () => {
        console.log({ email, password });
        Keyboard.dismiss();

        signIn({ correo: email, password });
    }


    return (
        <>
            <Background />
            
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={ ( Platform.OS === 'ios' ? 'padding' : 'height' ) }
            >

                <View style={ loginStyles.formContainer }>
                    <WhiteLogo />

                    <Text style={ loginStyles.title }>Login</Text>

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
                        onSubmitEditing={ onLogin }
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
                        onSubmitEditing={ onLogin }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />
 
                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity
                            onPress={ onLogin }
                            activeOpacity={ 0.6 }
                            style={ loginStyles.button }
                        >
                            <Text style={ loginStyles.buttonText }>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={ loginStyles.newUserContainer }>
                        <TouchableOpacity
                            activeOpacity={ 0.6 }
                            onPress={ () => navigation.replace('RegisterScreen') }
                        >
                            <Text style={ loginStyles.buttonText }>New account?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </>
    )
}
