(function(){
	var app = angular.module('timer', []);
	
	var notificationAudio = new Audio("Notification.wav");
	
	function formatTime(time) {
		var hours = Math.floor(time / 3600)
		var output = (hours < 10 ? "0" : "") + hours + ":";
		var minutes = Math.floor((time % 3600) / 60)
		output += (minutes < 10 ? "0" : "") + minutes + ":";
		var seconds = time % 60
		output += (seconds < 10 ? "0" : "") + seconds;
		return output;
	}
	
	function Timer (seconds = 0, alarmSeconds = 0, alarmEnabled = false) {		
		this.seconds = seconds;
		this.formattedSeconds = formatTime(seconds);
		this.alarmSeconds = alarmSeconds;
		this.formattedAlarmSeconds = formatTime(alarmSeconds);

		this.alarmEnabled = alarmEnabled;
		this.name = "New Timer"
	}
	
	app.controller('TimerController', ['$scope', '$interval', function($scope, $interval){
		var self = this;
		var timer = $scope.timer;
		this.interval = null;
		
		function increment(){
			timer.seconds++;
			timer.formattedSeconds = formatTime(timer.seconds);
			if (timer.alarmEnabled && timer.seconds == timer.alarmSeconds){
				notificationAudio.play();
				if (!document.hasFocus()){
					document.title = "(" + timer.name + ") " + document.title;
				}				
			}
		}
		this.startTimer = function(){
			if (!self.interval){
				self.interval = $interval(increment, 1000);
			}			
		};
		this.stopTimer = function(){
			if (self.interval){
				$interval.cancel(self.interval);
				self.interval = null;
			}
		};
		this.resetTimer = function(){
			timer.seconds = 0;
			timer.formattedSeconds = formatTime(timer.seconds);
		};
		this.deleteTimer = function(){
			$scope.$emit('deleteTimer', timer);
		};
		this.adjustAlarm = function(amount){
			timer.alarmSeconds += amount;
			if (timer.alarmSeconds < 0){
				timer.alarmSeconds = 0;
			}
			timer.formattedAlarmSeconds = formatTime(timer.alarmSeconds);
		};
		this.toggleAlarm = function(){
			timer.alarmEnabled = !timer.alarmEnabled;
		}
		
		$scope.$on('startAll', function(event){
			self.startTimer();
		});
		$scope.$on('stopAll', function(event){
			self.stopTimer();
		});
		$scope.$on('resetAll', function(event){
			self.resetTimer();
		});
	}]);	
	
	app.controller('AppController', ['$scope', function($scope){
		var self = this;
		this.timers = [];			
		
		this.addTimer = function(){
			self.timers.push(new Timer());
		}		
		this.startAll = function(){
			$scope.$broadcast('startAll');
		}		
		this.stopAll = function(){
			$scope.$broadcast('stopAll');
		}
		this.resetAll = function(){
			$scope.$broadcast('resetAll');
		}
		/*Reset the page title*/
		function resetTitle(){
			document.title = "Tiny Timer ng";
		}
		
		$scope.$on('deleteTimer', function(event, elem){
			var i = self.timers.indexOf(elem);
			if (i != -1){
				self.timers.splice(i, 1);
			}
		});
		
		document.onfocus = resetTitle;
		this.addTimer();
	}]);
	
})();