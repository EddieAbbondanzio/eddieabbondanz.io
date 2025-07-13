
import { createApp } from 'vue'
import App from './App.vue'
import '@shoelace-style/shoelace';
import { setBasePath } from '@shoelace-style/shoelace';

// setBasePath("/assets")

const app = createApp(App).mount('#app')
