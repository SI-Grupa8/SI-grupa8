import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import * as Application from 'expo-application';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            location: null,
            error: null,
            androidId: null,
            token: '',
            sendingLocation: false
        };
    }

    componentDidMount() {
        this.getLocationPermission();
        this.getAndroidId();
    }

    componentWillUnmount() {
        clearInterval(this.sendLocationInterval);
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
            const androidId = Application.getAndroidId();
            this.setState({ androidId });
        } catch (error) {
            console.error('Error getting Android ID:', error);
            this.setState({ error: 'Error getting Android ID' });
        }
    };

    handleTokenChange = (token) => {
        this.setState({ token });
    }

    startSendingLocation = async () => {
        try {
            if (!this.state.sendingLocation) {
                await this.sendLocation();
                this.sendLocationInterval = setInterval(this.sendLocation, 60000); //1 min
                this.setState({ sendingLocation: true });
            }
        } catch (error) {
            console.error('Error starting sending location:', error);
        }
    }

    stopSendingLocation = () => {
        clearInterval(this.sendLocationInterval);
        this.setState({ sendingLocation: false, location: null });
    }

    sendLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            this.setState({ location });
            url='https://vehicle-tracking-system-dev-api.azurewebsites.net/api/DeviceLocation'
            
            const { token } = this.state;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lat: location.coords.latitude,
                    lg: location.coords.longitude
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to send location');
            }
            console.log('Location sent successfully');
        } catch (error) {
            console.error('Error sending location:', error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter token"
                    onChangeText={this.handleTokenChange}
                    value={this.state.token}
                />
                <View style={styles.buttons}>
                    <Button title="Start Sending Location" onPress={this.startSendingLocation} disabled={this.state.sendingLocation} />
                    <Button title="Stop Sending Location" onPress={this.stopSendingLocation} disabled={!this.state.sendingLocation} />
                </View>
                {!this.state.ready && <Text style={styles.big}>Using Geolocation in Expo</Text>}
                {this.state.error && <Text style={styles.big}>Error: {this.state.error}</Text>}
                {this.state.ready && this.state.location && (
                    <Text style={styles.big}>
                        Reference: {this.state.androidId}
                    </Text>
                )}
                {this.state.ready && this.state.location && this.state.sendingLocation && (
                    <Text style={styles.big}>
                        Latitude: {this.state.location.coords.latitude}, Longitude: {this.state.location.coords.longitude}
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
        fontSize: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '80%'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginRight: 55,
        marginBottom: 10
    }
});
