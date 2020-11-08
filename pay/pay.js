var data = JSON.parse(sessionStorage.getItem('data'));
var id = parseInt(window.location.search.slice(window.location.search.indexOf('=') + 1));
var orderList = data.orderList;
var addressList = data.addressList;

// 头部
(function() {
	if(Cookies.get('user')) {
		$('.top-mid-left').innerHTML = `
			<span>您好! <span class="user-name">${ Cookies.get('user') }  </span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="#" class='exit-login'>退出登录</a>
		`;
		$('a.exit-login').onclick = function() {
			Cookies.remove('user');
			Cookies.remove('pcount');
			window.location.href = window.location.href;
		};
	}
	else
	{
		Cookies.set('backUrl',window.location.href);
		$('.top-mid-left').innerHTML = `
			<span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="../login/login.html">请登录</a>
			<a href="../register/register.html">免费注册</a>
		`;
	}
})();

// 用户信息展示
(function() {
	var order = orderList.find(item => item.id === id);
	var address = addressList.find(item => item.id === order.addressId);
	$('.should-price>span.price').text(`￥${ order.account.toFixed(2) }`);
	$('.product-message>span.person').text(`
		${ address.receiveName }  ${ address.receivePhone } ${ address.receiveRegion } ${ address.receiveAddress }
	`);
	$('.pay>.content-wrapper>.end-pay>span.account').text(`￥${ order.account.toFixed(2) }`);
	$('.order-num>span.num').text(`${ id }`);
})();

// 支付方式绑定点击事件
(function() {
	$('.pay-way>.content>ul>li').on('click', function() {
		if($(this).hasClass('active')) return;
		$(this).addClass('active').siblings('.active').removeClass('active');
	});
})();

var hour = 0.5;
var payTimer = null;
var endTime = [0,0,0,0];
// 倒计时
function timer() {
	payTimer = setInterval(function() {
		var orderDate = orderList.find(item => item.id === id).date;
		var endDate = orderDate + hour*3600000;
		var newDate = new Date().getTime();
		var time = endDate - newDate;
		if(time <= 0) {
			Message.notice('订单超时，请重新购买');
			window.location.replace('../index/index.html');
		};
		var firstValue = Math.floor(time/60000/10);
		var secondValue = Math.floor(time/60000%10);
		var thirdValue = Math.floor(time%60000/1000/10);
		var fourthValue = Math.floor(time%60000/1000%10);
		$('.base-info>.timer>span.timer-minute-a').text(firstValue);
		$('.base-info>.timer>span.timer-minute-b').text(secondValue);
		$('.base-info>.timer>span.timer-second-a').text(thirdValue);
		$('.base-info>.timer>span.timer-second-b').text(fourthValue);
	}, 1000);
}

(function() {
	timer();
})();

// 支付
(function() {
	$('.pay-way>.content>span.btn-next').on('click', function() {
		$('.pay').add($('.curtain')).addClass('active');
		var order = orderList.find(item => item.id === id);
		if(order.isPay) $('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').text('已支付');
	});
	$('.pay>.icon-wrapper>i').on('click', function() {
		$(this).parent().parent().removeClass('active');
		$('.curtain').removeClass('active');
	});
	$('.pay>.content-wrapper>.btn-wrapper>span.btn-cancel').on('click', function() {
		$('.pay').add($('.curtain')).removeClass('active');
	});
	$('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').on('click', function() {
		var order = orderList.find(item => item.id === id);
		if(order.isPay) return;
		Message.confirm('确定支付吗？',function() {
			$('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').text('已支付');
			$('.base-info>span.icon-top').text(`订单已支付，等待发货中`);
			$('.base-info>span.icon-bottom').text(`尊敬的顾客，感谢您的光顾，以后请多多支持`).css({
				marginLeft: '-225px'
			});
			$('.base-info>.timer>span.timer-minute-a').text(endTime[0]);
			$('.base-info>.timer>span.timer-minute-b').text(endTime[1]);
			$('.base-info>.timer>span.timer-second-a').text(endTime[2]);
			$('.base-info>.timer>span.timer-second-b').text(endTime[3]);
			clearInterval(payTimer);
			order.isPay = true;
			sessionStorage.setItem('data',JSON.stringify(data));
		});
	});
})();