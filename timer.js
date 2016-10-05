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
	}]);	
	
	app.controller('AppController', function(){
		var self = this;
		this.timers = [];
		addTimer();		
		
		function addTimer(){
			self.timers.push(new Timer());
		}
	});
	
})();