# edslider
jQuery Slider PLugin

#### How to use?
1º - Call jQuery, edSlider plugin and edSlider css inside **HEAD** tag
```html
<link rel="stylesheet" href="your-css-directory/edslider.css">
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="your-js-directory/edslider.js"></script>
```
2º - Initialize the plugin (still inside **HEAD** tag)
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
3º - Inside **BODY** tag, make the html structure like this:
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
width |	960 | Sets the width of the slider
height | 400 | Sets the height of the slider
position | 1 | Sets the start position. It must be between 1 and the **li** lenght.
interval | 5000 | Sets the time interval (in milliseconds) between slides.
duration | 500 | Sets the speed (in milliseconds) of the animations.
animation | true | Enable/disable animation.
paginator |	true | Enable/disable the paginator (boolean value: true or false).
navigator |	true | Enable/disable the "next" and "prev" navigation buttons (boolean value: true or false).
progress |	true | Enable/disable the interval progress bar (boolean value: true or false).
loadImgSrc | 'images/load.gif' | Sets the path of the loading image.
skin | 'edslider' | Sets the name of the skin. Use the edslider.css file to create your own skin.

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
