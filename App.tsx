import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";

import { Navigator } from './src/navigator/Navigator';
import { FC } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';


interface Props {
	children: JSX.Element | JSX.Element[]
}

const AppState = ( { children }: Props ) => {
	return (
		<AuthProvider>
			<ProductsProvider>
				{ children }
			</ProductsProvider>
		</AuthProvider>
	)
}

const App = () => {
	return (
		<NavigationContainer>
			<AppState>
				<Navigator />
			</AppState>
		</NavigationContainer>
	)
}

export default App;
