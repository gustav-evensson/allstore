import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
	state: {
		inCart: [],
		orderConfirm: true
	},
	mutations: {
		increment(state, index){
			state.inCart[index].amount++
		},
		decrement(state, index){
			if(state.inCart[index].amount > 1){
				state.inCart[index].amount--
			}
      else{
        state.inCart.splice(index, 1)
      }
		},
		remove(state, item){
      const index = state.inCart.indexOf(item)
			state.inCart.splice(index, 1)
		},
		addItem(state, item){
     state.inCart.push(item)
		},
		setOrderConfirm(state, value){
			if(typeof(value) === 'boolean'){
				state.orderConfirm = value
			}
			else{
				console.error('STORE ERROR: setOrderConfirm argument must be boolean')
			}
		}
	},
	plugins: [createPersistedState()],
});
