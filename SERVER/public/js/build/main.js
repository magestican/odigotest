(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

////////////////////////////////////////////////////////////
// App
////////////////////////////////////////////////////////////

var App = angular.module('odigoapp', ['ngRoute', 'ngResource', 'Directives', 'Controllers', 'Factories', 'Filters', 'Services']);

////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////
//inject name of controller inside every controller
var global = {};


App.run(function ($rootScope) {
    //if scope is not available
    $rootScope.model = {};
    $rootScope.global = global;
});


App.config(['$routeProvider', '$httpProvider', function ($routeProvider, provider) {


    //ruby stuff
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');


    //no need to use routes for this project
    /*
    $routeProvider.when('/', {
        controller: 'MainController'
    });*/
}]);
},{}],2:[function(require,module,exports){
angular.module('Controllers', []);

require('./controllers/main.js');
require('./controllers/question.js');
},{"./controllers/main.js":3,"./controllers/question.js":4}],3:[function(require,module,exports){
angular.module('Controllers')
    .controller('MainController', ['$scope', '$filter',
    function ($scope, $filter) {

        $scope.global.questions = [];


    }]);
},{}],4:[function(require,module,exports){
angular.module('Controllers')
    .controller('QuestionController', ['$scope', '$filter', 'QuestionFactory',
    function ($scope, $filter, QuestionFactory) {


        $scope.addQuestion = function () {

            try {
                var result = new QuestionFactory.newQuestion(model.title,
                                            model.body,
                                            model.username,
                                            model.rating,
                                            model.datetime,
                                            model.categories,
                                            model.userPicture);

                QuestionFactory.addQuestion(result);
            }
            catch (exception) {
                console.log("an exception ocurred");
                console.log(exception);
            }
        }

        $scope.addDummyQuestion = function () {
            try {
                var result = new QuestionFactory.newQuestion("this is title", "this is body", "magestico", 5, new Date().toDateString(), ["category1", "category2"]);
                $scope.global.questions.push(result);

            }
            catch (exception) {
                console.log("an exception ocurred");
                console.log(exception);
            }
        }



        $scope.addDummyQuestion();

    }]);
},{}],5:[function(require,module,exports){
angular.module('Directives', []);

require('./directives/answer.js');
require('./directives/errormanager.js');
require('./directives/newquestion.js');
require('./directives/question.js');
require('./directives/applicationManager.js');
require('./directives/login.js');


},{"./directives/answer.js":6,"./directives/applicationManager.js":7,"./directives/errormanager.js":8,"./directives/login.js":9,"./directives/newquestion.js":10,"./directives/question.js":11}],6:[function(require,module,exports){
angular.module('Directives')
    .directive('answer', ['$filter', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'answer.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                scope.dummy = function ()
				{
				}

            }
        };
    }]);
},{}],7:[function(require,module,exports){
angular.module('Directives')
    .directive('applicationManager', ['$filter', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/application-manager.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {
                //this is a dummy directive

            }
        };
    }]);
},{}],8:[function(require,module,exports){
angular.module('Directives')
    .directive('errorManager', ['$filter', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/error.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                scope.model.errorMessage = "";
                scope.model.showerror = false;

                scope.global.errorOcurred = function (Description) {
                    if (Description != undefined) {
                        scope.model.errorMessage = Description;
                        scope.model.showerror = true;
                    }

                    throw new RegExp(Description);
                }

                scope.global.removeError = function () {
                    scope.model.showerror = false;
                    scope.model.errorMessage = "";

                }
            }
        };
    }]);

},{}],9:[function(require,module,exports){
angular.module('Directives')
    .directive('login', ['$filter', 'LoginFactory', 'UserService', 'DatabaseFactory', function ($filter, LoginFactory, UserService, DatabaseFactory) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/login.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                scope.dummy = function () {
                }


                scope.login = function () {

                    //login parameters
                    var myParams = {
                        'clientid': '28552151452-v86ec9nn8jm6r4de5sghds4bmq4n1ccb.apps.googleusercontent.com',
                        'cookiepolicy': 'single_host_origin',
                        'callback': 'loginCallback',
                        'approvalprompt': 'force',
                        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
                    };
                    gapi.auth.signIn(myParams);
                }

                window.loginCallback = function (result) {
                    if (result['status']['signed_in']) {

                        console.log("login success");

                        //if success get user data
                        debugger

                        var login = new LoginFactory();
                        login.login({ token: result.access_token }, function (data) {
                            console.log("login server result");
                            console.log(data);



                        }, function (error) {
                            console.log("error ocurred");
                            console.log(error);

                        });

                        //var request = gapi.client.plus.people.get(
                        //{
                        //    'userId': 'me'
                        //});
                        //request.execute(function (resp) {
                        //    var email = '';
                        //    if (resp['emails']) {
                        //        for (i = 0; i < resp['emails'].length; i++) {
                        //            if (resp['emails'][i]['type'] == 'account') {
                        //                email = resp['emails'][i]['value'];
                        //            }
                        //        }
                        //    }

                        //    var str = "Name:" + resp['displayName'] + "<br>";
                        //    str += "Image:" + resp['image']['url'] + "<br>";
                        //    str += "<img src='" + resp['image']['url'] + "' /><br>";

                        //    str += "URL:" + resp['url'] + "<br>";
                        //    str += "Email:" + email + "<br>";
                        //    document.getElementById("profile").innerHTML = str;
                        //});

                    }
                }




            }
        };
    }]);
},{}],10:[function(require,module,exports){
angular.module('Directives')
    .directive('newQuestion', ['$filter', 'QuestionFactory', function ($filter, QuestionFactory) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/new-question.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                var model = scope.model;




            }
        };
    }]);
},{}],11:[function(require,module,exports){
angular.module('Directives')
    .directive('question', ['$filter', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/question.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                scope.model = {};
                scope.model.question = scope.question;
            }
        };
    }]);
},{}],12:[function(require,module,exports){
angular.module('Factories', []);

require('./factories/questionFactory.js');
require('./factories/loginFactory.js');
require('./factories/databaseFactory.js');

},{"./factories/databaseFactory.js":13,"./factories/loginFactory.js":14,"./factories/questionFactory.js":15}],13:[function(require,module,exports){
angular.module('Factories')

    .factory('DatabaseFactory', ['$rootScope', '$q', '$resource', function ($rootScope, $q, $resource) {


        return {

            update: function (Title, Body, Rating, Datetime, Categories) {

                var update = $resource('/main/update_database/:token', {}, {
                    'getDatabase': { method: 'POST' },
                });

                return update;
            },

            get: function () {

                var get = $resource('/main/get_database', {}, {
                    'getDatabase': { method: 'GET' },
                });

                return get;

            }


        };

    }])

},{}],14:[function(require,module,exports){
angular.module('Factories')
    .factory('LoginFactory', ['$rootScope', '$q', '$resource', function ($rootScope, $q, $resource) {

        return {

            login: function () {

                var login = $resource('/main/login/:token', {}, {
                    'login': { method: 'POST' },
                });

                return login;
            }


        };
    }])

},{}],15:[function(require,module,exports){
angular.module('Factories')

    .factory('QuestionFactory', ['$rootScope', '$q', function ($rootScope, $q) {
        return {

            newQuestion: function (Title, Body, Username, Rating, Datetime, Categories, UserPicture) {

                function question(Title, Body, Username, Rating, Datetime, Categories, UserPicture) {

                    this.title = Title || $rootScope.global.errorOcurred("The title cannot be empty");
                    this.body = Body || $rootScope.global.errorOcurred("The body canot be empty");
                    this.username = Username;
                    this.rating = Rating || 0;
                    this.datetime = Datetime || new Date().toDateString();
                    this.categories = Categories || $rootScope.global.errorOcurred("You must input at least one category");
                    this.userpicture = UserPicture || "images/profile-placeholder.jpg";
                }

                return new question(Title, Body, Username, Rating, Datetime, Categories, UserPicture);
            }


        };
    }])

},{}],16:[function(require,module,exports){
angular.module('Filters', []);

},{}],17:[function(require,module,exports){

require('./app.js');

require('./controllers.js');
require('./services.js');
require('./directives.js');
require('./factories.js');
require('./filters.js');


require('../../templates/compiledhtml.js')
},{"../../templates/compiledhtml.js":20,"./app.js":1,"./controllers.js":2,"./directives.js":5,"./factories.js":12,"./filters.js":16,"./services.js":18}],18:[function(require,module,exports){
angular.module('Services', []);

require('./services/user.js');
},{"./services/user.js":19}],19:[function(require,module,exports){
angular.module('Services')
    .factory('UserService', ['$rootScope', '$q', '$resource', function ($rootScope, $q, $resource) {

        var userService = function () {

            function user(Username, Picture, Token, Email) {
                this.username = Username;
                this.picture = Picture;
                this.token = Token;
                this.email = Email;
            }


            this.currentUser;
            var that = this;
            this.newUser = function (Username, Picture, Token, Email) {
                if (that.currentUser == null) {
                    return new user(Username, Picture, Token, Email);
                }
                else {
                    throw new RegExp("There can only be one user logged in, you are trying to log a second user that is wrong");
                }
            }
        }


        return userService;

    }])

},{}],20:[function(require,module,exports){
angular.module('odigoapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/directives/answer.html',
    "<div ng-show=\"showerror\" class=\"ui error form segment\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"teal ui button\">B</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/application-manager.html',
    "\r" +
    "\n" +
    "<div ng-controller=\"MainController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <login></login>\r" +
    "\n" +
    "    <error:manager></error:manager>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <new:question></new:question>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"ui center aligned segment\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"ui horizontal divider\">Top question of the community</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <question ng-repeat=\"question in global.questions | orderBy:rating | limitTo: 1\"></question>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"ui horizontal divider\">Other questions by the community</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <question ng-repeat=\"question in  global.questions\"></question>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <reply></reply>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/error.html',
    "<div ng-show=\"model.showerror\" class=\"ui error form segment\">\r" +
    "\n" +
    "    <div class=\"ui error message\">\r" +
    "\n" +
    "        <div class=\"header\">{{model.errorMessage}}</div>\r" +
    "\n" +
    "        <p>Error message long description</p>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/login.html',
    "<div>\r" +
    "\n" +
    " \r" +
    "\n" +
    "    <div ng-click=\"login()\" class=\"ui google plus button\">\r" +
    "\n" +
    "        <i class=\"google plus icon\"></i>\r" +
    "\n" +
    "        Login with google plus\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/new-question.html',
    "<div ng-controller=\"QuestionController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/directives/question.html',
    "<div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"header\">\r" +
    "\n" +
    "        <img ng-src=\"{{model.question.userpicture}}\" class=\"ui avatar image\">\r" +
    "\n" +
    "        {{model.question.title}}\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"description\">\r" +
    "\n" +
    "        {{model.question.body}}\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );

}]);

},{}]},{},[17]);
