angular.module('miscitas.user', [])
	.factory('User', function($http, $ionicPopup) {

		var apiUrl = 'http://192.168.0.120:8081';

		var loggedIn = false;

		return {

			login: function(credentials) {
				return $http.post(apiUrl + '/authenticate', credentials)
					.then(function(response) {
						var token = response.data.token;
						$http.defaults.headers.common.Authorization = 'Bearer ' + token;
						loggedIn = true;
					})
                    .catch(function(error){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Información inválida',
                            template: 'Favor de validar que el Usuario y Contraseña sean correctos.'
                        });
                    });
			},
            logout: function() {
                loggedIn = false;
            },

			isLoggedIn: function() {
				return loggedIn;
			}

		};
	});