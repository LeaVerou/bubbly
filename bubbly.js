function update() {
	var side = getRadioValue('side'),
	    triangle = getRadioValue('triangle');
	    
	code.textContent = bubbleCSS('.speech-bubble', {
		side: side,
		triangle: triangle,
		size: size.value,
		color: color.value,
		ems: ems.checked
	});
	
	// Update labels
	var labelCSS ='';
	
	['top', 'right', 'bottom', 'left'].forEach(function(value) {
		labelCSS += bubbleCSS('label[for="side-' + value + '"]', {
			side: value,
			triangle: triangle,
			size: 8,
			color: 'yellowgreen'
		}) + '\n\n';
	});
	
	['symmetrical', 'right', 'left'].forEach(function(value) {
		labelCSS += bubbleCSS('label[for="triangle-' + value + '"]', {
			side: side,
			triangle: value,
			size: 8,
			color: 'deeppink'
		}) + '\n\n';
	});
	
	labels.textContent = labelCSS;
}

function bubbleCSS(selector, settings) {
	var props = {}, propsBefore = {};
	
	props['position'] = 'relative';
	props['background'] = settings.color;
	props['border-radius'] = '.4em';
	
	var side = settings.side,
	    triangle = settings.triangle,
	    isHorizontal = side == 'top' || side == 'bottom',
		opposite = {
			'top': 'bottom',
			'right': 'left',
			'bottom': 'top',
			'left': 'right'
		}[side],
		offset = isHorizontal? 'left' : 'top';
	
	propsBefore['content'] = "''";
	propsBefore['position'] = 'absolute';
	propsBefore[side] = '0';
	propsBefore[offset] = '50%';
	
	propsBefore['width'] = '0';
	propsBefore['height'] = '0';
	
	propsBefore['border'] = getLength(settings.size, settings.ems) + ' solid transparent';
	propsBefore['border-' + opposite + '-color'] = settings.color;
	propsBefore['border-' + side] = '0';
	
	if (triangle != 'symmetrical') {
		propsBefore['border-' + (isHorizontal? triangle : (triangle == 'right'? 'top' : 'bottom'))] = '0';
	}
	
	propsBefore['margin-' + offset] = getLength(-settings.size/(triangle == 'symmetrical'? 1 : 2), settings.ems); // to center it
	propsBefore['margin-' + side] = getLength(-settings.size, settings.ems); // to put it outside the box
	
	return cssRule(selector, props) + '\n\n' + cssRule(selector + ':after', propsBefore);
}

function getLength(px, useEms) {
	if (useEms) {
		var base = parseInt(getComputedStyle($('.speech-bubble')).fontSize);
		
		return Math.round(1000 * px/base)/1000 + 'em';
	}
	
	return px + 'px';
}

function cssRule(selector, props) {
	var css = selector + ' {\n';
	
	
	$u.each(props, function (value, property) {
		css += '	' + property + ': ' + value + ';\n';
	});
	
	css += '}';
	
	return css;
}

function getRadioValue(name) {
	var radios = document.getElementsByName(name);
	
	for (var i=0, radio; radio = radios[i++];) {
		if (radio.checked) {
			return radio.value;
		}
	}
	
	return '';
}

$$('input').forEach(function (input) {
	input[input.type == 'radio' || input.type == 'checkbox'? 'onclick' : 'oninput'] = update;
});

$$('input[type="radio"] + label').forEach(function (label) {
	label.title = label.textContent;
});

update();