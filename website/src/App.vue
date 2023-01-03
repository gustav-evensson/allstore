<template>
	<div class="viewPort">
		<router-view />
	</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700&display=swap');

$Primary: #fc6020;
$Secondary: #ededed;

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background-color: $Secondary;
}

* {
	font-family: 'Inter', sans-serif;
	// font-family: 'Poppins', sans-serif;
}

#app {
	.viewPort {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
