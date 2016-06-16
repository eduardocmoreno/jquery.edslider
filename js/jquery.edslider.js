/*
 * jQuery edSlider plugin v.1.4
 * @author Eduardo Moreno
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

		this.each(function(){

			//Building (wrapping, validating, setting up)
			var slider = $(this),
				sliderLi = slider.find('li'),
				sliderBgImg = sliderLi.css('background-image');

			sliderLi.length == 0 && console.error('error: empty slider!');

			var sliderImg = slider.find('img'),
				wrapper = slider
					.wrap('<div class="' + options.skin + '"/>')
					.parent()
					.css({
						'width'              : options.width,
						'background-image'   : 'url("' + options.loadImgSrc + '")',
						'background-repeat'  : 'no-repeat',
						'background-position': 'center'
					}),
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
						.find('.paginator')
						.hide();

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
						.hide()
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

			//Functions (init, play, next, prev, pause, resume)
			var timeLeft = options.interval, current, index, paused;

			function init(){				
				progressResize();
				sliderLi.length > 1 ? play() : sliderLi.fadeIn(options.duration);
			}

			function play(){
				progressReset();
				interact = false;
				current = sliderLi
					.filter('.current')
					.siblings()
					.fadeOut(options.animation && options.duration || 0)
					.end()
					.fadeIn(options.animation && options.duration || 0, function(){
						interval();
					});

				$('.navigator')
					.add('.paginator')
					.fadeIn(options.animation && options.duration || 0);

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
				progress.stop().width(0);				
				progressElapsed = 0;
				timeLeft = options.interval;
			}

			function progressResize(){
				$(window)
					.resize(function(){
						progressWidth = slider.width();
						pause(); interval();
					}).resize();
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

			//Preloading images and init
			var totalImgsUrl = [],
				preloadedImgs = 0;
			
			sliderLi.each(function(){
				sliderBgImg = $(this).css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
				sliderBgImg != 'none' && totalImgsUrl.push(sliderBgImg);
			});
			
			sliderImg.each(function(){
				totalImgsUrl.push(this.src);
			});

			if(totalImgsUrl){
				$.each(totalImgsUrl, function(value){
					$('<img/>')
						.hide()
						.attr('src', totalImgsUrl[value])
						.on('load', function(){
							if(++preloadedImgs == totalImgsUrl.length){
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