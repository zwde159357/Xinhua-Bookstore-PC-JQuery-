// 获取验证码
(function() {
	$('span.test-number').on('click', function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		$(this).text(codeStr);
	});
})();

// 登录方式切换
(function() {
	$('.content-top>ul>li').on('click', function() {
		if($(this).hasClass('active')) return;
		$(this).addClass('active').siblings('.active').removeClass('active');
		$('.content-bottom>.login.active').removeClass('active');
		$('.content-bottom>.login').eq($(this).index()).addClass('active');
	});
})();

// 用户名密码登录
(function() {
	$('span.btn-login-pwd').on('click', function() {
		var name = $('.login-pwd>input.name').val();
		var pwd = $('input.pwd').val();
		var userList = JSON.parse(sessionStorage.getItem('data')).userList;
		var pcount = 0;
		if(userList.some(item => item.name === name && item.pwd === pwd)) {
			Cookies.set('user',name);
			var backUrl = Cookies.get('backUrl');
			JSON.parse(sessionStorage.getItem('data')).cartList.filter(function(item) 
			{return item.name === name;}).forEach(function(item) {
				pcount += item.count;
			});
			Cookies.set('pcount',pcount);
			Cookies.remove('backUrl');
			window.location.replace(backUrl || '../index/index.html');
		}
		else {
			Message.notice('用户名或密码错误');
		}
	});
})();

// 手机号登录
(function() {
	$('.btn-login-phone').on('click', function() {
		var phone = $('.login-test>input.phone').val().trim();
		var pictureTest = $('input.picture-test').val().trim();
		var test = $('input.test').val().trim();
		if(pictureTest !== $('input.picture-test').attr('data-val')) {
			Message.notice('图片验证码错误');
			return;
		}
		if(test === '获取验证码' || test.toUpperCase() !== $('span.test-number').text()) {
			Message.notice('获取验证码错误');
			return;
		}
		if(!$('input.protocol').attr('checked')) {
			Message.notice('未勾选协议');
			return;
		}
		var userList = JSON.parse(sessionStorage.getItem('data')).userList;
		var name = userList.find(item => item.phone === phone).name;
		var pcount = 0;
		if(userList.some(item => item.phone === phone)) {
			Cookies.set('user',name);
			var backUrl = Cookies.get('backUrl');
			Cookies.remove('backUrl');
			JSON.parse(sessionStorage.getItem('data')).cartList.filter(function(item)
			{return item.name === name;}).forEach(function(item) {
				pcount += item.count;
			});
			Cookies.set('pcount',pcount);
			window.location.replace(backUrl || '../index/index.html');
		}
		else {
			Message.notice('手机号不存在');
		}
	});
})();













































