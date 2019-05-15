'use strict';
angular.module('myApp')
    .controller('voteCtrl', function ($scope, $rootScope, $cookies, $window) {
        $rootScope.currentUser = getCollection('currentUser');
        $rootScope.currentProject = getCollection('currentProject');
        $rootScope.projects = getCollection('projects');

        $rootScope.categories = ["житлово-комунальні", "освіта", "культура", "спорт"];
        var project = {
            user: {},
            name: "",
            description: "",
            shortDescription: "",
            createdAt: "",
            voteUsers: [],
            category: ""
        };

        $scope.createProject = function (project) {
            project.user = $rootScope.currentUser;
            project.createdAt = (new Date()).toLocaleString('en-US', {hour12: false});
            $scope.addToCollection(project, "projects");
           $rootScope.projects= getCollection('currentProject');
            alert("Проект подано. Ви його можете побачити у списку всіх проектів.");
            window.location.hash = "#/projects"
        };

        $scope.showProject = function (project) {
            $rootScope.currentProject = project;
            $cookies.putObject("currentProject", $rootScope.currentProject);
            window.location.hash = "#/projects/info"
        };

        $rootScope.isLogined = function () {
            return !!$rootScope.currentUser;
        };

        $scope.login = function (loginUser) {
            var users = $cookies.getObject('users');
            if (!users) {
                users = [];
            }
            ;
            var user = $scope.findUserByName(users, loginUser.email);
            if (user && loginUser.password == user.password) {
                $cookies.putObject('currentUser', user);
                $rootScope.currentUser = user;
                $scope.loginError = 0;
                window.location.hash = "#/projects"
            } else {
                $scope.loginError = "User don't found or password is incorrect :(";
            }
        };

        $scope.logout = function () {
            $cookies.remove('currentUser');
            $rootScope.currentUser = null;
            window.location.hash = "#/"
        };

        $scope.register = function (user) {
            var users = $cookies.getObject('users');
            if (!users) {
                users = [];
            }
            ;
            users.push(user);
            $cookies.putObject('users', users);
            $scope.login(user);
        };

        $scope.findUserByName = function (users, email) {
            var user;
            users.forEach(function (item, index) {
                if (item.email == email) {
                    user = item;
                }
            });
            return user;
        };

        $scope.saveUser = function (user) {
            var users = $cookies.getObject('users');
            if (!users) {
                users = [];
            }
            ;

            var oldUser = $scope.findUserByName(users, $rootScope.currentUser.email);
            var i = users.indexOf(oldUser);
            if (i !== -1) {
                users.splice(i, 1);
            }
            users.push(user);
            $cookies.putObject('users', users);
            $cookies.putObject('currentUser', user);
            $rootScope.currentUser = user;
            $scope.isInfoSaved = true;
        };

        $scope.addToCollection = function (object, collectionName) {
            var objects = getCollection(collectionName);

            objects.push(object);
            // $window.localStorage.setItem(collectionName,objects);
            $cookies.putObject(collectionName, objects);
        };

        function getCollection(collectionName) {
            // var objects = $window.localStorage.getItem(collectionName);
            var objects = $cookies.getObject(collectionName);
            if (!objects) {
                objects = [];
            }
            ;
            return objects;
        };

    })
;
