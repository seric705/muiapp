//柱形图
function TotalChart() {
	//按日统计接口地址
	this.dailyURL = '../json/statDailyPeopleTraffic.json';
	//按周统计接口地址
	this.weeklyURL = '../json/statWeeklyPeopleTraffic.json';
	//查询日期
	this.queryDate = '';
	//每日客流量列表
	this.dailyValueList = [];
	//每日客流量横坐标数据列表
	this.dailyNameList = [];
	//每周客流量列表
	this.weeklyValueList = [];
	//每周客流量横坐标数据列表
	this.weeklyNameList = [];
	// 基于准备好的dom，初始化echarts实例
	this.chart = echarts.init(document.getElementById('totalChart'), 'macarons');
	// 指定图表的配置项和数据
	this.option = {
		//图例
		legend: {
			bottom: 0,
			left: 10,
			data: [{
				name: '按日统计',
				icon: 'circle'
			}, {
				name: '按周统计',
				icon: 'circle'
			}],
			selectedMode: 'single'
		},
		//提示框
		tooltip: {
			position: 'top',
			formatter: '时间：{b}<br />客流量：{c}'
		},
		xAxis: {
			data: []
		},
		yAxis: {},
		//系列列表
		series: [{
			name: '按日统计',
			type: 'bar',
			data: [],
			itemStyle: {
				normal: {
					barBorderRadius: 5
				}
			},
			barMaxWidth: 20
		}, {
			name: '按周统计',
			type: 'bar',
			data: [],
			itemStyle: {
				normal: {
					barBorderRadius: 5
				}
			},
			barMaxWidth: 20
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	this.chart.setOption(this.option);
	//显示Loading动画
	this.chart.showLoading();
	//根据日期设置数据
	this.setDataByDate();
};

TotalChart.prototype = {
	//根据日期设置数据
	setDataByDate: function() {
		var This = this;
		//更改图例选中状态为'按日统计'
		This.chart.dispatchAction({
			type: 'legendSelect',
			// 图例名称
			name: '按日统计'
		});
		//获取日期
		This.queryDate = $('#totalBox .pickDate input').val();
		console.log('TotalChart:' + This.queryDate);
		This.getDailyData();
		This.getWeeklyData();
	},
	//获取并设置每日客流量
	getDailyData: function() {
		var This = this;
		$.getJSON(This.dailyURL, {
			statDate: This.queryDate
		}, function(data) {
			console.log(JSON.stringify(data));
			if (data.code == '0') {
				This.dailyValueList = This.createArrayByIndex(data.data, 'traffic', '');
				This.dailyNameList = This.createArrayByIndex(data.data, 'date', '');
				//隐藏Loading动画
				This.chart.hideLoading();
				//填充图表
				This.setChartData(This.dailyNameList);
				//填充表格
				This.setTableData('按日统计');
			};
		}).fail(function(e) {
			console.log(e);
		});
	},
	//获取每周客流量
	getWeeklyData: function() {
		var This = this;
		$.getJSON(This.weeklyURL, {
			statDate: This.queryDate
		}, function(data) {
			console.log(JSON.stringify(data));
			if (data.code == '0') {
				This.weeklyValueList = This.createArrayByIndex(data.data, 'traffic', '');
				This.weeklyNameList = This.createDateArray(data.data);
			};
		}).fail(function(e) {
			console.log(e);
		});
	},
	//填充图表,参数x轴名称数组
	setChartData: function(xAxisData) {
		var This = this;
		This.chart.setOption({
			xAxis: {
				data: xAxisData
			},
			series: [{
				name: '按日统计',
				data: This.dailyValueList

			}, {
				name: '按周统计',
				data: This.weeklyValueList
			}]
		});
	},
	//填充表格
	setTableData: function(dataType) {
		var This = this;
		//展示列表
		var $dataTable = $('#totalBox tbody').empty();
		if (dataType == '按日统计') {
			for (var i = 0; i < This.dailyValueList.length; i++) {
				var $tr = $('<tr><td>' + This.dailyNameList[i] + '</td><td class="blue">' + This.dailyValueList[i] + '</td></tr>');
				$dataTable.append($tr);
			};
		} else {
			for (var i = 0; i < This.weeklyValueList.length; i++) {
				var $tr = $('<tr><td>' + This.weeklyNameList[i] + '</td><td class="blue">' + This.weeklyValueList[i] + '</td></tr>');
				$dataTable.append($tr);
			};
		};
	},
	//根据字段名从参数数组中取指定字段组成新的数据
	createArrayByIndex: function(list, index, addString) {
		var newArray = [];
		$.each(list, function(i, n) {
			if (index == 'date') {
				newArray.push(n[index].substr(5,2)+'.'+n[index].substr(8,2) + addString);
			} else {
				newArray.push(n[index] + addString);
			}

		});
		return newArray;
	},
	//拼接开始时间和结束时间组成新数组
	createDateArray: function(list) {
		var newArray = [];
		$.each(list, function(i, n) {
			var beginDate = n.beginDate.substr(5,2)+'.'+n.beginDate.substr(8,2);
			var endDate = n.endDate.substr(5,2)+'.'+n.endDate.substr(8,2)
			newArray.push(beginDate + '-' + endDate);
		});
		return newArray;
	},
	//图表数据切换
	changeShow: function(element) {
		var $element = $(element);
		$element.addClass('checked').siblings('button').removeClass('checked');
		var btnType = $element.attr('data-type');
		var echarts = $element.parents('.chartsBox').find('.echarts');
		var dataTable = $element.parents('.chartsBox').find('.dataTable');
		switch (btnType) {
			case 'showTableBtn':
				echarts.hide();
				dataTable.css('display', 'block');
				break;
			case 'showChartsBtn':
				echarts.show();
				dataTable.hide();
				break;
		};
	},
	//用户切换图例，根据选中状态切换X轴显示数据和表格数据
	changeLegend: function(params) {
		if (params.name == '按日统计') {
			this.setChartData(this.dailyNameList);
		} else {
			this.setChartData(this.weeklyNameList);
		};
		this.setTableData(params.name);
	}
};