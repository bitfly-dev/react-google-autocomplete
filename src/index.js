import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import _ from 'lodash';

const FORM_CONTROL_PROPS = [
  '_ref',
  'as',
  'disabled',
  'id',
  'plaintext',
  'readOnly',
  'size',
  'type',
  'value',
  'bsPrefix',
  'placeholder',

  // props below are controlled by redux-form
  'isInvalid',
  'isValid',
  'onChange'
];

export default class ReactGoogleAutocomplete extends React.Component {
  static propTypes = {
    onPlaceSelected: PropTypes.func,
    types: PropTypes.array,
    componentRestrictions: PropTypes.object,
    bounds: PropTypes.object,
    fields: PropTypes.array,
    address: PropTypes.object.isRequired,
    geoLocation: PropTypes.object,
    components: PropTypes.array,
    placeId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.event = null;
  }

  componentDidMount() {

    const {
      types=['(cities)'],
      componentRestrictions,
      bounds,
      fields = ["address_components", "geometry.location", "place_id", "formatted_address"]
    } = this.props;

    const config = {
      types,
      bounds,
      fields,
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    this.disableAutofill();

    this.autocomplete = new window.google.maps.places.Autocomplete(this.refs.input, config);

    this.event = this.autocomplete.addListener('place_changed', this.onSelected.bind(this));
  }

  disableAutofill() {
    // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
    if (window.MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect();
        if (this.refs && this.refs.input) {
          this.refs.input.autocomplete = 'disable-autofill';
        }
      });
      observerHack.observe(this.refs.input, {
        attributes: true,
        attributeFilter: ['autocomplete'],
      });
    }
  }

  componentWillUnmount() {
    this.event.remove();
  }

  onSelected() {
    this.setFieldValues(this.autocomplete.getPlace());
    if (this.props.onPlaceSelected) {
      this.props.onPlaceSelected(this.autocomplete.getPlace());
    }
  }

  setFieldValues(place) {
    
    const { address, geoLocation, components, placeId } = this.props;

    address.input.onChange(place.formatted_address);

    if (geoLocation) {
      geoLocation.input.onChange(place.geometry.location);
    }
    if (components) {
      components.input.onChange(place.address_components);
    }
    if (placeId) {
      placeId.input.onChange(place.place_id);
    }
  }

  render() {
    const {
      onPlaceSelected,
      types,
      componentRestrictions,
      bounds,
      address,
      geoLocation,
      components,
      placeId,
      ...rest
    } = this.props;

    return (
        <FormControl
          {...address.input}
          ref="input"
          {..._.pick(rest, FORM_CONTROL_PROPS)}
          onChange={
            (evt) => {
              this.setFieldValues({
                formatted_address: '',
                geometry: {
                  location: null,
                },
                address_components: [],
                place_id: '',
              });
              address.input.onChange(evt.target.value);
            }
          }
        />
    );
  }
}