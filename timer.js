(function(){
	var app = angular.module('timer', []);
	
	function formatTime(time) {
		var hours = Math.floor(time / 3600)
		var output = (hours < 10 ? "0" : "") + hours + ":";
		var minutes = Math.floor((time % 3600) / 60)
		output += (minutes < 10 ? "0" : "") + minutes + ":";
		var seconds = time % 60
		output += (seconds < 10 ? "0" : "") + seconds;
		return output;
	}
	
	function Timer ($interval, seconds = 0, alarmSeconds = 0) {
		var self = this;
		this.$interval = $interval;
		this.seconds = seconds;
		this.formattedSeconds = formatTime(seconds);
		this.alarmSeconds = alarmSeconds;
		this.formattedAlarmSeconds = formatTime(alarmSeconds);
		this.interval = null;
		this.increment = function(){
			self.seconds++;			
			self.formattedSeconds = formatTime(self.seconds);
		};
		this.startTimer = function(){
			if (!self.interval){
				self.interval = self.$interval(self.increment, 1000);
			}			
		};
		this.stopTimer = function(){
			if (self.interval){
				self.$interval.cancel(self.interval);
				self.interval = null;
			}
		};
		this.resetTimer = function(){
			self.seconds = 0;
			self.formattedSeconds = formatTime(self.seconds);
		};
	}
	
	app.controller('TimerController', ['$interval', function($interval){
		var self = this;
		this.timers = [];
		addTimer();		
		
		function addTimer(){
			self.timers.push(new Timer($interval));
		}
	}]);
	
})();