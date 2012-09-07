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
		var font_name = 'ＭＳ 明朝';

		context.textAlign = 'right';
		context.textBaseline = 'top';

		this.get = function(){ return context; };
		this.w = function(){ return w; };
		this.h = function(){ return h; };

		this.fill_text = function(text,x,y,size,pitch){
			pitch = pitch || size;
			context.font = size + 'px ' + font_name;
			$.each(
				text,
				function(i,t){
					context.fillText(t,x,y+i*pitch);
				});
		};
	};

	var KuntenDrawer = function(canvas){
		var font_size = 48;
		var small_size = font_size / 2;
		var pitch = font_size * 2;
		var context = new ContextWrapper(canvas, font_size);
		var w = context.w();
		var re_hiragana = /[ぁ-ゖ]/;
		var re_katakana = /[ァ-ヺ]/;
		var KANJI = 0, HIRAGANA = 1, KATAKANA = 2, UNDEF = -1;
		var get_token = function(text){
			var arr = [];
			var s = '';
			var type = UNDEF;
			$.each(
				text,
				function(i, t){
					var cur_type;
					if(re_hiragana.test(t)){ cur_type = HIRAGANA; }
					else if(re_katakana.test(t)){ cur_type = KATAKANA; }
					else cur_type = KANJI;
					if(type == KANJI || cur_type != type){
						if(s != ''){
							arr.push({type:type, text:s});
						}
						type = cur_type;
						s = t;
					} else {
						s += t;
					}
				});
			arr.push({type:type, text:s});
			return arr;
		};
		this.draw = function(text){
			var x = w - font_size;
			var y = 0, next_y = 0;
			var arr = get_token(text);
			$.each(
				arr,
				function(i, token){
					var t = token.text;
					switch(token.type){
					case KANJI:
						y = next_y;
						context.fill_text(t, x, y, font_size, pitch);
						next_y = y + t.length * pitch;
						break;
					case HIRAGANA:
						context.fill_text(t, x+small_size, y, small_size);
						break;
					case KATAKANA:
						context.fill_text(t, x, y+font_size, small_size);
						break;
					default:
						console.log('type error');
					}
				});
		};
	};

	var init_canvas_scale = function(context){
		var w = parseInt(jcanvas_kun.css('width'));
		var h = parseInt(jcanvas_kun.css('height'));
		jcanvas_kun.attr('width', w);
		jcanvas_kun.attr('height', h);
	};

	var draw_kunten = function(){
		init_canvas_scale();
		var drawer = new KuntenDrawer(canvas_kun);
		drawer.draw(jtext_src.val());
	};

	$('#btn_draw').click(
		function(){
			draw_kunten();
		});

	var draw_test = function(){
		init_canvas_scale();
		var drawer = new KuntenDrawer(canvas_kun);
		drawer.draw('平へい定ていス海かい内だいヲ');
	};

	draw_test();
});