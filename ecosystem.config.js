module.exports = {
	apps: {
		script: `dist/main.js`,
		// Specify which folder to watch
		watch: [`src`],
		// Specify delay between watch interval
		watch_delay: 1000,
	},
};
