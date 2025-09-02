<script setup lang="ts">
// Shoelace must be imported / setBasePathed in every root web component since we use
// them as the entry points to compile from.
import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath, SlInput, type SlChangeEvent } from '@shoelace-style/shoelace';
import { isSLInput } from '@/utils';
import { ref } from 'vue';

if (import.meta.env.MODE === 'production') {
  // Hugo auto resolve's the /static sub-dir so we omit it in the path
  setBasePath('../../../shoelace');
}

const lbIn = ref<number | null>(null);
const kgMM = ref<number | null>(null);

const onSAEChange = (ev: SlChangeEvent) => {
  if (!isSLInput(ev.target)) {
    throw new Error('No target for onSAEChange');
  }

  lbIn.value = ev.target.valueAsNumber;
  kgMM.value = Number.parseFloat((lbIn.value / 55.88).toFixed(2));
};

const onMetricChange = (ev: SlChangeEvent) => {
  if (!isSLInput(ev.target)) {
    throw new Error('No target for onMetricChange');
  }

  kgMM.value = ev.target.valueAsNumber;
  lbIn.value = Math.round(kgMM.value * 55.88);
};
</script>

<template>
  <div class="mw320px">
    <strong>lb/in</strong>
    <sl-input
      type="number"
      size="large"
      min="0"
      :value="lbIn"
      @sl-input="onSAEChange"
      class="mb2"
    /> 
    <strong>kg/mm</strong>
    <sl-input
      type="number"
      size="large"
      min="0"
      :value="kgMM"
      @sl-input="onMetricChange"
      class="mb2"
    />
  </div>
</template>

<style lang="sass" scoped>
.mw320px
  max-width: 320px
</style>
