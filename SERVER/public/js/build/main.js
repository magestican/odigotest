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
    .controller('MainController', ['$scope', '$filter', 'UserService',
    function ($scope, $filter, UserService) {

        $scope.global.questions = [];
        $scope.model.userService = UserService;

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
require('./directives/errorManager.js');
require('./directives/newQuestion.js');
require('./directives/question.js');
require('./directives/applicationManager.js');
require('./directives/login.js');
require('./directives/newQuestionModal.js');
},{"./directives/answer.js":6,"./directives/applicationManager.js":7,"./directives/errorManager.js":8,"./directives/login.js":9,"./directives/newQuestion.js":10,"./directives/newQuestionModal.js":11,"./directives/question.js":12}],6:[function(require,module,exports){
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
            transclude: false,
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

                        var login = LoginFactory.login
                        login().login({ token: result.access_token }, function (data) {
                            console.log("login server result");

                            //if success get user data
                            if (data.result == "success") {


                                var request = gapi.client.plus.people.get(
                                {
                                    'userId': 'me'
                                });
                                request.execute(function (resp) {

                                    UserService.newUser(resp.displayName, resp.image.url, result.access_token, resp.emails[0].value)
                                    scope.$apply();
                                })
                            }
                        }, function (error) {
                            console.log("error ocurred");
                            console.log(error);

                        });


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
    .directive('newQuestionModal', ['$filter', 'CategoryService', 'QuestionFactory', 'UserService', function ($filter, CategoryService, QuestionFactory, UserService) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/new-question-modal.html',
            transclude: true,
            replace: true,
            scope: false,
            link: function (scope, element, attrs, controllers) {

                //a lot of ugly jquery stuff
                scope.global.showNewQuestionModal = function () {

                    if (UserService.currentUser == null) {
                        //the user cant post if he or she is not logged
                        scope.global.errorOcurred("You must login to ask a new question");
                    }
                    else {
                        scope.global.removeError();
                        $(element[0]).modal('show');
                    }
                }

                $(element[0]).find("#categorySelector").select2({
                    tags: CategoryService.categories
                })


                scope.addQuestion = function () {

                    $('ul.select2-selection__rendered').find('li.select2-selection__choice').each(function (index, object) {


                        scope.model.categories = $(object).text;

                    })


                    QuestionFactory.newQuestion(scope.model.title, scope.model.body, UserService.currentUser.username, 0, new Date().toDateString(), scope.model.categories, UserService.currentUser.picture);

                    scope.model.title = null;
                    scope.model.body = null;
                    scope.model.categories = null;
                }

            }
        };
    }]);
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
angular.module('Factories', []);

require('./factories/questionFactory.js');
require('./factories/loginFactory.js');
require('./factories/databaseFactory.js');

},{"./factories/databaseFactory.js":14,"./factories/loginFactory.js":15,"./factories/questionFactory.js":16}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
angular.module('Filters', []);

},{}],18:[function(require,module,exports){

require('./app.js');

require('./controllers.js');
require('./services.js');
require('./directives.js');
require('./factories.js');
require('./filters.js');


require('../../templates/compiledhtml.js')
},{"../../templates/compiledhtml.js":22,"./app.js":1,"./controllers.js":2,"./directives.js":5,"./factories.js":13,"./filters.js":17,"./services.js":19}],19:[function(require,module,exports){
angular.module('Services', []);

require('./services/user.js');
require('./services/categories.js');
},{"./services/categories.js":20,"./services/user.js":21}],20:[function(require,module,exports){
angular.module('Services')
    .service('CategoryService', ['$rootScope', '$q', '$resource', 'UserService', function ($rootScope, $q, $resource, UserService) {

        function category(name) {

        }
        this.categories = ['Funny', 'Intellectual', 'Super smart'];
        var that = this;

        this.newCategory = function (name) {

            if (UserService.currentUser.isAdmin) {
                that.categories.push(new category(name));
            }
            else {
                scope.global.errorOcurred("You are not an admin so you cannot add categories");
                throw new RegExp("You are not an admin so you cannot add categories");
            }
        }

    }])

},{}],21:[function(require,module,exports){
angular.module('Services')
    .service('UserService', ['$rootScope', '$q', '$resource', function ($rootScope, $q, $resource) {

        function user(Username, Picture, Token, Email) {
            this.username = Username;
            this.picture = Picture;
            this.token = Token;
            this.email = Email;
            this.isAdmin = window.admin == Email;
        }


        this.currentUser = null;
        var that = this;
        this.newUser = function (Username, Picture, Token, Email) {
            if (that.currentUser == null) {
                var newuser = new user(Username, Picture, Token, Email);
                that.currentUser = newuser;

                return newuser;
            }
            else {
                throw new RegExp("There can only be one user logged in, you are trying to log a second user that is wrong");
            }
        }

    }])

},{}],22:[function(require,module,exports){
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
    "    <error:manager></error:manager>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-if=\"model.userService.currentUser != null\">Hello {{model.userService.currentUser.username}}  <div ng-show=\"model.userService.currentUser.isAdmin\"> You are an admin!</div> </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <login ng-if=\"model.userService.currentUser == null\"></login>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <new:question ></new:question>\r" +
    "\n" +
    "\r" +
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
    "        <div class=\"header\">An error has ocurred</div>\r" +
    "\n" +
    "        <p>{{model.errorMessage}}</p>\r" +
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


  $templateCache.put('templates/directives/new-question-modal.html',
    "<div class=\"ui fullscreen modal\" style=\"top: 3408px;\">\r" +
    "\n" +
    "    <i class=\"close icon\"></i>\r" +
    "\n" +
    "    <div class=\"header\">\r" +
    "\n" +
    "        Add a new question\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <div class=\"ui form\">\r" +
    "\n" +
    "            <h4 class=\"ui dividing header\">Title for your question</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"ui corner labeled input\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"Required Field\">\r" +
    "\n" +
    "                <div class=\"ui corner label\">\r" +
    "\n" +
    "                    <i class=\"asterisk icon\"></i>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"field\">\r" +
    "\n" +
    "                <label>Description</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <textarea></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <label>Select a category</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <input type=\"text\" placeholder=\"Category\" id=\"categorySelector\" multiple=\"\" style=\"width:500px\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"actions\">\r" +
    "\n" +
    "        <div class=\"ui button\">Cancel</div>\r" +
    "\n" +
    "        <div class=\"ui green button\">Add</div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/directives/new-question.html',
    "\r" +
    "\n" +
    "<div ng-controller=\"QuestionController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <new:question:modal></new:question:modal>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-click=\"global.showNewQuestionModal()\" class=\"ui fullscreen demo button\">Add question</div>\r" +
    "\n" +
    "\r" +
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
    "</div>"
  );

}]);

},{}]},{},[18]);
