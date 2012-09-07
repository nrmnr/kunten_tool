$(
function(){
	// 訓点エディタ

	console = console || { log: function(){} };

	var jtext_src = $('#kunten_src');
	var jcanvas_kun = $('#kunten');

	var init_canvas_scale = function(){
		jcanvas_kun.attr('width', parseInt(jcanvas_kun.css('width')));
		jcanvas_kun.attr('height', parseInt(jcanvas_kun.css('height')));
	};

	var draw_test = function(context){
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(400,600);
		context.moveTo(400,0);
		context.lineTo(0,600);
		context.stroke();
	};

	var draw_kunten = function(){
		var src = jtext_src.val();
		init_canvas_scale();
		var context = jcanvas_kun.get(0).getContext('2d');
		draw_test(context);
	};

	$('#btn_draw').click(
		function(){
			draw_kunten();
		});
});