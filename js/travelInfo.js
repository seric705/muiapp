function TravelInfo() {
	this.infoId = null;
	this.infoData = null;
	this.modelList = null;
	this.jsonURL = '../json/travelInfo.json';
//		this.jsonURL = 'http://ailv3.ailvgocloud.com/ailv3/index.php/app/HomeList/getLyzxJson?callback=?';
	//是否显示分享标志
	this.shareFlag = false;
	this.init();
};

TravelInfo.prototype = {
	//获取地址栏参数
	getUrlParam: function(name) {
		var reg = new RegExp("(^|&)" +
			name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	//根据资讯Id获取数据
	getInfoData: function() {
		var This = this;
		This.infoId = decodeURI(This.getUrlParam('infoId'));
		//是否显示下载链接
		This.shareFlag = decodeURI(This.getUrlParam('shareFlag'));
		console.log('infoId' + This.infoId);
		$.getJSON(This.jsonURL, {
			id: This.infoId
		}, function(data) {
			console.log(JSON.stringify(data));
			if (data.status != 'ok') {
				This.setErrorData();
			} else {
				This.infoData = data.msg.travelInfo;
				This.modelList = data.msg.travelInfo.modelList;
				This.setData();
			};
		}).fail(function(e) {
			console.log(e);
			This.setErrorData();
		});
	},
	//显示错误数据
	setErrorData: function() {
		var $content = $('.mui-content').empty()
			.append($('<h1></h1>').append('抱歉，您访问的数据不存在～'));

	},
	setData: function() {
		var This = this;
		$('title').text(This.infoData.title);
		$('.infoHeader').find('h1').html(This.infoData.title).end()
			.find('.data').html(This.infoData.date).end()
			.find('.author').html('责编：' + This.infoData.AuthorName);
		$('.logoPicBox').css('background-image', 'url(' + This.infoData.logoPic + ')');

		var $padded = $('.mui-content-padded').empty();
		$.each(This.modelList, function(i, n) {
			//添加模块类型，对齐方式，字体
			var $modelBox = $('<section></section>').addClass(n.type)
				.css('text-align', n.align).css('font-style', n.style);;
			switch (n.type) {
				case 'synopsis':
					//简介
					$modelBox.html(n.text);
					break;
				case 'synopsis2':
					//简介
					$modelBox.html(n.text);
					break;
				case 'modelTitle':
					//花式标题
					var $div = $('<div></div>').append($('<span></span>').html(n.upText));
					$modelBox.append($div).append($('<h3></h3>').html(n.downText));
					break;
				case 'titleWithCloud':
					//代云的标题
					var $div = $('<div></div>').html(n.text);
					var $cloud1 = $('<i></i>').addClass('cloud1');
					var $cloud2 = $('<i></i>').addClass('cloud2');
					$modelBox.append($div).prepend($cloud1).append($cloud2);
					break;
				case 'moreTitle':
					//更多的标题类型
					$modelBox.addClass(n.titleType);
					switch (n.titleType) {
						case 'type1':
							var $div = $('<div></div>');
							if (n.downText) {
								$div.html(n.upText + ' — ' + n.downText);
							} else {
								$div.html(n.upText);
							};
							if (n.fontColor) {
								$div.css('color', n.fontColor);
							};
							if (n.backColor) {
								$div.css('background-color', n.backColor);
							};
							$modelBox.append($div);
							break;
						case 'type2':
							if (n.upText) {
								var $h1 = $('<h1></h1>').html(n.upText);
								$modelBox.append($h1);
							};
							if (n.downText) {
								var $h2 = $('<h2></h2>').html(n.downText);
								$modelBox.append($h2);
							};
							if (n.fontColor) {
								$h1.css('color', n.fontColor);
								$('head').append('<style>.moreTitle h2:before,.moreTitle h2:after{ background-color:' + n.fontColor + ' }</style>');
							}
							break;
						case 'type3':
							var $fieldset = $('<fieldset></fieldset>').html(n.downText);
							var $legend = $('<legend></legend>').html(n.upText);
							$fieldset.prepend($legend);
							$modelBox.append($fieldset);
							if (n.fontColor) {
								$fieldset.css('border-color', n.fontColor);
								$legend.css('color', n.fontColor);
							}
							break;
						default:
							break;
					}

					break;
				case 'route':
					//路线
					if (n.List.length != 0) {
						$.each(n.List, function(j, m) {
							var $b = $('<b></b>').html(m.key + '：');
							var $span = $('<span></span>').html(m.value);
							$modelBox.append($('<p></p>').append($b).append($span));
						});
					}
					break;
				case 'titleWithIcon':
					//带图标的小标题
					var $i = $('<i></i>').css('background-image', 'url(' + n.iconURL + ')');
					var $h4 = $('<h4></h4>').html(n.text);
					$modelBox.append($i).append($h4);
					break;
				case 'pic':
					//图片文字模块
					var $img = $('<img />').attr('src', n.picUrl)
						.attr('data-preview-src', '')
						.attr('data-preview-group', '1');
					$modelBox.append($img);
					if (n.text.length != 0) {
						var $p = $('<p></p>').html(n.text);
						$modelBox.append($p);
					}
					break;
				case 'text':
					//文字
					$modelBox.append($('<p></p>').html(n.text));
					break;
				case 'textWithPoint':
					//前面带点的文字
					if (n.pointColor) {
						$('head').append('<style>.textWithPoint p:before{ background-color:' + n.pointColor + ' }</style>');
					}
					$modelBox.append($('<p></p>').html(n.text));
					break;
				case 'bubble':
					//气泡
					if (n.List.length != 0) {
						$.each(n.List, function(j, m) {
							var $b = $('<b></b>').html(m.key + '：');
							var $span = $('<span></span>').html(m.value);
							$modelBox.append($('<p></p>').append($b).append($span));
						});
					}
					break;
				case 'lines':
					//分割线
					$modelBox.css('background-color', n.color);
					break;
				case 'block':
					//留白
					$modelBox.css('height', n.height).css('margin-bottom', '0');
					break;
				default:
					break;
			}
			$padded.append($modelBox);
		});

		//下载链接
		if (This.shareFlag == 'true') {
			$('.downloadBox').show();
		}

	},
	init: function() {
		this.getInfoData();
	}
}