var app = angular.module('ngApp', ['ngAnimate']);

//function to retur the index of the character in scrambled word
app.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      //console.log("Debug:input[i].id->"+input[i].id +"=="+id);
      if (input[i].id == id) {
        //console.log("###found");
        return input[i].xpos;
      }
    }
    return null;
  }
});

app.controller('myCtrl', function($scope, $http, $timeout, $filter, $window) {

$scope.arr=[];
var arr=[];

$scope.word="";
$scope.result="";
$scope.message="";

$http.get("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5").success(

function(response)
{
  var testword = response.word;
  console.log("unsrambled:"+testword);
  $scope.word= testword.toLowerCase();
  var wordArray = testword.toLowerCase().split("");
  var tempArrForDuplicates = wordArray;
 
   var duplicates= false;
  //find duplicates
  for(var i=0; i< tempArrForDuplicates.length; i++)
  {
	for(var j=i+1; j< tempArrForDuplicates.length; j++)
	{
		if(tempArrForDuplicates[i] == tempArrForDuplicates[j])
		{
			duplicates = true;
		}
	}
  }
  //console.log("duplicates:"+duplicates);
  // avoiding words that have duplicate characters in the word
  if(duplicates)
  {
	$window.location.reload();
  }
  
  // scramble the word
  for(var i=0; i< wordArray.length; i++)
	{
		var randomNumber = Math.floor((Math.random() * wordArray.length) ); 
        var temp = wordArray[i];
      	wordArray[i] = wordArray[randomNumber];
        wordArray[randomNumber] = temp;
    }
 
 // store the scrambled word in an array
  for(var i=0;i< wordArray.length; i++)
	{
		$scope.arr.push({val:i,id:''+wordArray[i],xpos:i});
		
	}

  //console.log($scope.arr);
  //var arr = $scope.arr = [{val:0,id:'a',xpos:0},{val:1,id:'b',xpos:1},{val:2,id:'c',xpos:2}];
  arr = $scope.arr;
 }
);

 //function that return the absolute position of the element
  $scope.getAbsPos = function(index){
    //console.log(index);
	var leftWidth= window.screen.width/4;
    return {left:((index*100)+ leftWidth)+'px'};
	
  }


   $scope.currentKeyPress=0;
   $scope.charCount=0;
   $scope.AllChars="abcdefghijklmnopqrstuvwxyz";
  
   $scope.swap = function($event){
   
		//console.log("Debug: In swap");
		//console.log("Debug: $scope.result:"+$scope.result);
		//console.log("Debug: response.word:"+$scope.word);
   
		if( $scope.result.length == $scope.word.length-1  )
		 {
			if($scope.result == $scope.word.substr(0, $scope.word.length-1 ) )
			{
				$scope.message = "Congrats!!!";
				
			}
			else
			{	
				$scope.message = "Try again!!!";
				
			}
		 } 
 
    $scope.currentKeyPress = (window.event ? $event.keyCode : $event.which);
    
    //var currentChar= String.fromCharCode((96 <= $scope.currentKeyPress && $scope.currentKeyPress <= 105) ? $scope.currentKeyPress-48 : $scope.currentKeyPress);
	
	//console.log("$scope.currentKeyPress:"+$scope.currentKeyPress);
	if($scope.currentKeyPress==8 || ($scope.currentKeyPress <65) || ($scope.currentKeyPress > 97))
	{
		if($scope.currentKeyPress==8)
		{
			$scope.charCount = $scope.charCount-1;
		}
	}
	else
	{
		$scope.charCount = $scope.charCount+1;
	
		//console.log("$scope.charCount:"+$scope.charCount);
		console.log("$scope.currentKeyPress:"+$scope.currentKeyPress);

		var currentChar = $scope.AllChars.charAt( $scope.currentKeyPress- 65);  
		console.log("currentChar="+currentChar);    
		var found = $filter('getById')($scope.arr, currentChar);
  
		var indexSwapFrom= $scope.arr.indexOf(currentChar);
		var indexSwapTo = $scope.charCount-1;

        if(found !=null){
			var indexSwapFrom= found; 

			//console.log("indexSwapFrom, indexSwapTo:"+ indexSwapFrom+" "+indexSwapTo);

		
			if(indexSwapFrom != indexSwapTo )
			{
				var a= arr[indexSwapTo];
				var c = arr[indexSwapFrom];

			//reorder the array first, since xpos did not change, no animation will be triggered
				arr[indexSwapTo] = c;
				arr[indexSwapFrom] = a;
    
		//update the xpos value in async, which will trigger an animation
			$timeout(function(){
      			var tempX = a.xpos;
						a.xpos = c.xpos;
						c.xpos = tempX;
						
			},5)
			}
	
		}
		
	}

  }
  
});
