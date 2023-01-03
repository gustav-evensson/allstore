<template>
	<div class="productView">
        <nav>
            <img @click="router.push('/')" class="backArrow" src="../assets/ArrowLeft.png" alt="back arrow">
        </nav>
        <div class="productContainer" v-if="data.product">
            <img :src="data.product.images[0]" alt="product image">
            <div class="contentContainer">
                <h2>{{ data.product.title }}</h2>
                <h3>{{ data.product.description }}</h3>
                <h1>${{ data.product.price }}</h1>
                <button class="remButton" @click="store.commit('remove', data.product)" v-if="store.state.inCart.filter((item) => item.id == data.product.id).length > 0">Remove</button>
				<button class="addButton" @click="addToCart(data.product)" v-else>Add to cart</button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
	setup() {

        const route = useRoute();
        const store = useStore();

		const data = reactive({
			product: null,
		});

        function addToCart(product) {
			product.amount = 1;
			store.commit('addItem', product);
		}

        watch(
			() => route.params.id,
			(newID) => {
				fetch(`https://dummyjson.com/products/${newID}`)
					.then((res) => res.json())
					.then((json) => {
						data.product = null;
						data.product = json;
					});
			}
		);

		onMounted(() => {
			fetch(`https://dummyjson.com/products/${route.params.id}`)
				.then((res) => res.json())
				.then((json) => {
					data.product = json;
				})
				.catch((err) => console.log(err));
		});

		return {
            data,
            store,
            addToCart,
            router: useRouter()
        };
	},
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700&display=swap');
$Primary: #fc6020;
$Secondary: #ededed;

.productView{
    width: 80%;
	max-width: 1920px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .backArrow{
        height: 48px;
        width: 48px;
        transition: all 300ms;
        position: absolute;
        top: 50px;
        left: 0;
        transform: translateY(-100%);
        opacity: 0;
        animation: slide 600ms ease-in-out forwards;
    }
    .backArrow:hover{
        cursor: pointer;
        transform: scale(1.1);
    }
    .productContainer{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        transform: translateY(50%);
        opacity: 0;
        animation: slide 600ms ease-out forwards;
        img{
            width: 100%;
            max-width: 600px;
            aspect-ratio: 1/1;
            object-fit: cover;
            place-self: end end;
            border-radius: 12px;
        }
        .contentContainer{
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
            gap: 20px;
            font-family: 'Poppins', sans-serif;
            h1{
                font-size: 48px;
                font-weight: 500;
                font-family: inherit;
            }
            h2{
                font-size: 36px;
                font-family: inherit;
                font-weight: 400;
            }
            h3{
                font-size: 24px;
                font-weight: 300;
            }
            button{
                width: 100%;
                min-width: 400px;
                height: 75px;
                border-radius: 12px;
                transition: all 300ms;
                font-size: 24px;
            }
            .addButton{
                border: none;
                background-color: $Primary;
                color: white;
            }
            .addButton:hover{
                cursor: pointer;
                filter: brightness(1.2);
            }
            .remButton{
                border: solid 2px $Primary;
                color: $Primary;
            }
            .remButton:hover{
                cursor: pointer;
                background-color: #fc602010;
            }
        }
    }
    @keyframes slide {
        to{
            transform: translateY(0);
            opacity: 1;
        }
    }
}
@media screen and (max-width: 1030px) {
    .productView{
        height: unset;
        .productContainer{
            margin-block: 150px;
            grid-template-columns: 1fr;
            grid-auto-rows: 1fr auto;
            img{
                place-self: center;
                max-width: unset;
            }
            .contentContainer{
                width: 100%;
                button{
                    min-width: unset;
                }
            }
        }
    }
    
}
</style>
