import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Application from 'expo-application';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            location: null,
            error: null,
            androidId: null
        };
    }

    componentDidMount() {
        this.getLocationPermission();
        this.getAndroidId();
    }

    getLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                this.getLocation();
            } else {
                this.setState({ error: 'Location permission denied' });
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
            this.setState({ error: 'Error requesting location permission' });
        }
    };

    getLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            this.setState({ ready: true, location });
        } catch (error) {
            console.error('Error getting location:', error);
            this.setState({ error: 'Error getting location' });
        }
    };

    getAndroidId = async () => {
        try {
            const androidId = await Application.getAndroidId();
            this.setState({ androidId });
        } catch (error) {
            console.error('Error getting Android ID:', error);
            this.setState({ error: 'Error getting Android ID' });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {!this.state.ready && <Text style={styles.big}>Using Geolocation in Expo</Text>}
                {this.state.error && <Text style={styles.big}>Error: {this.state.error}</Text>}
                {this.state.ready && (
                    <Text style={styles.big}>
                        Latitude: {this.state.location.coords.latitude}, Longitude: {this.state.location.coords.longitude}, Reference: {this.state.androidId}
                    </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    big: {
        fontSize: 25
    }
});