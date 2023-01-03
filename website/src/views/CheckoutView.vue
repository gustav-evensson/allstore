<template>
	<div :class="{checkout: true, orderPlaced: data.orderPlaced}">
		<nav v-if="store.state.inCart.length > 0">
			<router-link class="toHome" to="/"><span>All</span>Store</router-link>
		</nav>
		<div class="checkoutContainer" v-if="store.state.inCart.length > 0">
			<div class="subNav">
				<router-link to="/">
					<img src="../assets/ArrowLeft.png" alt="back arrow">
				</router-link>
				<h1>Checkout</h1>
			</div>
			<div class="checkoutForm">
				<h1 id="poppins">PERSONAL DETAILS</h1>
				<div class="personalDetails formWrapper">
					<div class="regularInput">
						<label for="firstName">First Name</label>
						<input type="text" name="firstName" placeholder="John" />
					</div>
					<div class="regularInput">
						<label for="lastName">Last Name</label>
						<input type="text" name="lastName" placeholder="Doe" />
					</div>
					<div class="regularInput">
						<label for="email">Email</label>
						<input type="email" name="email" placeholder="example@gmail.com" />
					</div>
				</div>
				<h1 id="poppins">SHIPPING DETAILS</h1>
				<div class="shippingDetails formWrapper">
					<div class="regularInput">
						<label for="address">Address</label>
						<input type="text" name="address" placeholder="Example street 37" />
					</div>
					<div class="smallWrapper">
						<div class="smallInput">
							<label for="zipcode">Zip code</label>
							<input type="text" name="zipcode" placeholder="123 45" />
						</div>
						<div class="smallInput">
							<label for="city">City</label>
							<input type="text" name="city" placeholder="Example City" />
						</div>
						<div class="smallInput">
							<label for="country">Country</label>
							<input type="text" name="country" placeholder="Example Country" />
						</div>
					</div>
				</div>
				<h1 id="poppins">PAYMENT METHOD</h1>
				<div class="paymentMethod">
					<div class="methods">
						<div @click="changeMethod(0)" :class="{ method: true, selectedMethod: data.payment[0] }">
							<div>
								<img src="../assets/paypal.png" alt="" />
								<h3>PayPal</h3>
							</div>
							<input type="radio" name="method" :checked="data.payment[0]" />
						</div>
						<div @click="changeMethod(1)" :class="{ method: true, selectedMethod: data.payment[1] }">
							<div>
								<img src="../assets/mCard.png" alt="" />
								<h3>Credit card</h3>
							</div>
							<input type="radio" name="method" :checked="data.payment[1]" />
						</div>
					</div>
					<div class="methodFields">
						<div v-if="data.payment[0]" class="paypalMethod">
							<button class="usePaypal">
								<h3>Continue with</h3>
								<img src="../assets/paypal.png" alt="" />
							</button>
						</div>
						<div v-else-if="data.payment[1]" class="creditCardMethod">
							<div class="regularInput">
								<label for="cardHolder">Card holder</label>
								<input type="text" name="cardHolder" placeholder="John Doe" />
							</div>
							<div class="regularInput">
								<label for="cardNumber">Card number</label>
								<input type="text" name="cardNumber" maxlength="19" placeholder="0000 0000 0000 0000" v-model="data.cardNumber" />
							</div>
							<div class="smallWrapper">
								<div class="smallInput">
									<label for="expDate">Exp date</label>
									<input type="month" name="expDate" />
								</div>
								<div class="smallInput">
									<label for="cvv">CVV</label>
									<input type="password" name="cvv" maxlength="3" placeholder="123" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<h1 id="poppins">ORDER SUMMARY</h1>
				<div class="orderSummary">
					<div class="productSide">
						<div class="product" v-for="product in store.state.inCart" :key="product.id">
							<div class="imageTextWrapper">
								<img :src="product.images[0]" alt="product image" />
								<div>
									<h3>{{ product.title }}</h3>
									<div>
										<p>${{ product.price }}</p>
										<p>Amount: {{ product.amount }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="summarySide">
						<div class="regularInput">
							<label for="discode">Discount code</label>
							<input type="text" name="discode" v-model="data.disCode" />
							<button @click="addDiscount()">Apply</button>
						</div>
						<div class="totals">
							<div class="subTotal">
								<h3>Subtotal</h3>
								<h3>${{ totalAmount }}</h3>
							</div>
							<div class="shipping">
								<h3>Shipping</h3>
								<h3>$1.95</h3>
							</div>
							<div class="discount" v-if="data.discount">
								<h3>Discount</h3>
								<h3>-${{ data.discount }}</h3>
							</div>
							<div class="total">
								<h3>Total</h3>
								<h3>${{ (totalAmount + 1.95 - data.discount).toFixed(2) }}</h3>
							</div>
						</div>
						<button @click="placeOrder()">Place Order!</button>
					</div>
				</div>
			</div>
		</div>
		<div class="noItems" v-else>
			<h1>No items to checkout</h1>
			<h3>Please add items before checking out</h3>
			<router-link class="toHome" to="/">GO SHOPPING</router-link>
		</div>
	</div>
</template>

<script>
import { reactive, watch, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
	setup() {

		let pastLength = 0;
		const store = useStore();
		const router = useRouter();

		const data = reactive({
			payment: [false, false],
			cardNumber: '',
			discount: null,
			disCode: '',
			orderPlaced: false
		});

		function changeMethod(index) {
			if (index == 0) {
				data.payment = [true, false];
			} else {
				data.payment = [false, true];
			}
		}

		function addDiscount() {
			if (data.disCode != '') {
				data.discount = (Math.random() * 10).toFixed(2);
			}
		}

		function placeOrder(){
			data.orderPlaced = true
			store.state.orderConfirm = true
			setTimeout(() => {
				router.push('/orderConfirm')
			}, 1000)
		}

		onUnmounted(() => {
			store.state.inCart = []
		})

		watch(
			() => data.cardNumber,
			(formatted) => {
				if (formatted.length > pastLength) {
					let splitter = formatted.split('');
					if (splitter[splitter.length - 1] != ' ') {
						if (formatted.length == 4 || formatted.length == 5) {
							splitter.splice(4, 0, ' ');
						}
						if (formatted.length == 9 || formatted.length == 10) {
							splitter.splice(9, 0, ' ');
						}
						if (formatted.length == 14 || formatted.length == 15) {
							splitter.splice(14, 0, ' ');
						}
						let joiner = '';
						for (let i = 0; i in splitter; i++) {
							joiner += splitter[i];
						}
						data.cardNumber = joiner;
					}
				}
				pastLength = formatted.length;
			}
		);

		return {
			data,
			changeMethod,
			store,
			totalAmount: computed(() => {
				let total = 0;
				for (let i = 0; i in store.state.inCart; i++) {
					const multiplyer = store.state.inCart[i].amount * store.state.inCart[i].price;
					total = total + multiplyer;
				}
				return total;
			}),
			addDiscount,
			placeOrder
		};
	},
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700&display=swap');
$Primary: #fc6020;
$Secondary: #ededed;

.checkout {
	width: 80%;
	max-width: 1920px;
	transition: all 400ms;
	overflow-x: hidden;
	.noItems {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20px;
		h1 {
			font-size: 48px;
			font-weight: 400;
		}
		h3 {
			font-weight: 300;
		}
		.toHome {
			text-decoration: none;
			padding: 10px 25px;
			border-radius: 10px;
			background-color: white;
			color: #666666;
			transition: all 300ms;
		}
		.toHome:hover {
			background-color: black;
			color: white;
		}
	}
	nav {
		width: 100%;
		padding: 30px 0;
		.toHome {
			font-style: italic;
			font-size: 48px;
			font-weight: 400;
			color: black;
			text-decoration: none;
			span {
				color: $Primary;
			}
		}
		.toHome:hover{
			cursor: pointer;
		}
	}
	.checkoutContainer {
		width: 100%;
		margin-bottom: 50px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 50px;
		.subNav{
			width: 100%;
			display: grid;
			grid-template-columns: 32px 1fr 32px;
			place-items: center;
			img{
				grid-column: 1/2;
				height: 32px;
				width: 32px;
				display: none;
			}
			h1 {
				width: fit-content;
				font-weight: 500;
				font-size: 48px;
				grid-column: 2/3;
			}
		}
		.checkoutForm {
			width: 100%;
			max-width: 700px;
			min-width: 300px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 30px;
			#poppins {
				font-size: 24px;
				font-weight: 600;
				font-family: 'Poppins', sans-serif;
			}
			.formWrapper {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(1fr);
				gap: 30px;
				.regularInput {
					border: solid #666666 2px;
					width: 100%;
					height: 70px;
					border-radius: 10px;
					position: relative;
					label {
						position: absolute;
						top: 0;
						left: 10px;
						transform: translateY(-50%);
						background-color: $Secondary;
						padding: 0 5px;
						color: #666666;
						font-size: 18px;
					}
					input {
						width: 100%;
						height: 100%;
						border: none;
						border-radius: 10px;
						background: transparent;
						outline: none;
						padding: 15px;
						font-size: 20px;
					}
				}
				div:focus-within {
					border-color: black;
					label {
						color: black;
					}
				}
				.smallWrapper {
					width: 100%;
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
					gap: 30px;
					.smallInput {
						border: solid #666666 2px;
						min-width: 200px;
						width: 100%;
						height: 70px;
						border-radius: 10px;
						position: relative;
						label {
							position: absolute;
							top: 0;
							left: 10px;
							transform: translateY(-50%);
							background-color: $Secondary;
							padding: 0 5px;
							color: #666666;
							font-size: 18px;
						}
						input {
							width: 100%;
							height: 100%;
							border: none;
							border-radius: 10px;
							background: transparent;
							outline: none;
							padding: 15px;
							font-size: 20px;
						}
					}
					.smallInput:focus-within {
						border-color: black;
						label {
							color: black;
						}
					}
				}
			}
			.paymentMethod {
				width: 100%;
				display: flex;
				flex-direction: column;
				gap: 20px;
				transition: all 300ms;
				overflow: hidden;
				.methods {
					width: 100%;
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
					gap: 20px;
					.method {
						border: solid 2px #666666;
						border-radius: 10px;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 15px;
						width: 100%;
						height: 70px;
						div {
							display: flex;
							align-items: center;
							gap: 20px;
							img {
								height: 32px;
							}
							h3 {
								font-weight: 400;
								font-size: 20px;
							}
						}
						input {
							width: 20px;
							height: 20px;
							accent-color: #009cde;
							margin-right: 8px;
						}
					}
					.method:hover {
						cursor: pointer;
					}
					.selectedMethod {
						border-color: #009cde;
						background-color: #009bde25;
					}
				}
				.methodFields {
					width: 100%;
					display: flex;
					gap: 20px;
					div {
						width: 100%;
						display: flex;
						flex-direction: column;
						gap: 20px;
						.usePaypal {
							width: 100%;
							height: 70px;
							border-radius: 10px;
							background-color: #ffc33a;
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 30px;
							border: none;
							font-size: 20px;
							font-weight: 300;
						}
						.regularInput {
							border: solid #666666 2px;
							width: 100%;
							height: 70px;
							border-radius: 10px;
							position: relative;
							label {
								position: absolute;
								top: 0;
								left: 10px;
								transform: translateY(-50%);
								background-color: $Secondary;
								padding: 0 5px;
								color: #666666;
								font-size: 18px;
							}
							input {
								width: 100%;
								height: 100%;
								border: none;
								border-radius: 10px;
								background: transparent;
								outline: none;
								padding: 15px;
								font-size: 20px;
							}
						}
						div:focus-within {
							border-color: black;
							label {
								color: black;
							}
						}
						.smallWrapper {
							width: 100%;
							display: grid;
							grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
							gap: 30px;
							.smallInput {
								border: solid #666666 2px;
								min-width: 200px;
								width: 100%;
								height: 70px;
								border-radius: 10px;
								position: relative;
								label {
									position: absolute;
									top: 0;
									left: 10px;
									transform: translateY(-50%);
									background-color: $Secondary;
									padding: 0 5px;
									color: #666666;
									font-size: 18px;
								}
								input {
									width: 100%;
									height: 100%;
									border: none;
									border-radius: 10px;
									background: transparent;
									outline: none;
									padding: 15px;
									font-size: 20px;
								}
							}
							.smallInput:focus-within {
								border-color: black;
								label {
									color: black;
								}
							}
						}
					}
				}
			}
			.orderSummary {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
				width: 100%;
				gap: 20px;
				.productSide {
					height: 100%;
					overflow-y: auto;
					.product {
						width: 100%;
						height: 80px;
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						padding: 10px;
						border-radius: 7px;
						background-color: white;
						gap: 10px;
						margin-bottom: 10px;
						.imageTextWrapper {
							height: 100%;
							width: 100%;
							display: flex;
							gap: 15px;
							img {
								height: 100%;
								aspect-ratio: 1/1;
								object-fit: cover;
								filter: brightness(0.8);
								border-radius: 4px;
							}
							div {
								height: 100%;
								width: 100%;
								display: flex;
								flex-direction: column;
								align-content: flex-start;
								justify-content: space-evenly;
								h3 {
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 1; /* number of lines to show */
									line-clamp: 1;
									-webkit-box-orient: vertical;
									font-size: 20px;
									font-weight: 400;
								}
								div{
									height: 30px;
									width: 100%;
									display: flex;
									align-items: center;
									justify-content: space-between;
									flex-direction: row;
									background:transparent;
								}
								p {
									font-weight: 600;
									margin-block: 0;
								}
							}
						}
					}
				}
				.summarySide {
					height: 100%;
					display: flex;
					flex-direction: column;
					gap: 20px;
					.regularInput {
						border: solid #666666 2px;
						width: 100%;
						height: 70px;
						border-radius: 10px;
						position: relative;
						display: flex;
						label {
							position: absolute;
							top: 0;
							left: 10px;
							transform: translateY(-50%);
							background-color: $Secondary;
							padding: 0 5px;
							color: #666666;
							font-size: 18px;
						}
						input {
							width: 100%;
							height: 100%;
							border: none;
							border-radius: 10px;
							background: transparent;
							outline: none;
							padding: 15px;
							font-size: 20px;
						}
						button {
							border: none;
							background: transparent;
							color: $Primary;
							font-size: 20px;
							margin-right: 15px;
						}
					}
					div:focus-within {
						border-color: black;
						label {
							color: black;
						}
					}
					.totals {
						display: flex;
						flex-direction: column;
						justify-content: space-evenly;
						width: 100%;
						gap: 20px;
						div {
							display: flex;
							align-items: center;
							justify-content: space-between;
							h3 {
								font-weight: 400;
							}
						}
						.discount {
							color: $Primary;
						}
						.total {
							h3 {
								font-weight: 500;
								font-size: 24px;
							}
						}
					}
					button {
						background-color: $Primary;
						color: white;
						border: none;
						border-radius: 7px;
						height: 70px;
						font-size: 24px;
						transition: all 200ms;
					}
					button:hover {
						filter: brightness(1.2);
						cursor: pointer;
					}
				}
			}
		}
	}
}
.orderPlaced{
	opacity: 0;
}
@media screen and (max-width: 750px) {
	.checkout {
		nav {
			display: none;
		}
		.checkoutContainer{
			gap: 0;
			.subNav{
				margin-block: 40px;
				img{
					display: block;
				}
				img:hover{
					cursor: pointer;
				}
				h1{
					font-size: 32px;
				}
			}
		}
	}
}
</style>
