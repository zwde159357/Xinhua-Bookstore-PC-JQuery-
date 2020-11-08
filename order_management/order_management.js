var data = JSON.parse(sessionStorage.getItem('data'));
// 确保用户当前是登录
var userName = Cookies.get('user');
if(typeof userName === 'undefined') {
	Cookies.set('backUrl',window.location.href);
	window.location.href = '../login/login.html';
}

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

// 获取用户购物车内商品
(function() {
	var pcount = Cookies.get('pcount');
	$('span.product-count').text(pcount);
})();

// 绑定点击事件
(function() {
	$('.personal-content>.nav>ul>li:nth-child(1)>ul>li:nth-child(1)').on('click', function() {
		window.location.href = '../order_management/order_management.html';
	});
	$('.personal-content>.nav>ul>li:nth-child(3)>ul>li:nth-child(5)').on('click', function() {
		window.location.href = '../address/address.html';
	});
})();

// 所有订单
function display(orderList1) {
	if($('.order-title>ul>li:nth-child(2)>a').hasClass('active'))
		var orderList = orderList1.filter(item => item.name === userName && item.isPay === false);
	else if($('.order-title>ul>li:nth-child(3)>a').hasClass('active'))
		var orderList = orderList1.filter(item => item.name === userName && item.isPay === true);
	else
		var orderList = orderList1.filter(item => item.name === userName);
	
	$('.order-content>.order-list>table').children().remove();
	$(`
		<thead>
			<tr>
				<th>商品信息</th>
				<th>实付款(元)</th>
				<th>交易状态</th>
				<th>交易操作</th>
			</tr>
		</thead>
	`).appendTo('.order-content>.order-list>table');
	
	orderList.forEach((item,j) => {
		$(`
			<tbody class="text-null">
				<tr>
					<td></td>
				</tr>
			</tbody>
			<tbody class="text-content" data-id = '${ item.id }' data-default = '${ item.isPay }'>
				<tr class="top">
					<td colspan="4">
						<span class="time">下单时间：${ item.date }</span>
						<span class="id">订单编号：${ item.id }</span>
						<span class="shop">商家：新华书店网上商城自营图书</span>
						<span class="btn-contact">联系客服</span>
					</td>
				</tr>
			</tbody>
		`).appendTo('.order-content>.order-list>table');
		item.detail.forEach((item2,i) => { 
			var product = data.productList.find(item3 => item3.id === item2.pid);
			var $tbody = $('.order-content>.order-list>table tbody.text-content');
			
			if(i === 0) {
				$(`
					<tr class="middle" data-id = '${ item.id }'>
						<td>
							<div class="image-wrapper">
								<img src="${ product.image }" alt="" />
							</div>
							<span class="name">${ product.name } </span>
							<span class="price">￥${ product.price }</span>
							<span class="count">Ｘ${ item2.count }</span>
						</td>
						<td rowspan="${ item.detail.length }">
							<span class="account">￥${ item.account.toFixed(2) }</span>
						</td>
						<td rowspan="${ item.detail.length }">
							<span class="text">${ item.isPay ? '订单待发货' : '订单待支付' }</span><br>
							<a href="#">查看订单详情</a>
						</td>
						<td rowspan="${ item.detail.length }" class='last'>
							${ item.isPay ? '' : "<span class='timer'></span>"}
							${ item.isPay ? '' : "<span class='operate'>支付</span>" }
						</td>
					</tr>
				`).appendTo($tbody.eq(j));
			}
			else {
				$(`
					<tr class="middle">
						<td>
							<div class="image-wrapper">
								<img src="${ product.image }" alt="" />
							</div>
							<span class="name">${ product.name } </span>
							<span class="price">￥${ product.price.toFixed(2) }</span>
							<span class="count">Ｘ${ item2.count }</span>
						</td>
					</tr>
				`).appendTo($tbody.eq(j));
			}
		});
	});
}

function countNum() {
	var orderList1 = data.orderList;
	var m = 0, n = 0;
	orderList1.forEach((item,j) => {
		$('.order-title>ul>li>a>span.no-pay').text(n);
		if(item.isPay) $('.order-title>ul>li>a>span.no-give').text(++m);
		else $('.order-title>ul>li>a>span.no-pay').text(++n);
	});
	display(orderList1);
}

