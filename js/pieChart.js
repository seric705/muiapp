//饼状图配置
// 基于准备好的dom，初始化echarts实例
var pieChart = echarts.init(document.getElementById('pieChart'), 'macarons');
// 指定图表的配置项和数据
var pieChartOption = {
	//调色盘
	color: ['#7f82eb', '#53adf9', '#f55b81', '#faa354', '#1cb618', '#e7be00', '#218ffe', '#8def78', '#f15af3', '#70f2ff'],
	//系列列表
	series: [{
		name: '按日统计',
		type: 'pie',
		radius: ['50%', '80%'],
		avoidLabelOverlap: false,
		label: {
			normal: {
				show: false,
				position: 'center'
			},
			emphasis: {
				show: true,
				formatter: "{b}\n{d}%",
				textStyle: {
					fontSize: '16'
				}
			}
		},
		labelLine: {
			normal: {
				show: false
			}
		},
		itemStyle: {
			emphasis: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)'
			}
		},
		data: [{
			value: 335,
			name: '景区一'
		}, {
			value: 310,
			name: '景区二'
		}, {
			value: 234,
			name: '景区三'
		}, {
			value: 135,
			name: '景区四'
		}, {
			value: 1548,
			name: '景区五'
		}, {
			value: 335,
			name: '景区六'
		}, {
			value: 310,
			name: '景区七'
		}, {
			value: 234,
			name: '景区八'
		}, {
			value: 135,
			name: '景区九'
		}, {
			value: 1548,
			name: '景区十'
		}]
	}]
};
// 使用刚指定的配置项和数据显示图表。
pieChart.setOption(pieChartOption);

