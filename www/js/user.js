angular.module('miscitas.user', [])
	.factory('User', function($http) {

		var apiUrl = 'http://192.168.0.120:8081';

		var loggedIn = false;

		return {

			login: function(credentials) {
				return $http.post(apiUrl + '/authenticate', credentials)
					.then(function(response) {
						var token = response.data.token;
						$http.defaults.headers.common.Authorization = 'Bearer ' + token;
						loggedIn = true;
					});
			},

			isLoggedIn: function() {
				return loggedIn;
			}

		};
	});