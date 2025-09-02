import { defineCustomElement } from 'vue';
import SpringRateConverter from '../components/spring-rate-converter/SpringRateConverter.vue';

customElements.define(
  'spring-rate-converter',
  defineCustomElement(SpringRateConverter, {
    // Needs to be set to false otherwise CSS from Hugo won't work on it.
    shadowRoot: false,
  }),
);
