<template>
	<div :class="{ home: true, toProduct: data.toProduct}">
		<div :class="{ cartContainer: true, showCart: data.showCart }">
			<div class="cartContent">
				<div class="topBar">
					<h2>In cart</h2>
					<button @click="data.showCart = false">
						<img src="../assets/X.png" alt="" />
					</button>
				</div>
				<div class="cartItems" v-if="store.state.inCart.length > 0">
					<div class="cartItem" v-for="(product, index) in store.state.inCart" :key="product.id">
						<img :src="product.images[0]" alt="" />
						<div class="cartItemText">
							<h2>{{ product.title }}</h2>
							<div class="cartItemActions">
								<button @click="store.commit('decrement', index)">-</button>
								<p>{{ product.amount }}</p>
								<button @click="store.commit('increment', index)">+</button>
							</div>
						</div>
					</div>
				</div>
				<div class="emptyCart" v-else>NO ITEMS</div>
				<div class="bottomBar">
					<h2>Total: ${{ subTotal }}</h2>
					<router-link class="toCheckout" to="/checkout">Checkout</router-link>
				</div>
			</div>
		</div>
		<div :class="{ filterContainer: true, showFilter: data.showFilter }">
			<div class="filterContent">
				<div class="topBar">
					<h2>Filter</h2>
					<button @click="data.showFilter = false">
						<img src="../assets/X.png" alt="" />
					</button>
				</div>
				<div class="filterItems">
					<button v-for="(category, index) in data.categories" :class="{ active: data.selectedCategories.includes(category) }" :key="index" :ref="category" @click="setCategory(category)">
						{{ category.toUpperCase() }}
					</button>
				</div>
			</div>
		</div>
		<nav class="desktop">
			<h1><span>All</span>Store</h1>
			<div class="search-cart">
				<div class="searchBar">
					<input type="text" v-model="data.searchWord" placeholder="Search..." />
					<img src="../assets/MagnifyingGlass.png" alt="" />
				</div>
				<button class="cart" @click="data.showCart = true">
					<div class="cartAmount" v-if="store.state.inCart.length > 0"></div>
					<img src="../assets/ShoppingBagOpen.png" alt="" />
				</button>
			</div>
		</nav>
		<nav class="mobile">
			<h1><span>All</span>Store</h1>
			<div class="cart-filter">
				<button class="cart" @click="data.showCart = true">
					<div class="cartAmount" v-if="store.state.inCart.length > 0"></div>
					<img src="../assets/ShoppingBagOpen.png" alt="" />
				</button>
				<button class="filter" @click="data.showFilter = true">
					<img src="../assets/FunnelSimple.png" alt="" />
				</button>
			</div>
			<div class="searchBar">
				<input type="text" v-model="data.searchWord" placeholder="Search..." />
				<img src="../assets/MagnifyingGlass.png" alt="" />
			</div>
		</nav>
		<div class="filterButtons">
			<button v-for="(category, index) in data.categories" :class="{ active: data.selectedCategories.includes(category) }" :key="index" :ref="category" @click="setCategory(category)">
				{{ category.toUpperCase() }}
			</button>
		</div>
		<div class="productsContainer">
			<div class="products" v-if="filteredProducts">
				<div class="product" v-for="product in filteredProducts" :key="product.id">
					<img :src="product.images[0]" alt="product image" />
					<div class="textContainer">
						<h2 class="title" @click="toProduct(product.id)">{{ product.title }}</h2>
						<p>{{ product.description }}</p>
						<h1>${{ product.price }}</h1>
					</div>
					<button class="removeFromCart" @click="store.commit('remove', product)" v-if="store.state.inCart.filter((item) => item.id == product.id).length > 0">Remove</button>
					<button @click="addToCart(product)" v-else>Add to cart</button>
				</div>
			</div>
			<div class="loadingSkeleton" v-else>
				<div class="loadItem" v-for="item in data.productAmount" :key="item"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
	setup() {
		const data = reactive({
			products: undefined,
			categories: ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration'],
			selectedCategories: [],
			productAmount: 50,
			searchWord: '',
			showCart: false,
			showFilter: false,
			toProduct: false
		});

		const store = useStore();
		const router = useRouter()

		function addToCart(product) {
			product.amount = 1;
			store.commit('addItem', product);
		}

		function setCategory(category) {
			const index = data.selectedCategories.indexOf(category) ?? null;
			if (data.selectedCategories.includes(category)) {
				data.selectedCategories.splice(index, 1);
			} else {
				data.selectedCategories.push(category);
			}
		}

		function toProduct(id) {
			data.toProduct = true
			// router.push('/'+id)
			setTimeout(() => {
				router.push(`/${id}`)
			}, 500)
		}

		const filteredProducts = computed(() => {
			if (!data.products) return;
			if (data.searchWord != '') {
				return data.products.filter((product) => product.title.toLowerCase().includes(data.searchWord.toLowerCase()));
			} else if (data.selectedCategories != 0) {
				return data.products.filter((product) => data.selectedCategories.includes(product.category));
			} else {
				return data.products;
			}
		});

		onMounted(() => {
			fetch(`https://dummyjson.com/products/`)
				.then((res) => res.json())
				.then((json) => {
					data.products = json.products;
				})
				.catch((err) => console.log(err));
		});

		return {
			data,
			setCategory,
			filteredProducts,
			store,
			subTotal: computed(() => {
				let sub = 0;
				store.state.inCart.forEach((product) => {
					sub += product.price * product.amount;
				});
				return sub;
			}),
			addToCart,
			toProduct
		};
	},
};
</script>