// 选项卡切换
(function() {
	$('.order-title>ul>li>a').on('click', function() {
		if($(this).hasClass('active')) return;
		$(this).addClass('active').parent().siblings().find('.active').removeClass('active');
		if($(this).find('span').text() === '0') {
			if($('.order-null').hasClass('active')) return;
			$('.order-content').removeClass('active');
			$('.order-null').addClass('active');
		}
		else if($(this).find('span').text() === '') {
			$('.order-null').removeClass('active');
			$('.order-content').eq($(this).index()).addClass('active');
			var orderList1 = data.orderList;
			display(orderList1);
			dateCaculate();
			pay();
			clock();
		}
		else {
			$('.order-content').removeClass('active');
			$('.order-null').removeClass('active');
			$('.order-content').eq($(this).index()).addClass('active');
			var orderList1 = data.orderList;
			display(orderList1);
			dateCaculate();
			pay();
			clock();
		}
	});
})();

// 支付
function pay() {
	$('.text-content').each(function(i,item) {
		if($(item).attr('data-default') === 'true') return;
		$(item).find('span.operate').on('click', function() {
			$('.pay').add('.curtain').addClass('active');
			var orderList2 = data.orderList;
			var id = $(item).attr('data-id');
			var order = orderList2.find(item => item.id === parseInt(id));
			$('.pay>.content-wrapper>.end-pay>span.account').text(`￥${ order.account.toFixed(2) }`);
		});
		$('.pay>.icon-wrapper>i').on('click', function() {
			$(this).parent().parent().removeClass('active');
			$('.curtain').removeClass('active');
		});
		$('.pay>ul.pay-way>li').on('click', function() {
			if($(this).hasClass('active')) return;
			$(this).addClass('active').siblings('.active').removeClass('active');
		});
		$('.pay>.content-wrapper>.btn-wrapper>span.btn-cancel').on('click', function() {
			$('.pay').removeClass('active');
			$('.curtain').removeClass('active');
		});
		$('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').on('click', function() {
			Message.confirm('确定支付吗？',function() {
				$('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').text('已支付');
				var orderList = data.orderList;
				var id = $(item).attr('data-id');
				var order = orderList.find(item => item.id === parseInt(id));
				order.isPay = true;
				sessionStorage.setItem('data',JSON.stringify(data));
				$(item).find('.text-content>tr.middle>td>span.text').text('订单已支付');
				$(item).find('.text-content>tr.middle>td.last').children().remove();
				display(data.orderList);
				countNum();
				window.location.href = window.location.href;
			});
		});
	});
}

var hour = 0.5;
// 倒计时
function clock() {
	$('.text-content').each(function(i, item) {
		if($(item).attr('default') === 'true') return;
		var orderList = data.orderList;
		var $timer = $(item).find('span.timer');
		var id = $(item).attr('data-id');
		var orderDate = orderList.find(item1 => item1.id === parseInt(id)).date;
		var endDate = orderDate + hour*3600000;
		var newDate = new Date().getTime();
		var time  = endDate - newDate;
		var clearTimer = null; // 不能生成全局变量
		clearTimer = setInterval(function() {
			var newDate = new Date().getTime();
			var time  = endDate - newDate;
			var firstValue = Math.floor(time/60000/10);
			var secondValue = Math.floor(time/60000%10);
			var thirdValue = Math.floor(time%60000/1000/10);
			var fourthValue = Math.floor(time%60000/1000%10);
			$timer.text(`${firstValue}${secondValue} : ${thirdValue}${fourthValue}`);
			if(time <= 0) {
				window.clearInterval(clearTimer);
				clearTimer = null;
				var order = orderList.find(item => item.id === parseInt(id));
				order.isPay = false;
				sessionStorage.setItem('data',JSON.stringify(data));
				$(item).find('td>span.text').text('订单已关闭');
				$(item).find('td.last').children().remove();
			}	
		}, 1000);
	});
}


// 计算日期
function dateCaculate() {
	$('.text-content').each(function(i,item) {
		var orderList = data.orderList;
		var timer = $(item).find('span.timer');
		var id = $(item).attr('data-id');
		
		date = orderList.find(item => item.id === parseInt(id)).date;
		var time = new Date(date);
		
		var year = time.getFullYear();
		var month = time.getMonth()+1;
		if(month < 10) {
			month = '0' + month;
		}
		var day = time.getDate();
		if(day < 10) {
			day = '0' + day;
		}
		var hour = time.getHours();
		if(hour < 10) {
			hour = '0' + hour;
		}
		var minute = time.getMinutes();
		if(minute < 10) {
			minute = '0' + minute;
		}
		var second = time.getSeconds();
		if(second < 10) {
			second = '0' + second;
		}
		$(item).find('tr.top>td>span.time').text(`下单时间：${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`);
	});
}

(function() {
	countNum();
	dateCaculate();
	clock();
	pay();
})();













