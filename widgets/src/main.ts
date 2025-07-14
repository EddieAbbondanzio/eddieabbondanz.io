
import { createApp } from 'vue'
import App from './App.vue'

// N.B. Don't import assets like css or js here because they won't get detected by 
// rollup since it starts at the component files themselves. 

const app = createApp(App).mount('#app')
