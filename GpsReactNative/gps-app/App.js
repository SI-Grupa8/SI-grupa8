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
            sendingLocation: false, 
            loginToken: null, 
            deviceValidateToken: null, 
            modifiedLongitude: null, 
            modifiedLatitude: null
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
                await this.sendLoginRequest();
                //this.sendLocationInterval = setInterval(this.sendLocation, 60000); //1 min
                this.setState({ sendingLocation: true });
            }
        } catch (error) {
            console.error('Error starting sending location:', error);
        }
    }

    stopSendingLocation = () => {
        clearInterval(this.sendPostRequestToDeviceLocation);
        this.setState({ sendingLocation: false});
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

    sendLoginRequest = async () => {
        try {
            const url = 'https://vehicle-tracking-system-dev-api.azurewebsites.net/api/Auth/login';
            const { email, password, location } = this.state;
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'admin55@gmail.com',
                    password: '12345678'
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to login');
            }
    
            const data = await response.json();
            const loginToken = data.token;
            this.setState({ loginToken });
            console.log('Token:', loginToken);
            // calls the second method
            this.sendGetRequestToDeviceLocation();
            const { modifiedLongitude, modifiedLatitude } = this.modifyCoordinates(location.coords.longitude, location.coords.latitude);
            this.setState({modifiedLatitude});
            this.setState({modifiedLongitude});
        } catch (error) {
            console.error('Error logging in:', error);
            this.setState({ error: 'Error logging in' });
        }
    };

    sendGetRequestToDeviceLocation = async () => {
        try {
            const { androidId, loginToken } = this.state;
            // before deploy
            //const url = `https://vehicle-tracking-system-dev-api.azurewebsites.net/api/DeviceLocation?macAddress=${androidId}`;
            const url = `https://vehicle-tracking-system-dev-api.azurewebsites.net/api/DeviceLocation?macAddress=mac2`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginToken}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch device location');
            }
    
            const data = await response.text();
            const deviceValidateToken = data;
            this.setState({ deviceValidateToken });
            console.log('Device location:', data);
            // calls the third method
            this.sendPostRequestToDeviceLocation();
            this.sendLocationInterval = setInterval(this.sendPostRequestToDeviceLocation, 60000); //1 min
        } catch (error) {
            console.error('Error fetching device location:', error);
            this.setState({ error: 'Error fetching device location' });
        }
    };

    modifyCoordinates = (longitude, latitude) => {
        // Convert longitude and latitude to string
        const longStr = longitude.toString();
        const latStr = latitude.toString();
    
        // Extract the parts before and after the decimal point
        const longParts = longStr.split('.');
        const latParts = latStr.split('.');
    
        // If there are less than two parts, return the original coordinates
        if (longParts.length < 2 || latParts.length < 2) {
            return { modifiedLongitude: longitude, modifiedLatitude: latitude };
        }
    
        // Extract the first three and last three digits after the decimal point
        const longFirstThree = longParts[1].substring(0, 3);
        const latFirstThree = latParts[1].substring(0, 3);
        const longLastThree = longParts[1].substring(longParts[1].length - 3);
        const latLastThree = latParts[1].substring(latParts[1].length - 3);
    
        // Construct the modified coordinates
        const modifiedLongitude = `${longParts[0]}.${longFirstThree}secretCode${longLastThree}`;
        const modifiedLatitude = `${latParts[0]}.${latFirstThree}secretCode${latLastThree}`;
    
        return { modifiedLongitude, modifiedLatitude };
    };
    
    
    sendPostRequestToDeviceLocation = async () => {
        try {
            const { location, deviceValidateToken, modifiedLatitude, modifiedLongitude } = this.state;
            // switched on backend for some reason
            const url = `https://vehicle-tracking-system-dev-api.azurewebsites.net/api/DeviceLocation?lat=${modifiedLongitude}&lg=${modifiedLatitude}`;

            //const { modifiedLongitude, modifiedLatitude } = this.modifyCoordinates(location.coords.longitude, location.coords.latitude);
            console.log(modifiedLatitude);
            console.log(modifiedLongitude);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deviceValidateToken}`
                },
            });
    
            if (!response.ok) {
                //const responseData = await response.json();
                //console.error('Response:', responseData);
                console.log(response);
                throw new Error('Failed to send location');
            }
    
            console.log('Location sent successfully');
        } catch (error) {
            console.error('Error sending location:', error);
            this.setState({ error: 'Error sending location' });
        }
    };
    

    render() {
        return (
            <View style={styles.container}>
                {/* <TextInput
                    style={styles.input}
                    placeholder="Enter token"
                    onChangeText={this.handleTokenChange}
                    value={this.state.token}
                /> */}
                <View style={styles.buttonContainer}>
                <Button title="Start Sending Location" onPress={this.startSendingLocation} disabled={this.state.sendingLocation} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Stop Sending Location" onPress={this.stopSendingLocation} disabled={!this.state.sendingLocation} />
            </View>
                {/* <Button title="Login" onPress={this.sendLoginRequest} /> */}
                {!this.state.ready && <Text style={styles.big}>Using Geolocation in Expo</Text>}
                {/*displays an error that doesnt affect the functionality, so removed because all relevant errors are shown in console*/}
                {/* {this.state.error && <Text style={styles.big}>Error: {this.state.error}</Text>} */}
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
                {this.state.token !== '' && (
                        <Text style={styles.big}>Token: {this.state.loginToken}</Text>
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
    },
    buttonContainer: {
        marginBottom: 10
    }
});
