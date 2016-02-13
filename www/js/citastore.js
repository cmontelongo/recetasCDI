angular.module('miscitas.citastore', [])
	.factory('CitaStore', function($http) {

		var apiUrl = 'http://192.168.0.120:8081';

	  return {

	    list: function() {
	      return $http.get(apiUrl + '/cita/').then(function(response) {
	      	return response.data;
	      });
	    },

	    get: function(citaId) {
	      return $http.get(apiUrl + '/cita/' + citaId)
		      .then(function(response) {
		      	return response.data;
		      });
	    },

	    create: function(cita) {
	    	return $http.post(apiUrl + '/cita/', cita);
	    },

	    update: function(cita) {
	    	return $http.put(apiUrl + '/cita/' + cita.id, cita);
	    },

	    remove: function(citaId) {
	    	return $http.delete(apiUrl + '/cita/' + citaId);
	    }

	  };

	});