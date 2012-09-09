$(
function(){
	// 訓点エディタ

	console = console || { log: function(){} };

	var jtext_src = $('#kunten_src');
	var jcanvas_kun = $('#kunten');
	var canvas_kun = jcanvas_kun.get(0);

	var KuntenFrame = function(base_char){
		var kana = '';
		var kaeri = '';
		var hyphen = false;
		this.append_kana = function(k){ kana += k; };
		this.append_kaeri = function(k){ kaeri += k; };
		this.set_hyphen = function(){ hyphen = true; };
		this.draw = function(drawer, x, y){
			drawer.draw_base(base_char, x, y);
			drawer.draw_kana(kana, x, y);
			drawer.draw_kaeri(kaeri, x, y);
			if(hyphen) drawer.draw_hyphen(x, y);
		};
	};

	var parse = function(str){
		var re_kana = /[ぁ-ゖァ-ヺ]/;
		//var re_kanji = /[\u3400-\u9fff]/;
		var re_hyphen = /[-－]/;
		var re_kaeri_sep = /[_＿]/;
		var current_frame = undefined;
		var frames = [];
		var kaeri = false;
		try {
			$.each(
				str,
				function(i, t){
					if(re_kaeri_sep.test(t)){ kaeri = !kaeri; return; }
					if(kaeri){ current_frame.append_kaeri(t); return; }
					if(re_kana.test(t)){
						current_frame.append_kana(t);
					} else if(re_hyphen.test(t)){
						current_frame.set_hyphen();
					} else {
						current_frame = new KuntenFrame(t);
						frames.push(current_frame);
					}
				});
			return frames;
		} catch (x) {
			console.log(x);
			return [];
		}
	};

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
				function(i, t){
					context.fillText(t,x,y+i*pitch);
				});
		};
		this.draw_hyphen = function(x, y, l){
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x, y+l);
			context.stroke();
		};
	};

	var KuntenDrawer = function(context, font_size, small_size, y_pitch){
		var re_katakana = /^[ァ-ヺ]+$/;
		this.draw_base = function(t, x, y){
			context.fill_text(t, x, y, font_size, font_size);
		};
		this.draw_kana = function(t, x, y){
			if(re_katakana.test(t)){ t = '　　' + t; }
			context.fill_text(t, x+small_size, y, small_size, small_size);
		};
		this.draw_kaeri = function(t, x, y){
			context.fill_text(t, x-small_size, y+font_size, small_size, small_size/2);
		};
		this.draw_hyphen = function(x, y){
			var padding = y_pitch - font_size;
			var len = padding / 2;
			var margin = (padding - len) / 2;
			context.draw_hyphen(x-font_size/2, y+font_size+margin, len);
		};
	};

	var init_canvas_scale = function(context){
		var w = parseInt(jcanvas_kun.css('width'));
		var h = parseInt(jcanvas_kun.css('height'));
		jcanvas_kun.attr('width', w);
		jcanvas_kun.attr('height', h);
	};

	var draw_kunten_frames = function(frames){
		var font_size = 48;
		var small_size = font_size / 2;
		var x_pitch = font_size * 2.5;
		var y_pitch = font_size * 2;
		var context = new ContextWrapper(canvas_kun, font_size);
		var drawer = new KuntenDrawer(context, font_size, small_size, y_pitch);
		var w = context.w();
		var h = context.h();
		var x = w - font_size;
		var y = 0;
		$.each(
			frames,
			function(i, f){
				f.draw(drawer, x, y);
				y += y_pitch;
				if(y + y_pitch > h){
					x -= x_pitch;
					y = 0;
				}
			});
	};

	var draw_kunten = function(){
		init_canvas_scale();
		draw_kunten_frames(parse(jtext_src.val()));
	};

	$('#btn_draw').click(
		function(){
			draw_kunten();
		});

	// drawing test
	var draw_test = function(){
		init_canvas_scale();
		draw_kunten_frames(parse('平へい-定ていス_二_海かい内だいヲ_一_'));
	};

	draw_test();
});