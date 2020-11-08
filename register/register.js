var data = JSON.parse(sessionStorage.getItem('data'));
var userList = data.userList;

// 控制协议
(function() {
	$('.protocol-top>i').on('click', function() {
		window.location.href = '../index/index.html';
	});
	
	$('span.btn-cancel').on('click', function() {
		window.location.href = '../index/index.html';
	});
	
	$('span.btn-agree').on('click', function() {
		$('.register-protocol').removeClass('active');
		$('.curtain').removeClass('active');
	});
})();

// 获取设置的账号密码
(function() {
	$('.form-item-wrapper>span.register').on('click', function() {
		var form = document.forms['register'];
		var obj = {
			id: userList[userList.length-1].id + 1,
		};
		
		var inputTestNum = $('input.test-num').val().trim();
		if(!!userList.find(function(item) { return item.name === form.name.value; })) {
			Message.notice('用户名已存在！');
			return;
		}
		obj.name = form.name.value;
		
		if(form.pwd.value !== form.rePwd.value) {
			Message.notice('两次密码不一致！');
			return;
		}
		obj.pwd = form.pwd.value;
		if(!!userList.find(function(item) { return item.phone === form.phone.value;})) {
			Message.notice('该手机号已被使用！');
			return;
		}
		obj.phone = form.phone.value;
		
		if(form.test.value !== form.test.dataset.val) {
			Message.notice('图片验证码出错！');
			return;
		}
		
		if(inputTestNum === '获取验证码' || inputTestNum.toUpperCase() !== $('span.test').text()) {
			Message.notice('获取验证码错误');
			return;
		}
		
		userList.push(obj);
		sessionStorage.setItem('data',JSON.stringify(data));
		window.location.href = '../login/login.html';
	});
	
})();

// 获取验证码
(function() {
	$('span.test').on('click', function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		$(this).text(codeStr);
	});
})();










































