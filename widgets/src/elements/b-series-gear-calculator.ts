import { defineCustomElement } from 'vue';

import BSeriesGearCalculator from '../components/b-series-gear-calculator/BSeriesGearCalculator.vue';

customElements.define(
  'b-series-gear-calculator',
  defineCustomElement(BSeriesGearCalculator, {
    // Needs to be set to false otherwise CSS from Hugo won't work on it.
    shadowRoot: false,
  }),
);
