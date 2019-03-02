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

// name, address, an image, and hours if present in response
// to be continued...
const AddtionalMarkerContextDisplay = (props) => {
  console.log('Addtional marker context display is rendering....')
  console.log(props)
  return (
    props.display_context_window ?
      <span>
        {

          props.markers.map(marker => {
            if (marker.id == props.context_window_marker_id) {
              return 'YOOO' + marker.id.toString()
            }
          })
        }
      </span>
      : <span>Select a marker, push the button for context.</span>
  )
}

const MyMapComponent = compose(withScriptjs, withGoogleMap)(props => {

    // to continue .. https://github.com/fullstackreact/google-maps-react/blob/master/README.md
    return (
      <GoogleMap defaultZoom={4} defaultCenter={{ lat: 41.850033, lng: -87.650052 }}>
          {props.markers.map(marker => {
            return (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={ () => { props.open_or_close_info_window(marker.id, props.childSetState, props.markers, props.component, true) } }
                >
                  { marker.is_shown &&
                  <InfoWindow onCloseClick={ () => { props.open_or_close_info_window(marker.id, props.childSetState, props.markers, props.component, false) } }>
                    <div>
                      <h1>{marker.name}</h1>
                      <p>{marker.address}</p>
                      <button onClick={() => { props.change_marker_context_display(marker.id, props.childSetState, props.component) } }>Show Context</button>
                    </div>
                  </InfoWindow>
                  }
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
      display_context_window : false,
      context_window_marker_id : 1,
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
          console.log(response[i])
          // Get latidude & longitude from address.
          Geocode.fromAddress(response[i].address).then(
            resp => {
              const { lat, lng } = resp.results[0].geometry.location;
              this.setState(prevState => ({
                markers : [...prevState.markers, {
                  'lat' : lat ,
                  'lng' : lng,
                  'id' : i,
                  'name' : response[i].name,
                  'address' : response[i].address,
                  'is_shown' : false
                }]
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

  childSetState(obj, comp) {
    comp.setState(obj);
  }

  change_marker_context_display(marker_id, child_set_state, component) {
    console.log('in change marker context display')
    console.log(marker_id)
    child_set_state(
      {
        'display_context_window' : true,
        'context_window_marker_id' : marker_id
      },
      component
    )
  }

  open_or_close_info_window(marker_id, child_set_state, markers, component, open) {
    for (let i = 0 ; i < markers.length ; i++) {
      if (markers[i].id == marker_id) {
        if (open) {
          markers[i].is_shown = true
        } else {
          markers[i].is_shown = false
        }
        break
      }
    }
    child_set_state(
      { 'markers' : markers },
      component
    )
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
          childSetState={this.childSetState}
          component={this}
          markers={this.state.markers}
          open_or_close_info_window={this.open_or_close_info_window}
          markers_loaded={this.state.markers_loaded}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          change_marker_context_display={this.change_marker_context_display}
          />
        <AddtionalMarkerContextDisplay
          markers={this.state.markers}
          display_context_window={this.state.display_context_window}
          context_window_marker_id={this.state.context_window_marker_id}
          />
      </span>
    );
  }
}

export default App;
