import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

// New library that I'm testing.
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import { compose } from "recompose";

// Google maps wrapper that makes it easy to overlay components on top of google map.
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

// Styled components.
import styled from 'styled-components';

import { fetchLocations } from '../helpers/api';

const api_key = '';
const MarcusTestingComponent = ({ text }) => <div>{text}</div>;

const MyMapComponent = compose(withScriptjs, withGoogleMap)(props => {
  // to continue .. https://github.com/fullstackreact/google-maps-react/blob/master/README.md
  return (
    <GoogleMap defaultZoom={4} defaultCenter={{ lat: 41.850033, lng: -87.650052 }}>
        {props.markers.map(marker => {
          return (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
            >
            </Marker>
          )
        })}
    </GoogleMap>
  )
})

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      markers : [],
      markers_loaded : false
    };
  }

  componentWillUpdate(nextProps, nextState) {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  geocode_addresses() {
    fetchLocations()
      .then(response => {

        // Set our API key.
        Geocode.setApiKey("");

        ////////////////////////////////////////////////////////////////////////
        //
        // We loop through each of the eventual pins in the locations array,
        // and we get the (lat, lng) tuple for this address in order to add
        // the address to our google maps object.
        //
        ////////////////////////////////////////////////////////////////////////
        for ( let i = 0; i < response.length; i++ ) {

          // Get latidude & longitude from address.
          Geocode.fromAddress(response[i].address).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              this.setState(prevState => ({
                markers : [...prevState.markers, { 'lat' : lat , 'lng' : lng}]
              }))
            },
            error => {
              console.error(error);
            }
          );

        }

      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
      this.geocode_addresses()
  }

  render() {
    return (
      <span>
        <h1>Locations Map Exercise!</h1>
        <MyMapComponent
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + api_key + "&v=3.exp&libraries=geometry,drawing,places"}
          isMarkerShown
          markers={this.state.markers}
          markers_loaded={this.state.markers_loaded}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          />
      </span>
    );
  }
}

export default App;
