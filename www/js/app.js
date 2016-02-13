(function() {

var app = angular.module('miscitas', ['ionic', 'miscitas.user', 'miscitas.citastore', 'miscitas.citastore', 'miscitas.pacientestore'])

//---------------------------------------------------------------------
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

//---------------------------------------------------------------------
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

//---------------------------------------------------------------------
app.controller('ListCtrl', function($scope, $ionicHistory, $state, CitaStore, User) {

  function refreshCitas() {
   CitaStore.list().then(function(citas) {
      $scope.citas = citas;
    });
  }
  refreshCitas();

  $scope.remove = function(citaId) {
    CitaStore.remove(citaId).then(refreshCitas);
  };

    $scope.logout = function() {
        User.logout();
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('login');
    };

});

//---------------------------------------------------------------------
app.controller('EditCtrl', function($filter, $scope, $state, CitaStore, PacienteStore) {

    PacienteStore.list()
        .then(function(pacientes){
            $scope.pacientes = pacientes;
    });

    var refreshData = function() {
        CitaStore.get($state.params.citaId)
            .then (function(data) {
                $scope.cita = data;
                $scope.fecha = $filter('date')($scope.cita.fecha_cita, "dd/MM/yyyy HH:mm");
                $scope.disabled = "input-disabled";
                PacienteStore.get(data.pacienteId)
                    .then(function(paciente){
                        $scope.cita.paciente = paciente;
                    });
            });
    }

    refreshData();
    
    var onSuccess = function(date) {
            $scope.fecha = $filter('date')(date, "dd/MM/yyyy HH:mm");
        };
    var onError = function (error) { // Android only
            alert('Error: ' + error);
        };
    $scope.showDate = function() {
        var fechas = $scope.cita.fecha_cita.split(' ');
        var dias = fechas[0].split("/");
        var horas = fechas[1].split(":");
        var fecha = new Date(dias[2],dias[1]-1,dias[0], horas[0],horas[1]);
        var options = {
          date: fecha, //new Date(),
          mode: 'datetime',
          minuteInterval: 15,
          is24Hour: true
        };

        datePicker.show(options, onSuccess, onError);
    }

    $scope.save = function() {
        $scope.cita.fecha_cita = $scope.fecha;
        $scope.cita.pacienteId = $scope.cita.paciente.id;
        CitaStore.update($scope.cita)
        .then(function(){
          $state.go('list');
        });
    };

});

//---------------------------------------------------------------------
app.controller('AddCtrl', function($scope, $state, $filter, CitaStore, PacienteStore) {
    PacienteStore.list()
        .then(function(pacientes){
            $scope.pacientes = pacientes;
    });

    $scope.cita = {
        id: new Date().getTime().toString(),
        title: '',
        fecha_cita: new Date(),
        description: ''
    };

    var onSuccess = function(date) {
          $scope.fecha = $filter('date')(date, "dd/MM/yyyy HH:mm");
        };
    var onError = function (error) { // Android only
          alert('Error: ' + error);
        };
    $scope.showDate = function() {
        var fecha = $scope.fecha_cita || new Date();
        var options = {
          date: fecha,
          mode: 'datetime',
          minuteInterval: 15,
          is24Hour: true
        };

        datePicker.show(options, onSuccess, onError);
    }

    $scope.save = function() {
        $scope.cita.fecha_cita = $scope.fecha;
        $scope.cita.pacienteId = $scope.cita.paciente.id;
        CitaStore.create($scope.cita);
        $state.go('list');
    };

});

//---------------------------------------------------------------------
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