<template>
    <div class="container">
        <div class="header">
            <router-link to="/">
			<h1>Sensor Data Visualizer</h1>
			</router-link>
        </div>
        
        <div class="main_view">
            <router-view />
        </div>
        
        <div class="footer">
            <ul><li></li></ul>
        </div>
    </div>
</template>

<style>

html, body {
	margin:0;
	padding: 0;
}

body {
	font-family: inconsolata, monospace;
	font-weight: bold;
	text-shadow: 0.142em 0.142em 0.1em #000;
	background-color:#333;
	color: #EEE;
}

a:link,a:visited {
	color:#fff;
	text-decoration:none;
}

.container {
	margin:auto;
	margin-top: 10vh;
	position: relative;
}

.header {
	position: absolute;
	top: 1em;
    width: 100%;
	margin: auto;
	z-index: 1;
}

.header h1 {
    position: absolute;
	margin-left: 1em;
	bottom: 0.5em;
	font-size: 1.5em;
	border-color:#BBB;
	border-style:solid;
	border-width: 0 0 0.15em 0;
}

.main_view {
    display: grid;
    grid-template-columns: 1fr 0.25fr;
    grid-gap: 0;
}

.footer {
	position: relative;
}

.footer ul {
	color:#FFF;
	list-style-type:none;
	position:absolute;
	text-align:right;
	right:2em;
}

</style>
