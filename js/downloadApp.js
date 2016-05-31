function is_Ios() {
	var ua = window.navigator.userAgent.toLowerCase();
	return !!ua.match(/\(i[^;]+;( U;)? cpu.+mac os x/);
};

function is_Android() {
	var ua = window.navigator.userAgent.toLowerCase();
	return ua.indexOf('android') > -1 || u.indexOf('linux') > -1;
};

function is_Weixin() {
	var ua = window.navigator.userAgent.toLowerCase();
	return (ua.match(/MicroMessenger/i) == "micromessenger");
};

function show_hide_pop() {
	var jsDownload = document.getElementById('js-download');
	if (jsDownload.style.display == 'block') {
		jsDownload.style.display = "none";
	} else {
		jsDownload.style.display = "block";
	}
};
$('.downloadBox button').on('click', function() {
	var This = this;
	if (is_Weixin()) {
		show_hide_pop();
	} else if (is_Ios()) {
		window.location.href = "https://appsto.re/cn/eF7I8.i";
//		window.location.href = "itms-services://?action=download-manifest&url=https://www.ailvgoserver.com/ailv3/app/ios_phone/ailv3.plist";
	} else {
		window.location.href = "http://www.ailvgoserver.com/ailv3/app/android_phone/ailvgo3.apk";
	};
});