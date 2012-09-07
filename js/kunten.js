$(
function(){
	// 訓点エディタ

	console = console || { log: function(){} };

	var jtext_src = $('#kunten_src');
	var jcanvas_kun = $('#kunten');
	var canvas_kun = jcanvas_kun.get(0);

	var ContextWrapper = function(canvas){
		var context = canvas.getContext('2d');
		var w = canvas.width;
		var h = canvas.height;
		var font_size = 48;
		var font_name = 'ＭＳ 明朝';
		var pitch = font_size * 1.5;

		context.font = font_size + 'px ' + font_name;
		context.textAlign = 'center';
		context.textBaseline = 'top';

		this.get = function(){ return context; };

		this.fillText = function(text,x,y){
			$.each(
				text,
				function(i,t){
					context.fillText(t,x,y+i*pitch);
				});
		};
	};

	var init_canvas_scale = function(context){
		var w = parseInt(jcanvas_kun.css('width'));
		var h = parseInt(jcanvas_kun.css('height'));
		jcanvas_kun.attr('width', w);
		jcanvas_kun.attr('height', h);
	};

	var draw_test = function(context_wrap){
		var context = context_wrap.get();
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(50,100);
		context.moveTo(50,0);
		context.lineTo(0,100);
		context.stroke();
		context_wrap.fillText('あいうえお',50,0);
	};

	var draw_kunten = function(){
		var src = jtext_src.val();
		init_canvas_scale();
		var context = new ContextWrapper(canvas_kun);
		draw_test(context);
	};

	$('#btn_draw').click(
		function(){
			draw_kunten();
		});
});