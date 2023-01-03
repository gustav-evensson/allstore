import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import OrderConfirm from '../views/OrderConfirm.vue';
import PathNotFound from '../views/pageNotFound.vue';
import ProductView from '../views/ProductView.vue'
import store from '@/store';

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/checkout',
		name: 'checkout',
		component: CheckoutView,
	},
	{
		path: '/orderconfirm',
		name: 'orderconfirm',
		component: OrderConfirm,
		meta: { requireOrderConfirm: true },
	},
	{
		path: '/:id',
		name: 'product',
		component: ProductView,
	},
	{
		path: '/:pathMatch(.*)*',
		component: PathNotFound,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

// router.beforeEach((from, to, next) => {
// 	console.log('to:', to.path)
// 	console.log('from:', from.path)
// 	let getOrderConfirmation = store.state.orderConfirm
// 	const requiresOrderConfirm = to.matched.some(record => record.meta.confirmOrder)
// 	if(requiresOrderConfirm && !getOrderConfirmation){
// 		next(from.path)
// 	}
// 	else{
// 		next()
// 	}
// })

router.beforeEach(async (to, from, next) => {
	let getOrder = await store.state.orderConfirm;
	const reqOrderConfirm = to.matched.some((record) => record.meta.requireOrderConfirm);
	if (reqOrderConfirm && !getOrder) {
		next(from.path);
	} else {
		next();
	}
});

export default router;