<style lang="scss" scoped>
$Primary: #fc6020;
$Secondary: #ededed;

.home {
	width: 80%;
	max-width: 1920px;
	transition: opacity 300ms;
	.cartContainer,
	.filterContainer {
		position: fixed;
		right: 0;
		top: 0;
		height: 100vh;
		transform: translateX(100%);
		width: 40%;
		min-width: 300px;
		max-width: 600px;
		background-color: $Secondary;
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
		z-index: 10;
		transition: all 300ms;
		.cartContent,
		.filterContent {
			position: relative;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: column;
			gap: 30px;
			padding: 30px;
			.topBar {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				h2 {
					font-size: 32px;
					font-weight: 300;
				}
				button {
					border: none;
					background-color: transparent;
					img {
						width: 32px;
					}
				}
				button:hover {
					cursor: pointer;
				}
			}
			.bottomBar {
				width: 100%;
				.toCheckout {
					display: flex;
					justify-content: center;
					align-items: center;
					text-decoration: none;
					width: 100%;
					margin-top: 30px;
					border: none;
					height: 80px;
					font-size: 28px;
					border-radius: 7px;
					background-color: $Primary;
					box-shadow: 0px 13px 9px -7px rgba(117, 44, 14, 0.3);
					color: white;
					transition: all 300ms;
				}
				.toCheckout:hover {
					cursor: pointer;
					filter: brightness(1.3);
				}
			}
			.cartItems {
				width: 100%;
				height: 100%;
				overflow-y: auto;
				overflow-x: none;
				.cartItem {
					width: 100%;
					margin-block: 10px;
					height: 150px;
					background-color: white;
					transform: translateX(50%);
					transition: all 600ms;
					display: flex;
					padding: 10px;
					border-radius: 7px;
					align-items: center;
					gap: 20px;
					img {
						height: 100%;
						aspect-ratio: 1/1;
						object-fit: cover;
						border-radius: 7px;
						filter: brightness(0.8);
					}
					.cartItemText {
						height: 100%;
						display: flex;
						justify-content: center;
						flex-direction: column;
						gap: 20px;
						h2 {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1; /* number of lines to show */
							line-clamp: 1;
							-webkit-box-orient: vertical;
							font-weight: 300;
						}
						.cartItemActions {
							display: flex;
							align-items: center;
							gap: 15px;
							button {
								width: 30px;
								height: 30px;
								display: flex;
								justify-content: center;
								align-items: center;
								background-color: black;
								color: white;
								border: none;
								border-radius: 4px;
								font-size: 20px;
							}
							button:hover {
								cursor: pointer;
							}
						}
					}
				}
			}
			.emptyCart {
				font-size: 32px;
				color: rgb(131, 131, 131);
			}
			.filterItems {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				gap: 20px;
				button {
					width: 100%;
					height: 40px;
					border-radius: 7px;
					background-color: white;
					color: black;
					border: none;
				}
				button:hover {
					cursor: pointer;
				}
				.active {
					background-color: $Primary;
					color: white;
				}
			}
		}
	}
	.filterContainer {
		display: none;
	}
	.showCart,
	.showFilter {
		transform: translateX(0);
		box-shadow: 0px 4px 32px 15px rgba(0, 0, 0, 0.33);
		.cartContent .cartItems .cartItem {
			transform: translateX(0);
		}
	}
	.desktop {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 30px;
		h1 {
			font-style: italic;
			font-size: 48px;
			font-weight: 400;
			span {
				color: $Primary;
			}
		}
		.search-cart {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 20px;
			.searchBar {
				background-color: white;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 7px;
				box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.25);
				transition: all 300ms;
				input {
					border: none;
					font-size: 20px;
					padding: 10px 15px;
					font-weight: 300;
					width: 350px;
					height: 50px;
					background: transparent;
					outline: none;
				}
				img {
					height: 32px;
					margin: 10px;
				}
			}
			.searchBar:focus-within {
				box-shadow: 0px 4px 7px -3px rgba(0, 0, 0, 0.25);
			}
			.cart {
				position: relative;
				border: none;
				background-color: transparent;
				.cartAmount {
					position: absolute;
					top: 0;
					right: 0;
					width: 12px;
					height: 12px;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: $Primary;
				}
				img {
					height: 32px;
				}
			}
			.cart:hover {
				cursor: pointer;
			}
		}
	}
	.mobile {
		width: 100%;
		padding-block: 30px;
		display: none;
		gap: 20px 0;
		grid-template: 1fr 50px / 1fr 1fr;
		h1 {
			place-self: center start;
			font-style: italic;
			font-size: 48px;
			font-weight: 400;
			span {
				color: $Primary;
			}
		}
		.cart-filter {
			place-self: center end;
			button {
				border: none;
				margin-left: 40px;
				background-color: transparent;
				img {
					height: 32px;
				}
			} 
			button:hover {
				cursor: pointer;
			}
			.cart {
				position: relative;
				border: none;
				background-color: transparent;
				margin: 0;
				.cartAmount {
					position: absolute;
					top: 0;
					right: 0;
					width: 12px;
					height: 12px;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: $Primary;
				}
			}
		}
		.searchBar {
			grid-column: 1/3;
			background-color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 7px;
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.25);
			transition: all 300ms;
			width: 100%;
			input {
				border: none;
				font-size: 20px;
				padding: 10px 15px;
				font-weight: 300;
				width: 100%;
				height: 50px;
				background: transparent;
				outline: none;
			}
			img {
				height: 32px;
				margin: 10px;
			}
		}
		.searchBar:focus-within {
			box-shadow: 0px 4px 7px -3px rgba(0, 0, 0, 0.25);
		}
	}
	.filterButtons {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 0px 30px;
		gap: 2%;
		button {
			width: 100%;
			height: 40px;
			border-radius: 7px;
			background-color: white;
			color: black;
			border: none;
			transition: all 200ms;
		}
		button:hover {
			cursor: pointer;
		}
		.active {
			background-color: $Primary;
			color: white;
		}
	}
	.productsContainer {
		width: 100%;
		.products {
			width: 100%;
			display: grid;
			gap: 40px;
			grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
			.product {
				width: 100%;
				border-radius: 7px;
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 1fr 40px;
				gap: 13px;
				padding: 13px;
				background-color: white;
				img {
					grid-column: 1/2;
					width: 100%;
					aspect-ratio: 1/1;
					filter: brightness(0.8);
					object-fit: cover;
					border-radius: 7px;
				}
				.textContainer {
					* {
						margin-top: 10px;
					}
					place-self: end start;
					p,
					h2 {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2; /* number of lines to show */
						line-clamp: 2;
						-webkit-box-orient: vertical;
						font-weight: 300;
					}
					.title {
						font-weight: 400;
					}
					.title:hover {
						cursor: pointer;
						text-decoration: underline solid 1px black;
					}
				}
				button {
					grid-column: 1/3;
					background-color: $Primary;
					border: none;
					border-radius: 4px;
					color: white;
					font-size: 18px;
					transition: all 300ms;
				}
				button:hover {
					cursor: pointer;
					filter: brightness(1.2);
				}
				.removeFromCart {
					background-color: transparent;
					border: solid $Primary 2px;
					color: $Primary;
				}
				.removeFromCart:hover {
					background-color: #fc5e2018;
				}
			}
		}
		.loadingSkeleton {
			width: 100%;
			display: grid;
			gap: 40px;
			grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
			place-items: center;
			.loadItem {
				height: 300px;
				background-color: white;
				border-radius: 7px;
				animation: loadAnimation 1s infinite;
			}
			@keyframes loadAnimation {
				0% {
					background-color: white;
				}
				50% {
					background-color: $Secondary;
				}
				100% {
					background-color: white;
				}
			}
		}
	}
}
@media screen and (max-width: 1000px) {
	.home {
		.filterContainer {
			display: block;
		}

		.cartContainer .cartContent,
		.filterContainer .filterContent {
			.topBar {
				h2 {
					font-size: 24px;
				}
				button img {
					height: 24px;
					width: 24px;
				}
			}
			.bottomBar .toCheckout {
				height: 60px;
				font-size: 24px;
			}
			.cartItems {
				.cartItem {
					height: 100px;
					h2 {
						font-size: 20px;
					}
				}
			}
		}
		.desktop {
			display: none;
		}
		.mobile {
			display: grid;
		}
		.filterButtons {
			display: none;
		}
		.productsContainer {
			.products {
				grid-template-columns: 1fr;
			}
		}
	}
}
@media screen and (max-width: 555px) {
	.home .productsContainer .products .product .textContainer {
		h2 {
			font-size: 20px;
		}
		h1 {
			font-size: 24px;
		}
		p {
			font-size: 18px;
		}
	}
	.home .mobile h1 {
		font-size: 32px;
	}
}
.toProduct {
	opacity: 0;
}
</style>
