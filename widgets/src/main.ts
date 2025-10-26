import { createApp } from 'vue';
import App from './App.vue';

// Import SASS from the hugo project here instead of the components because
// normally it'd be imported from Hugo itself. This just ensures the widget demo
// renders properly.
import '../../assets/sass/index.sass';

const app = createApp(App);

app.mount('#app');
