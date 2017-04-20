requirejs.config({
	baseUrl: '/',
	paths: {
		moment: "resources/javascript/lib/moment.min",
		jquery: "resources/javascript/lib/jquery.min",
		flatpickr: "resources/javascript/lib/flatpickr.min"
	}
});

requirejs(['resources/javascript/app.js']);