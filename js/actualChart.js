//折线图
function ActualChart() {
	//接口地址
	this.jsonURL = '../json/statHourlyPeopleTraffic.json';
	//查询日期
	this.queryDate = '';
	//今日每时客流量列表
	this.todayList = [];
	//昨日每时客流量列表
	this.yesterdayList = [];
	//上周每时客流量列表
	this.lastweekdayList = [];
	//横坐标数据列表
	this.xdata = [];
	// 基于准备好的dom，初始化echarts实例
	this.chart = echarts.init(document.getElementById('actualChart'), 'macarons');
	// 指定图表的配置项和数据
	this.option = {
		//提示框
		tooltip: {
			trigger: 'axis',
		},
		//图例
		legend: {
			bottom: 0,
			left: 10,
			data: ['昨日同比', '上周同比'],
			selected: {
				'实时数据': true,
				'昨日同比': false,
				'上周同比': false
			}
		},
		//直角坐标系 grid 中的 x 轴
		xAxis: {
			//两端留白策略
			boundaryGap: false,
			data: ["0点", "1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点", "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点", "24点"]
		},
		yAxis: {},
		//系列列表
		series: [{
			name: '实时数据',
			type: 'line',
			smooth: false,
			areaStyle: {
				normal: {
					color: '#eaf5fe'
				}
			},
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

		}, {
			name: '昨日同比',
			type: 'line',
			smooth: false,
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}, {
			name: '上周同比',
			type: 'line',
			smooth: false,
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}],
		//数据更新动画时长
		animationDurationUpdate: 1000
	};
	// 使用刚指定的配置项和数据显示图表。
	this.chart.setOption(this.option);
	//显示Loading动画
	this.chart.showLoading();
	//根据日期设置数据
	this.setDataByDate();
};

ActualChart.prototype = {
	//根据日期设置数据
	setDataByDate: function() {
		var This = this;
		This.queryDate = $('#actualBox .pickDate input').val();
		console.log('ActualChart:'+This.queryDate);
		$.getJSON(This.jsonURL, {
			statDate: This.queryDate
		}, function(data) {
			//			console.log(JSON.stringify(data));
			if (data.code == '0') {
				This.todayList = This.createArrayByIndex(data.data.todayList, 'traffic', '');
				This.yesterdayList = This.createArrayByIndex(data.data.yesterdayList, 'traffic', '');
				This.lastweekdayList = This.createArrayByIndex(data.data.lastweekdayList, 'traffic', '');
				This.xdata = This.createArrayByIndex(data.data.todayList, 'hour', '点');
				//隐藏Loading动画
				This.chart.hideLoading();
				//填充图表
				This.setChartData();
				//填充表格
				This.setTableData();

			};
		}).fail(function(e) {
			console.log(e);
		});
	},
	//填充图表
	setChartData: function() {
		var This = this;
		This.chart.setOption({
			xAxis: {
				data: This.xdata
			},
			series: [{
				name: '实时数据',
				data: This.todayList

			}, {
				name: '昨日同比',
				data: This.yesterdayList
			}, {
				name: '上周同比',
				data: This.lastweekdayList
			}]
		});
	},
	//填充表格
	setTableData: function() {
		var This = this;
		//展示列表
		var $dataTable = $('#actualBox tbody').empty();
		for (var i = 0; i < This.todayList.length; i++) {
			var $tr = $('<tr><td>' + This.xdata[i] + '</td><td class="blue">' + This.todayList[i] + '</td><td>' + This.yesterdayList[i] + '</td><td>' + This.lastweekdayList[i] + '</td></tr>');
			$dataTable.append($tr);
		};
	},
	//根据字段名从参数数组中取指定字段组成新的数据
	createArrayByIndex: function(list, index, addString) {
		var newArray = [];
		$.each(list, function(i, n) {
			newArray.push(n[index] + addString);
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
	}

}