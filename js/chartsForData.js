$(function() {
	//获取当前时间(如:2009-06-12)
	function CurentTime() {
		var now = new Date();
		var year = now.getFullYear(); //年
		var month = now.getMonth() + 1; //月
		var day = now.getDate(); //日
		var clock = year + "-";
		if (month < 10)
			clock += "0";
		clock += month + "-";
		if (day < 10)
			clock += "0";
		clock += day + " ";
		return (clock);
	};
	//选择日期组件格式化
	var def_args = {
		preset: 'date',
		theme: 'android-ics light',
		display: 'modal',
		mode: 'scroller',
		lang: 'zh',
		startYear: '1977',
		endYear: '2037',
		onBeforeShow: function() {
			//需要先关闭图表tip框，会重叠
			actualChart.chart.dispatchAction({
				type: 'hideTip'
			});
		}
	};
	//初始化选择日期组件
	$('.pickDate input').scroller('destroy').scroller(def_args);
	//获取最新客流量
	var lastTraffic = new LastTraffic();
	//获取当前时间
	var nowDate = CurentTime();
	//初始化所有日期控件为当前日期
	$('.pickDate input').val(nowDate);
	//初始化折线图
	var actualChart = new ActualChart();
	//折线图监听
	$('#actualBox').on('change', '.pickDate input', function() {
		//监听折线图日期变化
		actualChart.setDataByDate();
	}).on('click', 'button', function() {
		//监听折线图数据切换按钮
		actualChart.changeShow(this);
	});
	//初始化柱状图
	var totalChart = new TotalChart();
	//柱状图监听
	$('#totalBox').on('change', '.pickDate input', function() {
		//监听折线图日期变化
		totalChart.setDataByDate();
	}).on('click', 'button', function() {
		//监听折线图数据切换按钮
		totalChart.changeShow(this);
	});
	//监听柱状图切换图例
	totalChart.chart.on('legendselectchanged', function(params) {
		totalChart.changeLegend(params);
	});

});