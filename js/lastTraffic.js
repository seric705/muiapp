//统计最新客流量
function LastTraffic() {
	//接口地址
	this.jsonURL = '../json/statLatestPeopleTraffic.json';
	//初始化
	this.getAndSetData();
};
LastTraffic.prototype = {
	//获取并填充数据
	getAndSetData: function() {
		var This = this;
		$.getJSON(This.jsonURL, {}, function(data) {
			console.log(JSON.stringify(data));
			if (data.code == '0') {
				//填充页面
				$('#lastTraffic .total b').empty().html(data.data.total);
				$('#lastTraffic .current b').empty().html(data.data.current);
				$('#lastTraffic .updataTime').empty().html('更新时间：' + data.data.time);
			};
		}).fail(function(e) {
			console.log(e);
		});
	}
}