/*SkillsCounter Init*/

$(document).ready(function() {
	"use strict";
	if( $('#pie_chart_1').length > 0 ){
		$('#pie_chart_1').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 4,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			scaleColor:false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_2').length > 0 ){
		$('#pie_chart_2').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 4,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			scaleColor:false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_3').length > 0 ){
		$('#pie_chart_3').easyPieChart({
			animate: 3000,
			barColor : '#c7254e',
			lineWidth: 4,
			size:	100,
			scaleColor:false,
			lineCap: 'square',
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_chambery').length > 0 ){
		$('#pie_chart_chambery').easyPieChart({
			animate: 3000,
			barColor : '#c7254e',
			lineWidth: 4,
			size:	100,
			scaleColor:false,
			lineCap: 'square',
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_feed_rate').length > 0 ){
		$('#pie_chart_feed_rate').easyPieChart({
			animate: 3000,
			barColor : '#c7254e',
			lineWidth: 4,
			size:	100,
			scaleColor:false,
			lineCap: 'square',
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}

	if( $('#pie_chart_34').length > 0 ){
		$('#pie_chart_34').easyPieChart({
			animate: 3000,
			barColor : '#0ac700',
			lineWidth: 4,
			size:	100,
			scaleColor:false,
			lineCap: 'square',
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_4').length > 0 ){
		$('#pie_chart_4').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			scaleColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_5').length > 0 ){
		$('#pie_chart_5').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			scaleColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
    if( $('#pie_chart_6').length > 0 ){
		$('#pie_chart_6').easyPieChart({
			animate: 3000,
			barColor : '#f8b32d',
			lineWidth: 2,
			scaleColor: false,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_7').length > 0 ){
		$('#pie_chart_7').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			scaleColor:false,
			trackColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_8').length > 0 ){
		$('#pie_chart_8').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			scaleColor:false,
			trackColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_9').length > 0 ){
		$('#pie_chart_9').easyPieChart({
			animate: 3000,
			barColor : '#f8b32d',
			lineWidth: 2,
			size:	100,
			scaleColor:false,
			lineCap: 'square',
			trackColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_10').length > 0 ){
		$('#pie_chart_10').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			scaleColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
	if( $('#pie_chart_11').length > 0 ){
		$('#pie_chart_11').easyPieChart({
			barColor : '#50c4e3',
			lineWidth: 2,
			animate: 3000,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			scaleColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
    if( $('#pie_chart_12').length > 0 ){
		$('#pie_chart_12').easyPieChart({
			animate: 3000,
			barColor : '#f8b32d',
			lineWidth: 2,
			scaleColor: false,
			size:	100,
			lineCap: 'square',
			trackColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
		});
	}
});
