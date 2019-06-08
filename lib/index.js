'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FORM_CONTROL_PROPS = ['_ref', 'as', 'disabled', 'id', 'plaintext', 'readOnly', 'size', 'type', 'value', 'bsPrefix', 'placeholder',

// props below are controlled by redux-form
'isInvalid', 'isValid', 'onChange'];

var ReactGoogleAutocomplete = function (_React$Component) {
  _inherits(ReactGoogleAutocomplete, _React$Component);

  function ReactGoogleAutocomplete(props) {
    _classCallCheck(this, ReactGoogleAutocomplete);

    var _this = _possibleConstructorReturn(this, (ReactGoogleAutocomplete.__proto__ || Object.getPrototypeOf(ReactGoogleAutocomplete)).call(this, props));

    _this.autocomplete = null;
    _this.event = null;
    return _this;
  }

  _createClass(ReactGoogleAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          _props$types = _props.types,
          types = _props$types === undefined ? ['(cities)'] : _props$types,
          componentRestrictions = _props.componentRestrictions,
          bounds = _props.bounds,
          _props$fields = _props.fields,
          fields = _props$fields === undefined ? ["address_components", "geometry.location", "place_id", "formatted_address"] : _props$fields;


      var config = {
        types: types,
        bounds: bounds,
        fields: fields
      };

      if (componentRestrictions) {
        config.componentRestrictions = componentRestrictions;
      }

      this.disableAutofill();

      this.autocomplete = new window.google.maps.places.Autocomplete(this.refs.input, config);

      this.event = this.autocomplete.addListener('place_changed', this.onSelected.bind(this));
    }
  }, {
    key: 'disableAutofill',
    value: function disableAutofill() {
      var _this2 = this;

      // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
      if (window.MutationObserver) {
        var observerHack = new MutationObserver(function () {
          observerHack.disconnect();
          if (_this2.refs && _this2.refs.input) {
            _this2.refs.input.autocomplete = 'disable-autofill';
          }
        });
        observerHack.observe(this.refs.input, {
          attributes: true,
          attributeFilter: ['autocomplete']
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.event.remove();
    }
  }, {
    key: 'onSelected',
    value: function onSelected() {
      this.setFieldValues(this.autocomplete.getPlace());
      if (this.props.onPlaceSelected) {
        this.props.onPlaceSelected(this.autocomplete.getPlace());
      }
    }
  }, {
    key: 'setFieldValues',
    value: function setFieldValues(place) {
      var _props2 = this.props,
          input = _props2.input,
          geoLocation = _props2.geoLocation,
          components = _props2.components,
          placeId = _props2.placeId;

      if (input) {
        input.onChange(place.formatted_address);
      }
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
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          onPlaceSelected = _props3.onPlaceSelected,
          types = _props3.types,
          componentRestrictions = _props3.componentRestrictions,
          bounds = _props3.bounds,
          _props3$input = _props3.input,
          input = _props3$input === undefined ? {} : _props3$input,
          geoLocation = _props3.geoLocation,
          components = _props3.components,
          placeId = _props3.placeId,
          _onChange = _props3.onChange,
          rest = _objectWithoutProperties(_props3, ['onPlaceSelected', 'types', 'componentRestrictions', 'bounds', 'input', 'geoLocation', 'components', 'placeId', 'onChange']);

      return _react2.default.createElement(_reactBootstrap.FormControl, _extends({}, input, {
        ref: 'input'
      }, _lodash2.default.pick(rest, FORM_CONTROL_PROPS), {
        onChange: function onChange(evt) {
          _this3.setFieldValues({
            formatted_address: '',
            geometry: {
              location: null
            },
            address_components: [],
            place_id: ''
          });
          input.onChange(evt.target.value);
          if (_onChange) {
            _onChange();
          }
        }
      }));
    }
  }]);

  return ReactGoogleAutocomplete;
}(_react2.default.Component);

ReactGoogleAutocomplete.propTypes = {
  onPlaceSelected: _propTypes2.default.func,
  types: _propTypes2.default.array,
  componentRestrictions: _propTypes2.default.object,
  bounds: _propTypes2.default.object,
  fields: _propTypes2.default.array
};
exports.default = ReactGoogleAutocomplete;