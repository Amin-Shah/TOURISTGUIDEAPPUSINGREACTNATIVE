import React from 'react'
import MapView from 'react-native-maps';
import { Image, View, Text } from 'react-native'


class Pin extends React.Component{
    render(){
        let {pin, key} = this.props;
        return(
            <View>
                <MapView.Marker
                    coordinate={{latitude: pin.geometry.location.lat, longitude: pin.geometry.location.lng}}
                    title={pin.name}
                    image={pin.icon}
                    description={pin.formatted_address}
                >
                </MapView.Marker>
            </View>
        )
    }
}


export default Pin