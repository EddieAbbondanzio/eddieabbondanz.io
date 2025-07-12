import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BSeriesGearcalculator from '../BSeriesGearCalculator.vue'

describe('BSeriesGearcalculator', () => {
  it('renders properly', () => {
    const wrapper = mount(BSeriesGearcalculator, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
