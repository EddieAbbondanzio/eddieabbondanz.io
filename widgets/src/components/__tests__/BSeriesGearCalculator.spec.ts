import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BSeriesGearCalculator from '../b-series-gear-calculator/BSeriesGearCalculator.vue'

describe('BSeriesGearcalculator', () => {
  it('renders properly', () => {
    const wrapper = mount(BSeriesGearCalculator, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
