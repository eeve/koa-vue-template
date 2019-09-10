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

<style src='./styles/app.css'>
</style>


