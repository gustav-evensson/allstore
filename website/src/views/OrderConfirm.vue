<template>
	<div class="orderConfirm">
		<div class="thankYouContainer">
			<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle class="circle" cx="64" cy="64" r="62" stroke="#FC6020" stroke-width="4" />
				<path class="path" d="M85.1562 50.4375L57.5938 77.5625L43.8125 64" stroke="#FC6020" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<h1>Thanks for your order!</h1>
			<router-link to="/" class="continueShopping">Continue shopping</router-link>
		</div>
	</div>
</template>

<script>
import { reactive } from 'vue';

export default {
	setup() {
		const data = reactive({
			fillCircle: false,
		});

		return {
			data,
		};
	},
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700&display=swap');
$Primary: #fc6020;
$Secondary: #ededed;
.orderConfirm {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
    padding: 50px;
	.thankYouContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 37px;
		flex-direction: column;
		svg {
			transform: rotate(-360deg);
			animation: rotate 1.5s linear forwards;
			.circle {
				stroke-dasharray: 1000;
				stroke-dashoffset: 1000;
				animation: dash 3s linear forwards;
			}
			.path {
				stroke-dasharray: 500;
				stroke-dashoffset: 500;
				animation: dash 2s linear forwards;
				animation-delay: 1.5s;
			}
			@keyframes dash {
				to {
					stroke-dashoffset: 0;
				}
			}
		}
		h1 {
			font-family: 'Poppins', sans-serif;
			transform: translateY(50px);
			opacity: 0;
			animation: slide 500ms ease-out forwards;
			animation-delay: 2s;
            text-align: center;
		}
		.continueShopping {
			color: white;
			border: none;
            text-decoration: none;
			padding: 15px 30px;
			background-color: black;
			border-radius: 12px;
			transform: translateY(50px);
			opacity: 0;
			transition: all 300ms;
			animation: slide 500ms ease-out forwards;
			animation-delay: 2.3s;
            font-size: 20px;
		}
        .continueShopping:hover{
            cursor: pointer;
        }
		@keyframes rotate {
			to {
				transform: rotate(0deg);
			}
		}
		@keyframes slide {
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
}
</style>
