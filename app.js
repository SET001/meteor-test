// Images = new Mongo.Collection();
store = new FS.Store.FileSystem("images", {path: "/home/set/www/meteor_test3/public/static/uploads"});
Images = new FS.Collection("images", {
	stores: [store]
});
if (Meteor.isClient) {
  angular
  	.module('meteorTest',['angular-meteor', 'ui.bootstrap'])
    .directive('slider', function(){
      return {
        templateUrl: 'views/slider.ng.html',
        restrict: 'E',
        scope: {
          images: '='
        },
        controller: function($scope, $interval){
          $scope.activeSlide = 0;
          $scope.itemsPerSlide = 3;
          var cImages = 0;

          $scope.$watch('images', function(images){
            console.log(cImages !== images.length);
            if (images.length && cImages !== images.length) {
              $scope.slides = [];
              cImages = images.length;
              for(var i=0; i<$scope.images.length/$scope.itemsPerSlide; i++){
                $scope.slides.push($scope.images.slice(i*$scope.itemsPerSlide, $scope.itemsPerSlide*(i+1)));
              };
              console.log("slides changed", $scope.slides);
            }else{
              console.log($scope.images, $scope.slides, $scope.activeSlide, cImages);
            }
          }, true);

          var recountImpressions = function(){
            $scope.slides[$scope.activeSlide].map(function(image){
              if (typeof image.impressions === 'undefined') image.impressions = 0;
              else image.impressions++;
            });
          };

          $scope.next = function(){
            if ($scope.activeSlide === $scope.slides.length-1)
              $scope.activeSlide = 0;
            else $scope.activeSlide++;
            recountImpressions();
            console.log("next", $scope.activeSlide);
          };

          $scope.previous = function(){
            if ($scope.activeSlide===0)
              $scope.activeSlide = $scope.slides.length-1;
            else $scope.activeSlide--;
            recountImpressions();
            console.log("prev", $scope.activeSlide);
          };

          $interval(function(){
            $scope.next();
          }, 5000);
        },
      }
    })
  	.directive('fileread', function(){
  		return {
  			scope: {
          fileread: "="
        },
        link: function (scope, element, attributes) {
          element.bind("change", function (changeEvent) {
            scope.$apply(function () {
              scope.fileread = changeEvent.target.files[0];
            });
          });
        }
  		}
  	})
  	.controller('appCtrl', function($scope, $meteor){
  		$scope.images = $meteor.collection(Images);
  		$scope.newImage = {
  			url: ''
  		};

  		$scope.tableFilter = {
  			field: '_id',
  			reverse: true};


  		$scope.remove = function(image){
  			$scope.images.remove(image);
  		}

  		$scope.upload = function(){
        if ($scope.newImage.file){
    			console.log("uploading", $scope.newImage.file);
    			$scope.images.save($scope.newImage.file);
        };
  		}

  		$scope.toggleFilter = function(field){
  			if (field === $scope.tableFilter.field){
  				$scope.tableFilter.reverse = !$scope.tableFilter.reverse;
  			}else{
  				$scope.tableFilter.field = field;
  			}
  		}
  	});
}

if (Meteor.isServer){
	Meteor.startup(function(){
		// if (Images.find().count() === 0) {
		// 	var count = Math.ceil(Math.random()*10);
  //     for (var i = 0; i < count; i++){
  //       Images.insert({
  //       	name: "Asdasdasd"
  //       });
  //      }
  //    }
	});
}
