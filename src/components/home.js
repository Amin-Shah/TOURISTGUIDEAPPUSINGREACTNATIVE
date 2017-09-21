import React from "react";
import MapView from 'react-native-maps';
import { ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Container, Header, Content, Footer, FooterTab, Icon, Button, CardItem, Right } from 'native-base'
import Polyline from '@mapbox/polyline';
import geolib from 'geolib'
import * as fb from '../database/firebase';
import { Actions } from 'react-native-router-flux'
import ActionButton from 'react-native-action-button';

import Pin from './pin'



class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            error: null,
            mapRegion: null,
            latitude: 24.9256,
            longitude: 66.9998,
            searchlat: 0,
            searchlng: 0,
            visibleModal: null,
            endAddress: '',
            startAddress: '',
            nearestDistance: '',
            nearestHotel: '',
            search: '',
            pins: [],
            coords: [],
            length: null,
            duration: null,
            key: 'AIzaSyDr38kihPPiGo4GAHah2yaB1HGZuvYG5_4'
        }
    }

    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition((position) => {
            // Create the object to update this.state.mapRegion through the onRegionChange function
            let region = {
                latitude: parseFloat(position.coords.latitude),
                longitude: parseFloat(position.coords.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
            this.onRegionChange(region, region.latitude, region.longitude);
        });
    }
    onRegionChange(region, latitude, longitude) {
        var latitude = latitude ? latitude : this.state.latitude
        var longitude = longitude ? longitude : this.state.longitude
        this.setState({
            mapRegion: region,
            // If there are no new values set the current ones
            latitude: latitude,
            longitude: longitude
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }

    logout = () => {
        fb.auth.signOut().then(function () {
            Actions.login()
        }, function (error) {
            console.log(error)
        });
    }

    fetchDetails = () => {
        let query = this.state.search
        let location = `${this.state.latitude},${this.state.longitude}`//places api web services
        if (query.length > 0) {
            axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query=${query}&location=${location}`).then(({ data }) => {
                this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
                this.getDirections(`${this.state.latitude}, ${this.state.longitude}`, `${this.state.searchlat}, ${this.state.searchlng}`)
            })
        }
    }

    hotels = () => {
        let location = `${this.state.latitude},${this.state.longitude}`
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query='hotels'&location=${location}`).then(({ data }) => {
            this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
        })
    }

    restaurants = () => {
        let location = `${this.state.latitude},${this.state.longitude}`
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query='restaurants'&location=${location}`).then(({ data }) => {
            this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
        })
    }

    parks = () => {
        let location = `${this.state.latitude},${this.state.longitude}`
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query='park'&location=${location}`).then(({ data }) => {
            this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
        })
    }

    foods = () => {
        let location = `${this.state.latitude},${this.state.longitude}`
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query='fast foods'&location=${location}`).then(({ data }) => {
            this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
        })
    }

    hospitals = () => {
        let location = `${this.state.latitude},${this.state.longitude}`
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?radius=100&key=${this.state.key}&query='hospitals'&location=${location}`).then(({ data }) => {
            this.setState({ pins: data.results, searchlat: parseFloat(data.results[0].geometry.location.lat), searchlng: parseFloat(data.results[0].geometry.location.lng) })
        })
    }

    showDetails = () => {
        var spots = {
            "Address": { latitude: this.state.searchlat, longitude: this.state.searchlng },
            "Pearl Continental Hotel": { latitude: 24.8473, longitude: 67.0256 },
            "Karachi Marriott Hotel": { latitude: 24.8463, longitude: 67.0312 },
            "Hotel Faran": { latitude: 24.8599, longitude: 67.0627 },
            "Beach Luxury Hotel": { latitude: 24.8434, longitude: 66.9955 },
            "Movenpick Hotel Karachi": { latitude: 24.8467, longitude: 67.0265 },
            "Abaseen Hotel": { latitude: 24.8678, longitude: 67.0233 },
            "Khyber Hotel": { latitude: 24.8609, longitude: 67.0275 },
            "Embassy Inn": { latitude: 24.8592, longitude: 67.0578 },
            "Hotel Country Inn, Karachi": { latitude: 24.8606, longitude: 67.0680 },
            "Hotel Jabees": { latitude: 24.8581, longitude: 67.0276 }
        }

        // alert('Nearest Hotel ' + JSON.stringify(geolib.findNearest(spots['Address'], spots, 1)))

        let obj = geolib.findNearest(spots['Address'], spots, 1)
        let nearest = Object.keys(obj).map((val) => obj[val])
        let nearestDistance = nearest[0]
        nearestDistance = nearestDistance / 1000
        let nearestHotel = nearest[1]

        this.setState({ visibleModal: 2, nearestDistance, nearestHotel })
    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
            let respJson = await resp.json();
            // alert(JSON.stringify(respJson.routes[0]))
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            let length = respJson.routes[0].legs[0].distance.text
            let duration = respJson.routes[0].legs[0].duration.text
            let startAddress = respJson.routes[0].legs[0].start_address
            let endAddress = respJson.routes[0].legs[0].end_address
            this.setState({ duration, startAddress, endAddress, length, coords: coords })
            return coords
        } catch (error) {
            alert(error)
            return error
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.container}
                    region={this.state.mapRegion}
                    followsUserLocation={true}
                    showsUserLocation={true}
                    showsBuildings={true}
                    mapType='satellite'
                    initialRegion={{
                        latitude: 24.9256,
                        longitude: 66.9998,
                        latitudeDelta: 0.006607147806899755,
                        longitudeDelta: 0.0063600431189364
                    }}
                    onRegionChange={this.onRegionChange.bind(this)}
                >
                    {this.state.pins.map((pin, i) => (
                        <View key={i}>
                            <Pin pin={pin} />
                        </View>
                    ))
                    }
                    <MapView.Marker
                        coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude
                        }}>
                    </MapView.Marker>
                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={3}
                        strokeColor="red" />
                </MapView>

                <View style={styles.box}>
                    <Modal isVisible={this.state.visibleModal === 1} style={styles.bottomModal}
                        backdropColor={'transparent'}
                        backdropOpacity={1}
                        animationIn={'zoomInDown'}
                        animationOut={'zoomOutUp'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={1000}
                        backdropTransitionOutTiming={1000}
                        onBackdropPress={() => this.setState({ visibleModal: null })}>
                        <View style={{ backgroundColor: "#fff" }}>
                            <TextInput style={styles.input} value={this.state.search} onChangeText={(val) => {
                                this.setState({ search: val })
                            }} ref='search' />
                            <Button full info disabled={this.state.search.length < 1} onPress={this.fetchDetails}>
                                <Text style={styles.text}>Search</Text>
                            </Button>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.visibleModal === 2} style={styles.bottomModal}
                        backdropColor={'transparent'}
                        backdropOpacity={1}
                        animationIn={'zoomInDown'}
                        animationOut={'zoomOutUp'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={1000}
                        backdropTransitionOutTiming={1000}
                        onBackdropPress={() => this.setState({ visibleModal: null })}>
                        <View style={{ backgroundColor: "#fff" }}>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>Start Address:</Text>
                                <Text style={styles.text3}>{this.state.startAddress}</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>End Address:</Text>
                                <Text style={styles.text3}>{this.state.endAddress}</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>Distance:</Text>
                                <Text style={styles.text1}>{this.state.length}</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>Duration:</Text>
                                <Text style={styles.text1}>{this.state.duration}.  Travel Mode(Driving)</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>Nearest Hotel:</Text>
                                <Text style={styles.text2}>{this.state.nearestHotel}</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                            <CardItem style={styles.cardItem}>
                                <Text style={styles.itemColor}>Hotel Distance:</Text>
                                <Text style={styles.text2}>{this.state.nearestDistance} KM</Text>
                                <Right style={styles.arrow}>
                                    <Icon style={styles.iconColor} name="arrow-forward" />
                                </Right>
                            </CardItem>
                        </View>
                    </Modal>
                </View>
                <View style={{ flex: 10, marginBottom: '-2%' }}>
                    {/* Rest of the app comes ABOVE the action button component !*/}
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item buttonColor='#9b59b6' title="Hotels" onPress={this.hotels}>
                            <Icon name="md-home" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#3498db' title="Restaurants" onPress={this.restaurants}>
                            <Icon name="md-restaurant" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#6C7A89' title="Fast Foods" onPress={this.foods}>
                            <Icon name="md-pizza" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#CF000F' title="Hospitals" onPress={this.hospitals}>
                            <Icon name="ios-medical" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#1abc9c' title="Parks" onPress={this.parks}>
                            <Icon name="md-partly-sunny" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                </View>
                <Footer style={{ marginBottom: 24 }}>
                    <FooterTab>
                        <Button vertical info onPress={() => { this.setState({ visibleModal: 1 }) }}>
                            <Icon style={styles.icon} name="map" />
                            <Text style={styles.text}>Search</Text>
                        </Button>
                        <Button vertical info onPress={this.showDetails}>
                            <Icon style={styles.icon} name="navigate" />
                            <Text style={styles.text}>Details</Text>
                        </Button>
                        <Button vertical info onPress={this.logout}>
                            <Icon style={styles.icon} name="ios-log-out" />
                            <Text style={styles.text}>Logout</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute'
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'lightblue',
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    input: {
        borderWidth: 2,
        borderColor: '#62B1F6'
    },
    modalContent: {
        backgroundColor: 'red',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-start',
        margin: 0
    },
    icon: {
        color: '#fff'
    },
    cardItem: {
        marginTop: '3%'
    },
    itemColor: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12
    },
    iconColor: {
        color: '#000',
        fontSize: 14
    },
    arrow: {
        position: 'absolute',
        left: '100%'
    },
    text: {
        color: '#fff',
        fontSize: 16
    },
    text1: {
        position: 'absolute',
        left: '22%',
        color: '#000',
        fontSize: 12
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    text2: {
        position: 'absolute',
        left: '31%',
        color: '#000',
        fontSize: 12
    },
    text3: {
        position: 'absolute',
        left: '29%',
        color: '#000',
        fontSize: 12
    }
});


export default Home;