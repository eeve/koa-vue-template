<template>
	<div id="app">
		<div class="header">
			<div class="nav">
        <router-link to="/" exact>
					<img class="logo" src="logo.png" alt="logo">
        </router-link>
        <router-link to="/index">Home</router-link>
      </div>
		</div>
		<transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
	</div>
</template>

<style class="less">
	.logo {
		width: 24px;
		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;
	}
	.fade-enter-active, .fade-leave-active {
		transition: all .2s ease;
	}
	.fade-enter, .fade-leave-active {
		opacity: 0;
	}
</style>


