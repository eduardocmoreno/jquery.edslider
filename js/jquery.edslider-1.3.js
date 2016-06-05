/*
 * jQuery edSlider plugin v.1.3
 * @author Eduardo Carneiro Moreno
 * Code under MIT License
 */

(function($){

	$.fn.edslider = function(settings){

		var defaults = {
			width     : 960,
			height    : 400,
			position  : 1,
			interval  : 5000,
			duration  : 500,
			animation : true,
			paginator : true,
			navigator : true,
			progress  : true,
			loadImgSrc: 'images/load.gif',
			skin      : 'edslider'
		};

		var options = $.extend({}, defaults, settings);

		return this.each(function(){

			//Building (wrapping, validating, setting up)
			var slider = $(this),
				sliderLi = slider.find('li');

			sliderLi.length == 0 && console.error('error: empty slider!');

			var sliderImg = slider.find('img'),
				wrapper = slider
					.wrap('<div class="' + options.skin + '"/>')
					.parent()
					.css('width', options.width),
				startPosition = options.position;

			if(options.position == 0 || options.position > sliderLi.length){
				console.error('error: start position value must be between 1 and ' + sliderLi.length + '!');
				startPosition = 1;
			}

			slider
				.on('mouseenter', function(){
					$(this).addClass('hover');
					hoverControl();
				})
				.on('mouseleave', function(){
					$(this).removeClass('hover');
					hoverControl();
				})
				.add(sliderLi)
				.css('height', options.height);

			sliderLi
				.css('width', options.width)
				.filter(':nth-child(' + startPosition + ')')
				.addClass('current');

			//Controls (navigation, pagination and progress bar)
			var position, controls, paginator, paginatorLi, progress, progressWidth, progressElapsed, interact = false;

			if((options.navigator || options.paginator) && sliderLi.length > 1){
				controls = wrapper
					.on('selectstart', false)
					.append('<div class="controls" />')
					.find('.controls');

				if(options.paginator){
					paginator = controls
						.prepend('<ul class="paginator"/>')
						.find('.paginator');

					sliderLi.each(function(){
						paginator.append('<li>&nbsp;</li>');
					});

					paginatorLi = paginator
						.find('li')
						.on('click', function(){
							if(interact){
								position = $(this).index();
								if((index - 1) != position){
									sliderLi
										.removeClass('current')
										.filter(':nth-child(' + ++position + ')')
										.addClass('current');
									play();
								}
							}
						})
				}
				if(options.navigator){
					controls
						.append('<div class="navigator prev"/><div class="navigator next"/>')
						.find('.navigator')
						.on('click', function(){
							var btn = $(this);
							btn.hasClass('next') && interact && next();
							btn.hasClass('prev') && interact && prev();
						});
				}
			}

			progress = wrapper
				.prepend('<div class="progress"/>')
				.find('.progress').width(0);

			!options.progress && progress.height(0);

			progressWidth = slider.width();

			//Functions (init, play, next, prev, pause, resume)
			var timeLeft = options.interval, current, index, paused;

			function init(){
				sliderLi.length > 1 ? play() : sliderLi.fadeIn(options.duration);
			}

			function play(){
				progressReset();
				interact = false;
				current = sliderLi.filter('.current');
				if(options.animation){
					current
						.siblings()
						.fadeOut(options.duration)
						.end()
						.fadeIn(options.duration, function(){
							interval();
						});
				} else {
					current
						.siblings()
						.hide()
						.end()
						.show();
					interval();
				}
				index = sliderLi.index(current) + 1;
				if(options.paginator){
					paginatorLi
						.removeClass('current')
						.filter(':nth-child(' + index + ')')
						.addClass('current');
				}
			}

			function next(){
				sliderLi.removeClass('current');
				if(++index <= sliderLi.length){
					current
						.next()
						.addClass('current')
				} else {
					sliderLi
						.filter(':first-child')
						.addClass('current');
				}
				play();
			}

			function prev(){
				sliderLi.removeClass('current');
				if(--index >= 1){
					current
						.prev()
						.addClass('current')
				} else {
					sliderLi
						.filter(':last-child')
						.addClass('current');
				}
				play();
			}

			function pause(){
				paused = true;
				progressElapsed = progress
					.stop()
					.width();
				timeLeft = (progressWidth - progressElapsed) * (options.interval / progressWidth);
			}

			function interval(){
				paused = false;
				interact = true;
				progress
					.stop()
					.show()
					.animate({
						width: '+=' + (progressWidth - progressElapsed)
					}, timeLeft, 'linear', function(){
						progressReset();
						next();
					});
				hoverControl();
			}

			function progressReset(){
				if(options.animation){
					progress
						.stop()
						.fadeOut(options.duration, function(){
							progress.width(0);
						});
				} else {
					progress.width(0);
				}
				progressElapsed = 0;
				timeLeft = options.interval;
			}

			function hoverControl(){
				if(interact){
					if(slider.hasClass('hover')){
						pause();
					} else if(paused){
						interval();
					}
				}
			}

			//Preloading and init
			var preloadedImgs = 0,
				totalImgs = sliderImg.length;

			if(totalImgs > 0){
				sliderImg.each(function(){
					$('<img/>')
						.hide()
						.attr('src', this.src + '?random=' + new Date().getTime())
						.on('load', function(){
							if(++preloadedImgs == totalImgs){
								slider.css('background-image', 'none');
								init();
							} else {
								slider.css({
									'background-image'   : 'url("' + options.loadImgSrc + '")',
									'background-repeat'  : 'no-repeat',
									'background-position': 'center'
								});
							}
						});
				});
			} else {
				init();
			}
		});
	}
})(jQuery);