import { defineCustomElement } from 'vue'

import Foo from '../components/Foo.vue'

console.log("Register foo")
customElements.define('foo-bar', defineCustomElement(Foo))