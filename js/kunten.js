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
		context.textAlign = 'right';
		context.textBaseline = 'top';

		this.get = function(){ return context; };
		this.w = function(){ return w; };
		this.h = function(){ return h; };

		this.fillText = function(text,x,y){
			$.each(
				text,
				function(i,t){
					context.fillText(t,x,y+i*pitch);
				});
		};
	};

	var KuntenDrawer = function(context_wrap){
		var w = context_wrap.w();
		this.draw = function(text){
			context_wrap.fillText(text, w, 0)
		};
	};

	var init_canvas_scale = function(context){
		var w = parseInt(jcanvas_kun.css('width'));
		var h = parseInt(jcanvas_kun.css('height'));
		jcanvas_kun.attr('width', w);
		jcanvas_kun.attr('height', h);
	};

	var draw_kunten = function(){
		var src = jtext_src.val();
		init_canvas_scale();
		var context = new ContextWrapper(canvas_kun);
	};

	$('#btn_draw').click(
		function(){
			draw_kunten();
		});

	var draw_test = function(){
		init_canvas_scale();
		var context_wrap = new ContextWrapper(canvas_kun);
		var drawer = new KuntenDrawer(context_wrap);
		drawer.draw('平へい—定ていス海かい内だいヲ');
	};

	draw_test();
});