'use strict';
angular.module("myApp", ["ngRoute","ngCookies"])
    .config( function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl : "view/login.html"
            })
            .when("/projects", {
                templateUrl : "view/main.html"
            })
            .when("/projects/info", {
                templateUrl : "view/project-info.html"
            })
            .when("/projects/new", {
                templateUrl : "view/new-project.html"
            });
    });

// gmail m.zhitkov.vote@gmail.com 1qA2wS3eD
//github mzhitkov-vote 1qA2wS3eD!@#