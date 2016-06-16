# edslider
jQuery Slider PLugin

#### How to use?
1º - Call jQuery, edSlider plugin and edSlider css
```html
<link rel="stylesheet" href="your-css-directory/edslider.css">
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="your-js-directory/edslider.js"></script>
```
2º - Init plugin
```html
<script>
//Callback after document ready
$(document).ready(function(){
	//Initiazile plugin with your preferences
	$('.mySlideshow').edslider({
		width:'960',
		height:'400'
	});
});
</script>
```
3º - Html structure
```html
<ul class="mySlideshow">
	<li>Yor stuff here!</li>
	<li>Yor stuff here!</li>
	<li>Yor stuff here!</li>
</ul>
```

#### Options
Option | Default Value | Description
--- | --- | ---
width |	960 | Set width
height | 400 | Set height
position | 1 | Start position
interval | 5000 | Interval time between slides (in milliseconds)
duration | 500 | Animation Speed (in milliseconds)
animation | true | Enable/disable animation
paginator |	true | Enable/disable paginator
navigator |	true | Enable/disable "next"/"prev" navigation buttons
progress |	true | Enable/disable progress bar
loadImgSrc | 'images/load.gif' | Load image url
skin | 'edslider' | Skin name

#### Change Log
version 1.1
* Fixed: issue with navigation (next and prev)
* Fixed: issue setting the slider background color in css file
* Improved: now the interval is relative to the progress bar

version 1.2
* New: added an option to enable/disable fade animation
* New: added an option to set the loading image path
* Improved: validation errors

version 1.3
* Fixed: issue preloading images

version 1.4
* Improved: responsive dimensions
* Improved: preloading images
* Improved: progress bar function
