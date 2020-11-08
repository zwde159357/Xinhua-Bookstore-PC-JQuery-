var data = JSON.parse(sessionStorage.getItem('data'));

// 头部
(function() {
	if(Cookies.get('user')) {
		$(`
			<span>您好! <span class="user-name">${ Cookies.get('user') }  </span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="#" class='exit-login'>退出登录</a>
		`).appendTo('.top-mid-left');
		$('a.exit-login').on('click',function() {
			Cookies.remove('user');
			Cookies.remove('pcount');
			window.location.href = window.location.href;
		});
	}
	else
	{
		$(`
			<span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="../login/login.html">请登录</a>
			<a href="../register/register.html">免费注册</a>
		`).appendTo('.top-mid-left');
	}
})();

// 1.确保用户当前是登录
var userName = Cookies.get('user');
if(typeof userName === 'undefined') {
	Cookies.set('backUrl',window.location.href);
	window.location.href = '../login/login.html';
}

// 分类
(function() {
	data.categoryList.filter(item => item.fid === 0).forEach((item,i) => {
		// 主菜单
		$(`
			<li>
				<a href='#'>
					${ item.name }
				</a>
			</li>
		`).appendTo('ul.category-main');
		
		$(`
			<ul class='category-bott'></ul>
		`).appendTo(`ul.category-main>li:eq(${ i })`);
		
		data.categoryList.filter(item2 => item2.tid === item.id).forEach((item2,j) => {
			// 二级菜单
			$(`
				<li>
					<a href='#'>
						${ item2.name }
					</a>
				</li>
			`).appendTo(`ul.category-main>li:eq(${ i })>ul`);
		});
		
		$(`<ul class='category-sub'></ul>`).appendTo(`ul.category-main>li:eq(${ i })`);
		
		var subCategoryList = data.categoryList.filter(item2 => item2.fid === item.id);
		// 二级菜单出现位置
		if(i*50 <= 600) {
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({
				top:  i * 50
			});
		}
		else {
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({
				top: 300
			});
		}
		if(subCategoryList.length === 0) {
			$(`
				<li>暂无相关信息</li>
			`).appendTo(`ul.category-main>li:eq(${ i }>ul.category-sub)`);
		}
		else {
			// 第二级菜单
			subCategoryList.forEach(function(item2,j) {
				if(item2.id === 12 || item2.id === 16) {
					$(`
						<li>
							<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
						</li>
					`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub`);
				}
				else{
					$(`
						<li>
							<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
						</li>
					`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub`);
				}
				// 第三级菜单
				$(`
					<ul></ul>
				`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub>li:eq(${ j })`);
				data.categoryList.filter(item3 => item3.fid === item2.id).forEach(function(item3) {
					$(`
						<li>
							<a href='#'>${ item3.name }</a>
						</li>
					`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub>li:eq(${ j })>ul`);
				});
			});
		}
	});
})();

// 2.根据用户名找出用户购物车的信息并展示
var productList = data.productList;
var cartList = data.cartList;
var categoryList = data.categoryList;


//公共的函数，更新当前购物车的总金额和总数量
function updateTotalAndAccount() {
	var total = 0, account = 0;
	$('table.cart-list>tbody>tr').each(function(i, tr) {
		if($(tr).attr('data-checked') === '1') {
			total += parseInt($(tr).attr('data-count'));
			account += parseFloat($(tr).attr('data-price')) * parseInt($(tr).attr('data-count'));
		}
	});
	
	$('span.account').text(account.toFixed(2));
	$('span.total').text(total);
	$('span.all-product>span.product-count').text(total);	
	Cookies.set('pcount',total);
}

//展示用户购物车中的商品信息
(function() {
	var userCartList = cartList.filter(item => item.name === userName);
	//判断购物车是否为空
	if(userCartList.length > 0)
		$('.cart-list-middle').addClass('show'); 
	else
		$('.cart-empty').addClass('show'); 
	
	//展示用户购物车中的商品信息
	userCartList.forEach((item) => {
		//找一个
		var product = productList.find(item2 => item2.id === item.pid);
		$(`
			<tr data-id='${ item.id }' data-checked='1' data-price='${ product.price }' data-count='${ item.count }'>
				<td><i class='checkbox checked'></i></td>
				<td><img src='${ product.image }'></td>
				<td><span class='product-name'>${ product.name }</span></td>
				<td>￥<span class='product-price'>${ product.price }</span>元</td>
				<td>
					<span class="btn-decrease ${ item.count === 1 ? 'disabled' : ''}">-</span>
					<span class='count'>${ item.count }</span>
					<span class="btn-increase ${ item.count === 6 ? 'disabled' : ''}">+</span>
				</td>
				<td>￥<span class='product-price-all'>${ (parseFloat(product.price) * item.count).toFixed(2) }</span>元</td>
				<td><span class='btn-remove'>删除<span></td>
			</tr>
		`).appendTo('table.cart-list>tbody');
	});
	updateTotalAndAccount();
})();


