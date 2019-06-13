// (function() {

	var data = {

	'dragging': false,
	'resizing':false,
	// 'resizeType': null,
	'resizepos': null,
	'coordinates': {
		'startingX': null,
		'startingY': null,
		'dragStartX': null,
		'dragStartY': null
	},
	'params': {
		'width': null,
		'height': null,
		'border': null,
		'left': null,
		'top': null

	},
	'defaultCursor': 'default'
}

	var defaultCursor = 'pointer';
	var things = [];
	window.addEventListener('DOMContentLoaded', (event) => {

   		var select = document.createElement('select');
   		select.id = 'sel';

   		var options = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'input'];

		options.forEach(function(element, index) {

			var option = document.createElement('option');
			option.value = element;
			var text = document.createTextNode(element);
			option.appendChild(text);
			select.appendChild(option);	

		});

		document.body.appendChild(select);
		document.body.style.height = '100vh';

		var buttons = ['crosshair', 'pointer', 'move', 'default']

		buttons.forEach(function(buttonType, i) {
			var button = document.createElement('button')
			button.innerHTML = buttonType;
			button.onclick = function() {
				document.body.style.cursor = buttonType;
				data.defaultCursor = buttonType;
			}
			document.body.appendChild(button);
		}) 
	});
	document.addEventListener('mouseup', function() {
		data.dragging = false;
		data.resizing = false;
		// data.coordinates.dragStartX = 0;
		// data.coordinates.dragStartY = 0;
	})
	document.addEventListener('mousedown', function mouseDown(e) {

		if (parseInt(e.clientY) < 50 || data.defaultCursor != 'crosshair') { return; }

		data.coordinates.startingX = e.clientX;
		data.coordinates.startingY = e.clientY;

		var preview = document.createElement('div');
	
		preview.setAttribute('style', 'border:dotted;width:0px;height:0px;position:absolute;left:'+data.coordinates.startingX+'px;top:'+ data.coordinates.startingY+'px;');

		preview.setAttribute('num', things.length);
		things.push(preview);

		document.body.appendChild(preview);

		document.addEventListener('mousemove', mouseMove);

		document.addEventListener('mouseup', mouseUp);

		function mouseUp(e) {
			// console.log('mouseup')

			var element = document.createElement(document.getElementById('sel').value);
			var style = things[things.length-1].getAttribute('style');

			element.setAttribute('style', style.replace('dotted;', 'solid;'))
			element.setAttribute('onMouseDown', 'mouseDown2(event)');
			element.setAttribute('onMouseUp', 'mouseUp2(event)');
			element.setAttribute('onMouseEnter', 'mouseEnter(event)');
			element.setAttribute('onMouseOut', 'mouseOut(event)');
			element.setAttribute('onMouseMove', 'mouseMove2(event)');

			document.body.removeChild(things[things.length - 1]);
			document.body.appendChild(element);
	
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
		}
	})

	function mouseMove(e) {

		var x = Math.abs(e.clientX - data.coordinates.startingX);
		var y = Math.abs(e.clientY - data.coordinates.startingY);

		things[things.length - 1].setAttribute('style', 'border:dotted;width:'+x+'px;height:'+y+'px;position:absolute;left:'+ data.coordinates.startingX+'px;top:'+ data.coordinates.startingY+'px;');
		
		if (e.clientX - data.coordinates.startingX < 0) {

			if (e.clientY - data.coordinates.startingY  < 0) {

				things[things.length - 1].style.transformOrigin = '0 0';
				things[things.length - 1].style.transform = 'scale(-1, -1)';

			} else if (e.clientY - data.coordinates.startingY > 0) {

				things[things.length - 1].style.transformOrigin = '0 0';
				things[things.length - 1].style.transform = 'scale(-1, 1)';
			}
		} else if (e.clientX - data.coordinates.startingX > 0) {

			if (e.clientY - data.coordinates.startingY  < 0) {

				things[things.length - 1].style.transformOrigin = '0 0';
				things[things.length - 1].style.transform = 'scale(1, -1)';
			} 
		}
	}
	

	function mouseEnter(e) {
		// console.log('enter ', e.target)

		

			
	}
	function mouseUp2(ev) {
		// console.log('mouseup ', ev.target)
		// console.log('eeeeee')
		data.dragging = false;
		data.resizeType = null;
		data.resizing = false;
	}
	function mouseOut(e) {
		// console.log('moouseout ', e.target)
	}

	function mouseDown2(e) {

		data.params.width  = parseInt(e.target.style.width);
		data.params.height = parseInt(e.target.style.height);
		data.params.border = parseInt(e.target.clientLeft);
		data.params.left   = parseInt(e.target.style.left);
		data.params.top    = parseInt(e.target.style.top);

		// console.log('mousedown ', e.target)
		if (data.defaultCursor == 'move') { data.dragging = true; }
		if (data.defaultCursor == 'default') { data.resizing = true; }
		// console.log(data.resizing)
		// console.log(data.defaultCursor)
		// console.log(data.dragging)

		data.coordinates.dragStartX = parseInt(e.clientX);
		data.coordinates.dragStartY = parseInt(e.clientY);
	}

	function mouseMove2(ev) {

		var x = ev.clientX;
		var y = ev.clientY;
		// console.log(data.resizing)
		if (data.dragging && data.defaultCursor == 'move') {
			ev.target.style.cursor = data.defaultCursor;
			ev.target.style.left = parseInt(ev.target.style.left) + ev.movementX + 'px';
			ev.target.style.top = parseInt(ev.target.style.top) + ev.movementY + 'px';
		} else if (data.defaultCursor == 'default' && data.dragging == false) {
 
			if (x >= data.params.left-2 && x <= (data.params.left+2 + data.params.border) && 
				y >= data.params.top-2 && y <= (data.params.top+2 + data.params.border)) {

				ev.target.style.cursor = 'nwse-resize';
				data.resizepos = 'tl';
			}
			else if (x >= (data.params.left-2 + data.params.width) && x <= (data.params.left+2 + data.params.width + data.params.border) && 
					 y >= data.params.top+2 && y <= (data.params.top + data.params.border)) {

				ev.target.style.cursor = 'nesw-resize';
				data.resizepos = 'tr';
			}
			else if (x >= data.params.left-2 && x <= (data.params.left+2 + data.params.border) && 
					 y >= (data.params.top-2 + data.params.height) && y <= (data.params.top+2 + data.params.height + data.params.border)) {

				ev.target.style.cursor = 'nesw-resize';
				data.resizepos = 'bl';
			}
			else if (x >= (data.params.left-2 + data.params.width) && x <= (data.params.left+2 + data.params.width + data.params.border) && 
					 y >= (data.params.top-2 + data.params.height) && y <= (data.params.top+2 + data.params.height + data.params.border)) {

				ev.target.style.cursor = 'nwse-resize';
			data.resizepos = 'br';
			}
			else if (x >= data.params.left-2 && 
					 x <= (data.params.left+2 + data.params.border)) {

				ev.target.style.cursor = 'col-resize';
				data.resizepos = 'l';

			} else if (x >= (data.params.left-2 + data.params.width) && 
					   x <= data.params.left+2 + data.params.width + data.params.border) {

				ev.target.style.cursor = 'col-resize';
				data.resizepos = 'r';
			} else if (y >= data.params.top-2 && 
					   y <= (data.params.top+2 + data.params.border)) {

				ev.target.style.cursor = 'row-resize';
				data.resizepos = 't';

			} else if (y >= (data.params.top-2 + data.params.height) && 
					   y <= (data.params.top+2 + data.params.height + data.params.border)) {

				ev.target.style.cursor = 'row-resize';
				data.resizepos = 'b';
			} else if (data.resizing != true) { ev.target.style.cursor = 'default'; }
			
			// data.resizeType = ev.target.style.cursor;
		}
		
			// else { if (ev.target.style.cursor != 'move') ev.target.style.cursor = 'default'; }	
		 if (data.resizing == true) {

			console.log(data.resizepos);
			console.log('%c' + parseInt(ev.target.style.top) + parseInt(ev.target.style.height), 'background:black;color:yellow;')

			switch(data.resizepos) {

			case 'l':console.log(e.target);
				break;
			case 'r': ev.target.style.width = parseInt(ev.target.style.width) + (ev.movementX+.4) + 'px'; 
				break;
			case 't': 
				 // ev.target.style.top = parseInt(ev.target.style.top) + parseInt(ev.target.style.height) + 'px'; 
				 ev.target.style.height = parseInt(ev.target.style.height) - (ev.movementY+.4) + 'px';
				console.log( parseInt(ev.target.style.top) + parseInt(ev.target.style.height))
					break;
			case 'b': ev.target.style.height = parseInt(ev.target.style.height) + (ev.movementY+.4) + 'px';
				break;
			case 'tl':console.log('nesw-resize');
				break;
			case 'tr':console.log('col-resize');
				break;
			case 'bl':console.log('row-resize');
				break;
			case 'br':console.log('row-resize');
				break;
			}
		}	
	}	
// })()