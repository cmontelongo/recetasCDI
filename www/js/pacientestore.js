angular.module('miscitas.pacientestore', [])
	.factory('PacienteStore', function($http) {

		var apiUrl = 'http://192.168.0.120:8081';

	  return {

	    list: function() {
	      return $http.get(apiUrl + '/pacientes/').then(function(response) {
	      	return response.data;
	      });
	    },

	    get: function(pacienteId) {
	      return $http.get(apiUrl + '/pacientes/' + pacienteId)
		      .then(function(response) {
		      	return response.data;
		      });
	    },

	    create: function(paciente) {
	    	return $http.post(apiUrl + '/pacientes/', paciente);
	    },

	    update: function(paciente) {
	    	return $http.put(apiUrl + '/pacientes/' + paciente.id, paciente);
	    },

	    remove: function(pacienteId) {
	    	return $http.delete(apiUrl + '/pacientes/' + pacienteId);
	    }

	  };

	});