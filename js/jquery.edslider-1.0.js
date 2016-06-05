/*
 * jQuery edSlider plugin v.1.0
 * @author Eduardo Carneiro Moreno
 * Code under MIT License
 */

(function ($) {

	$.fn.edslider = function (settings) {

		var defaults = {
			width:960,
			height:400,
			position:1,
			interval:3000,
			speed:700,
			paginator:true,
			navigator:true,
			progress:true,
			skin:'edslider'
		};

		var options = $.extend({}, defaults, settings);

		return this.each(function () {

			//Building (wrapping, validating, setting up)
			var slider = $(this),
				sliderLi = slider.find('li');

			if (sliderLi.length == 0) {
				alert('ERROR!\n\nEmpty slider!');
				return false;
			}

			var sliderImg = sliderLi.find('img'),
				wrapper = slider.wrap('<div class="' + options.skin + '"/>').parent().css('width', options.width),
				startPosition = options.position;

			if (options.position == 0 || options.position > sliderLi.length) {
				alert('ERROR!\n\nStart position value must be between 1 and ' + sliderLi.length + '!');
				startPosition = 1;
			}

			slider.hover(
				function () {
					slider.addClass('hover');
					hoverControl();
				},
				function () {
					slider.removeClass('hover');
					hoverControl();
				}
			).add(sliderLi).css('height', options.height);

			sliderLi.filter(':nth-child(' + startPosition + ')').addClass('current');

			//Controls (navigation, pagination and progress bar)
			var position, controls, paginator, paginatorLi, progress, progressWidth, progressWidthLeft, interact = false;

			if ((options.navigator || options.paginator) && sliderLi.length > 1) {
				controls = wrapper.append('<div class="controls" />').find('.controls');
				if (options.paginator) {
					paginator = controls.prepend('<ul class="paginator"/>').find('.paginator');
					sliderLi.each(function () {
						paginator.append('<li>&nbsp;</li>');
					});
					paginatorLi = paginator.find('li').on('click', function () {
						if (interact) {
							position = $(this).index();
							sliderLi.removeClass('current').filter(':nth-child(' + ++position + ')').addClass('current');
							play();
						}
					});
				}
				if (options.navigator) {
					controls.append('<div class="navigator prev"/><div class="navigator next"/>').find('.navigator').on('click', function () {
						var btn = $(this);
						btn.hasClass('next') && interact && next();
						btn.hasClass('prev') && interact && prev();
					});
				}
			}

			if (options.progress) {
				progress = wrapper.prepend('<div class="progress"/>').find('.progress');
				progressWidth = options.width;
			}

			//Functions (init, play, next, prev, pause, resume)
			var time, timeLeft, current, index;

			function init() {
				sliderLi.length > 1 ? play() : sliderLi.fadeIn(options.speed);
			}

			function play() {
				clearTimeout(time);
				interact = false;
				options.progress && progress.stop().fadeOut('fast');
				current = sliderLi.filter('.current').siblings().fadeOut(options.speed).end().fadeIn(options.speed, function () {
					interact = true;
					options.progress && progress.stop().show().width(0).animate({
						width:progressWidth
					}, options.interval, function () {
						$(this).fadeOut('fast');
					});
					time = setTimeout(next, options.interval);
					hoverControl();
				});
				index = sliderLi.index(current) + 1;
				options.paginator && paginatorLi.removeClass('current').filter(':nth-child(' + index + ')').addClass('current');
			}

			function next() {
				sliderLi.removeClass('current');
				++index <= sliderLi.length ? current.next().addClass('current') : sliderLi.filter(':first-child').addClass('current');
				play();
			}

			function prev() {
				sliderLi.removeClass('current');
				--index >= 1 ? current.prev().addClass('current') : sliderLi.filter(':last-child').addClass('current');
				play();
			}

			function pause() {
				clearTimeout(time);
				progress.stop();
				progressWidthLeft = progressWidth - progress.width();
				timeLeft = progressWidthLeft * (Math.ceil(options.interval / progressWidth));
			}

			function resume() {
				progress.stop().animate({
					width:'+=' + progressWidthLeft
				}, timeLeft, function () {
					timeLeft = options.interval;
					progressWidthLeft = progressWidth;
					next();
				});
			}

			function hoverControl() {
				interact && options.progress && (slider.hasClass('hover') ? pause() : (timeLeft && resume()));
			}

			//Preloading and init
			var preloadedImgs = 0,
				totalImgs = sliderImg.length;

			if (totalImgs > 0) {
				slider.css({
					'background-image':'url("images/load.gif")',
					'background-repeat':'no-repeat',
					'background-position':'center'
				});
				sliderImg.each(function () {
					$('<img/>').attr('src', this.src + '?random=' + (new Date()).getTime()).on('load', function () {
						if (++preloadedImgs == totalImgs) {
							slider.css('background-image', 'none');
							init();
						}
					});
				});
			} else {
				init();
			}

		});

	}

})(jQuery);