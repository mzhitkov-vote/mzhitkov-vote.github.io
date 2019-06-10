'use strict';
angular.module('myApp')
    .controller('voteCtrl', function ($scope, $rootScope, $cookies, $window) {
        $rootScope.currentUser = getObject('currentUser');
        $rootScope.currentProject = getObject('currentProject');
        $rootScope.projects = getCollection('projects');

        $rootScope.categories = ["житлово-комунальні", "освіта", "культура", "спорт"];
        var project = {
            id: 0,
            user: {},
            name: "",
            description: "",
            shortDescription: "",
            createdAt: "",
            voteUsers: [],
            category: ""
        };

        $scope.createProject = function (project) {
            project.id = id();
            project.user = $rootScope.currentUser;
            project.voteUsers = [];
            project.createdAt = (new Date()).toLocaleString('en-US', {hour12: false});
            project.fromDate = project.fromDate.toLocaleString('en-US', {hour12: false});
            project.toDate = project.toDate.toLocaleString('en-US', {hour12: false});
            addToCollection(project, "projects");
            $rootScope.projects = getCollection('projects');
            alert("Проект подано. Ви його можете побачити у списку всіх проектів.");
            window.location.hash = "#/projects"
        };

        $scope.filterProject = function (category) {
            if (!category)
                $rootScope.projects = getCollection('projects');
            else
                $rootScope.projects = getCollection('projects').filter(function (element) {
                    return element.category == category;
                })
        };

        $scope.removeVote = function (project) {
            removeFromArr(project.voteUsers, $rootScope.currentUser.id);
            updateElementInCollection(project, "projects");

            removeFromArr($rootScope.currentUser.voteProjects, project.id);
            updateElementInCollection($rootScope.currentUser, "users");
            addObject($rootScope.currentUser, 'currentUser');
        };

        $scope.vote = function (project) {
            if ($scope.isUserVoted(project) || $scope.isVoteRestricted()) return;

            project.voteUsers.push($rootScope.currentUser.id);
            updateElementInCollection(project, "projects");

            $rootScope.currentUser.voteProjects.push(project.id);
            updateElementInCollection($rootScope.currentUser, "users");
            addObject($rootScope.currentUser, 'currentUser');
        };


        $scope.isVoteRestricted = function () {
            return $rootScope.currentUser.voteProjects.length >= 3;
        };

        $scope.isVoted = function (project) {
            return $rootScope.currentUser.voteProjects.filter(function (element) {
                    return element == project.id;
                }).length > 0;
        };

        $scope.isUserVoted = function (project) {
            return project.voteUsers.filter(function (element, index, array) {
                    return element == $rootScope.currentUser.id;
                }).length > 0;
        };

        $scope.showProject = function (project) {
            $rootScope.currentProject = project;
            addObject($rootScope.currentProject, "currentProject");
            window.location.hash = "#/projects/info"
        };

        $rootScope.isLogined = function () {
            return !!$rootScope.currentUser;
        };

        $scope.login = function (loginUser) {
            var users = getCollection('users');

            var user = $scope.findUserByName(users, loginUser.email);
            if (user && loginUser.password == user.password) {
                addObject(user, 'currentUser');
                $rootScope.currentUser = user;
                $scope.loginError = 0;
                window.location.hash = "#/projects"
            } else {
                $scope.loginError = "User don't found or password is incorrect :(";
            }
        };

        $scope.logout = function () {
            dropCollection('currentUser');
            $rootScope.currentUser = null;
            window.location.hash = "#/"
        };

        $scope.register = function (user) {
            user.id = id();
            user.voteProjects = [];
            addToCollection(user, 'users');
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

        function addObject(object, collectionName) {
            dropCollection(collectionName);
            $window.localStorage.setItem(collectionName, JSON.stringify(object));
        };

        function addToCollection(object, collectionName) {
            var objects = getCollection(collectionName);
            objects.push(object);
            dropCollection(collectionName);
            $window.localStorage.setItem(collectionName, JSON.stringify(objects));
        };

        function updateElementInCollection(object, collectionName) {
            var objects = getCollection(collectionName);
            var newObjects = objects.map(function (element) {
                if (element.id == object.id) {
                    element = object;
                }
                return element
            });
            addObject(newObjects, collectionName);
        }

        function dropCollection(collectionName) {
            $window.localStorage.removeItem(collectionName);
        }

        function getObject(collectionName) {
            return getCollection(collectionName, true);
        }

        function getCollection(collectionName, isSingleObject) {
            var objects = $window.localStorage.getItem(collectionName);
            // var objects = $cookies.getObject(collectionName);
            if (!objects || objects == null) {
                objects = isSingleObject ? null : [];
            } else {
                objects = JSON.parse(objects);
            }

            return objects;
        }

        function id() {
            return new Date().getUTCMilliseconds();
        }

        function removeFromArr(arr, element) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === element) {
                    arr.splice(i, 1);
                }
            }
        }
    })
;