// 3.删除
(function() {
	// 与用户沟通 确定返回bool值为真
	$('span.btn-remove').on('click', function() {
		Message.confirm('真删除吗???', () => {
			var $tr = $(this).parent().parent();
			var id = parseInt($tr.attr('data-id'));
			
			$tr.remove();
			var i = cartList.findIndex(item => item.id === id);
			cartList.splice(i,1);
			sessionStorage.setItem('data',JSON.stringify(data));
			
			// 如果当前删除的时勾选的购物记录,则需要更新总金额和总数量
			if($tr.attr('data-checked') === '1') updateTotalAndAccount();
			Message.notice("删除成功");
		});
	});
})();

// 4.数量加减功能
(function() {
	// 减功能
	$('span.btn-decrease').on('click', function() {
		var $tr = $(this).parent().parent();
		var count = parseInt($tr.attr('data-count'));
		var id = parseInt($tr.attr('data-id'));
		
		if(count === 1) return;
		count--;
		// 联动
		$(this).siblings('.btn-increase').removeClass('disabled');
		$(this).toggleClass('disabled', count === 1);
		$(this).siblings('.count').text(count);
		
		$tr.find('td').find('span.product-price-all').text((count * $tr.attr('data-price')).toFixed(2));
		$tr.attr('data-count', count);
		if($tr.attr('data-checked') === '1') updateTotalAndAccount();
		
		//数据的更新
		var cart = cartList.find(item2 => item2.id === id);
		cart.count = count;
		sessionStorage.setItem('data',JSON.stringify(data));
	});
	
	// 加效果
	$('span.btn-increase').on('click', function() {
		var $tr = $(this).parent().parent();
		var count = parseInt($tr.attr('data-count'));
		var id = parseInt($tr.attr('data-id'));
		
		if(count === 6) return;
		count++;
		// 联动
		$(this).siblings('.btn-decrease').removeClass('disabled');
		$(this).toggleClass('disabled', count === 6);
		$(this).siblings('.count').text(count);
		
		$tr.find('td').find('span.product-price-all').text((count * $tr.attr('data-price')).toFixed(2));
		$tr.attr('data-count', count);
		if($tr.attr('data-checked') === '1') updateTotalAndAccount();
		
		//数据的更新
		var cart = cartList.find(item2 => item2.id === id);
		cart.count = count;
		sessionStorage.setItem('data',JSON.stringify(data));
	});
})();

// 单选复选
(function() {
	//行勾选
	$('td>i.checkbox').on('click', function() {
		var $tr = $(this).parent().parent();
		if($(this).hasClass('checked')) {
			$(this).removeClass('checked');
			$tr.attr('data-checked', '0');
		}
		else {
			$(this).addClass('checked');
			$tr.attr('data-checked', '1');
		}
		updateTotalAndAccount();
		updateCheckBoxAll();
	});
	
	// 给全选按钮绑定点击事件
	$('i.checkbox.all').on('click', function() {
		if($(this).hasClass('checked')) {
			$(this).removeClass('checked');
			$('tbody>tr').each(function(i, item) {
				$(item).attr('data-checked', '0');
				$('i.checkbox').removeClass('checked');
			});
		}
		else {
			$(this).addClass('checked');
			$('tbody>tr').each(function(i, item) {
				$(item).attr('data-checked', '1');
				if($('i.checkbox').hasClass('checked'))
					$('i.checkbox').addClass('checked');
			});
		}
		updateTotalAndAccount();
	});
})();

function updateCheckBoxAll() {
	//属性选择器  // 找出所有未选中的任务记录
	var $uncheckedTrs = $('tbody tr[data-checked = "0"]');
	$('i.checkbox.all').toggleClass('checked', $uncheckedTrs.length === 0);
}

//结算
(function() {
	$('button.settle').on('click', function() {
		var $checkedTrs = $('tbody>tr[data-checked = "1"]');	
		if($checkedTrs.length === 0) {
			Message.notice('没有勾选任何商品');
			return;
		}
		Message.confirm("确定购买吗？", function() {
			var settleIds = '';
			$checkedTrs.each(function(i, tr) {
				settleIds += $(tr).attr('data-id') + ',';
			});
			settleIds = settleIds.slice(0, -1);
			Cookies.set('settle', settleIds);
			
			for(var j = 0; j < settleIds.length; j++) {
				$checkedTrs.remove();
				$('.cart-list-middle').removeClass('show');
				$('.cart-empty').addClass('show');
			}
			
			window.location.href = '../order_confirm/order_confirm.html';
		});
	});
})();

// 新华推荐
(function() {
	var recommendList = data.recommendList;
	for(var i = 0; i < 12; i++) {
		var randomItem = recommendList[Math.floor(Math.random() * recommendList.length)];
		$(`
			<li>
				<a href="#">
					<img src="${ randomItem.image }" alt="" />
					<span class="span-text">${ randomItem.name }</span>
					<span class="span-price">￥${ randomItem.price.toFixed(2) }</span>
				</a>
			</li>
		`).appendTo('.recommend-end>ul.public-ul');
	}
})();















