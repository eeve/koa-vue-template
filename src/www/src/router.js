import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
	mode: 'history',
	scrollBehavior: () => ({ y: 0 }),
	routes: [
		{ path: '/index', meta: { title: '首页' }, component (resolve) { import('./components/Home.vue').then(resolve); } }
	]
});
