(function() {

var app = angular.module('miscitas', ['ionic', 'miscitas.user', 'miscitas.citastore', 'miscitas.citastore', 'miscitas.pacientestore'])

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('list', {
        url: '/',
        templateUrl: 'templates/list.html'
    });

    $stateProvider.state('edit', {
        url: '/edit/:citaId',
        templateUrl: 'templates/edit.html',
        controller: 'EditCtrl'
    });

    $stateProvider.state('add', {
        url: '/add',
        templateUrl: 'templates/edit.html',
        controller: 'AddCtrl'
    });

    $urlRouterProvider.otherwise('/');

});

app.controller('LoginCtrl', function($scope, $state, $ionicHistory, User) {

  $scope.credentials = {
    user: '',
    password: ''
  };

  $scope.login = function() {
    User.login($scope.credentials)
      .then(function() {
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('list');
      });
  };

});

app.controller('ListCtrl', function($scope, CitaStore) {

  function refreshCitas() {
   CitaStore.list().then(function(citas) {
      $scope.citas = citas;
    });
  }
  refreshCitas();

  $scope.remove = function(citaId) {
    CitaStore.remove(citaId).then(refreshCitas);
  };

});

app.controller('EditCtrl', function($filter, $scope, $state, CitaStore, PacienteStore) {

    function refreshData() {
      CitaStore.get($state.params.citaId)
      .then (function(data) {
        $scope.cita = data;
        $scope.fecha = $scope.cita.fecha_cita;
      });
    }

    refreshData();
    
        function onSuccess(date) {
          var fecha = $filter('date')(date, "dd/MM/yyyy HH:m");
          $scope.fecha = fecha;
        }

        function onError(error) { // Android only
          alert('Error: ' + error);
        }
    $scope.showDate = function() {
        var options = {
          date: new Date(),
          mode: 'datetime',
          minuteInterval: 15,
          is24Hour: true,
          locale: 'es_mx'
        };

        datePicker.show(options, onSuccess, onError);
    }

    $scope.save = function() {
        //$scope.cita.fecha_cita = $scope.fecha;
        CitaStore.update($scope.cita)
        .then(function(){
          $state.go('list');
        });
    };

});

app.controller('AddCtrl', function($scope, $state, CitaStore) {

    $scope.cita = {
        id: new Date().getTime().toString(),
        title: '',
        description: ''
    };

    $scope.save = function() {
        CitaStore.create($scope.cita);
        $state.go('list');
    };

});

app.run(function($rootScope, $state, $ionicPlatform, User) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {

    if (!User.isLoggedIn() && toState.name !== 'login') {
      event.preventDefault();
      $state.go('login');
    }

  });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());