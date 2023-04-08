import { Dimensions, View } from 'react-native';



const { width, height } = Dimensions.get('window');

export const Background = () => {
    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: '#5856D6',
                top: -250,
                //width: 1000,
                //height: 1200,
                width: height * 0.9,
                height: height + 300,
                transform: [
                    { rotate: '-70deg'}
                ]
            }}
        />

    )
}
