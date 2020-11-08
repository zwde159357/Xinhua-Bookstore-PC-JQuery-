// 商品id
var did = parseInt(window.location.search.slice(window.location.search.indexOf('=')+1));
var data = JSON.parse(sessionStorage.getItem('data'));
var categoryList = data.categoryList;
var pcount = 0;

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

// 购物车中商品的数量
// 购物车件数
var userName = Cookies.get('user');
data.cartList.filter(item => item.name === userName).forEach(item => pcount += item.count);
Cookies.set('pcount', pcount);

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	var productCount = document.querySelector('span.product-count');
	productCount.innerText = typeof pcount === 'undefined'? 0 : pcount ;
})();

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
		
		$(`<ul class='category-bott'></ul>`).appendTo(`ul.category-main>li:eq(${ i })`);
		
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
		if(i*50 <= 600)
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({ top:  i * 50 });
		else
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({top: 300});
		if(subCategoryList.length === 0)
			$(`<li>暂无相关信息</li>`).appendTo(`ul.category-main>li:eq(${ i }>ul.category-sub)`);
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

// 根据id获取要展示商品的详细信息
var count = 1;

// 数量控制
(function() {
	var $btnDecreasse = $('span.btn-decrease');
	var $btnIncreasse = $('span.btn-increase')
	var $inputCount = $('input.count')
	var maxCount = 6;
	
	$btnDecreasse.on('click',function() {
		$btnIncreasse.removeClass('disabled');
		$(this).toggleClass('disabled', count === 1);
		if(count === 1) return;
		$(this).next().val(--count);
	});
	
	$btnIncreasse.on('click',function() {
		$btnDecreasse.removeClass('disabled');
		$(this).toggleClass('disabled', count === maxCount);
		if(count === maxCount) return;
		$(this).prev().val(++count);
	});

	$inputCount.on('focus', function() {
		var $oldValue = $(this).val();
	});
	
	$inputCount.on('keyup',function(e) {
		if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
			$(this).val($oldValue);
		else  
			$oldValue = $(this).val();
	});
	
	$inputCount.on('blur',function() {
		if($(this).val().length === 0 || $(this).val() < 1) $(this).val(1);
		if($(this).val() > maxCount) $(this).val(maxCount);
		count = $(this).val();
		$btnDecreasse.toggleClass('disabled', count === 1);
		$btnIncreasse.toggleClass('disabled', count === maxCount);
	});
})();

// 加入购物车
(function() {
	// 加入购物车
	$('span.btn-buy').on('click', function() {
		// 判断用户有没有登录,若无则跳转登录页面
		// cookies只能默认存4k左右的东西,生命周期可以控制，若不控制则浏览器关闭就消失,storage则存5M左右的东西
		if(typeof userName === 'undefined') {
			Message.confirm('请先登录',function() {
				// 代码跳转之前 将当前页面路径放回cookies中，以便登录后返回
				Cookies.set('backUrl',window.location.href);
				// 代码跳转页面
				window.location.href = '../login/login.html';
			});
			return;
		}
		// 如果登录了
		// 数据整体取出,修改后再放回
		var data = JSON.parse(sessionStorage.getItem('data'));
		//数组findindex()找到了返回下标，没有则返回-1
		var index = data.cartList.findIndex(function(item) {
			return item.name === userName && item.pid === did;
		});
		// -1味这个商品当前用户对应的购物城中没有该商品
		if(index === -1) {
			var obj = {
				id: data.cartList[data.cartList.length - 1].id + 1,
				name: userName,
				pid: did,
				count: count,
			};
			data.cartList.push(obj);
		} else {
			if(data.cartList[index].count + count > 6) {
				Message.alert('已达购买上限');
				return;
			}
			data.cartList[index].count += count;
		}
		$('span.text>span.product-count').text(pcount + count);
		Cookies.set('pcount', pcount+count);
		sessionStorage.setItem('data',JSON.stringify(data));
		Message.alert('成功加入购物车');
	});
})();

// 搜索结果
(function() {
	var product = data.productList.find(item => item.id === did),
		list = data.categoryList.find(item => item.id === product.cid),
		category = data.categoryList.find(item => item.id === list.fid);
	$('.end-result>.result>span.result-second').text(product.name);
	$('.end-result>.result>span.result-third').text(list.name);
	$('.end-result>.result>span.result-fourth').text(category.name);
})();

// 重要右边部分
(function() {
	var product = data.productList.find(item => item.id === did);
	$('.detail-title').text(product.name);
	$('.detail-content>.detail-author>a.school').text(product.plait);
	$('.detail-content>.detail-author>a.author').text(product.book);
	$('.detail-content>.detail-price>.sell span.sell-b').text('￥' + product.price.toFixed(2));
	$('.detail-content>.detail-price>.sell span.sell-d').text('￥' + product.prev.toFixed(2));
})();

// 放大镜
(function() {
	var product = data.productList.find(item => item.id === did);
	var big = product.big.split(',');
	var small = product.small.split(',');

	big.forEach((item,i) => 
		$(`
			<li class='${ i === 0 ? 'show' : '' }'>
				<div class='image-wrap'>
					<img src='${ item }' alt='' />
				</div>
			</li>
		`).appendTo($('ul.big-image-list'))
	);
	
	small.forEach(item =>
		$(`
			<li>
				<div class='image-wrap'>
					<img src='${ item }' alt='' />
				</div>
			</li>
		`).appendTo($('ul.image-list'))
	);
})();

(function() {
	var count = 0;
	
	$('span.prev').on('click', function() {
		if(count === 0) return;
		count = count - 1;
		$('.image-list-wrap>.image-list').css({
			transform: `translateX(-${ count*25 }%)`
		});
	});
	
	$('span.next').on('click', function() {
		if(count >= liEls.length - 4) return;
		count = count + 1;
		$ulEl.css({ transform: `translateX(-${ count*25 }%)`});
	});
	
	$('.image-list-wrap>.image-list').children().on('click', function() {
		$('ul.big-image-list>li').eq($(this).index()).addClass('show').siblings('.show').removeClass('show');
	});
	
	$('.big-image-list-wrap').on('mouseover', function() {
		var $zoomEl = $(this).children().eq(0);
		var $zoomBigEl = $(this).next();
		var imagePath = $(this).find('li.show img').attr('src');
		var width = $(this).width();  //width包含边框
		var height = $(this).height();
		//求比率
		var ratio = width / $zoomEl.width();
		$zoomEl.css({
			backgroundImage: `url(${ imagePath })`,
			backgroundSize: `${ width - 2 }px ${ height - 2 }px`
		});
		$zoomBigEl.css({
			backgroundImage: `url(${ imagePath })`,
			backgroundSize: `${ ratio * width - 2 }px ${ ratio * height - 2 }px`
		});
	});
	
	$('.big-image-list-wrap').on('mousemove', function(e) {
		var $zoomEl = $(this).children().eq(0);
		var $zoomBigEl = $(this).next();
		var x,
			y,
			mouseX = e.clientX - this.getBoundingClientRect().left,  //e.offsetX存在兼容性问题
			mouseY = e.clientY - this.getBoundingClientRect().top,
			minX = $zoomEl.width() / 2,
			minY = $zoomEl.height() / 2,
			maxX = $(this).width() - minX,
			maxY = $(this).height() - minY;
		var ratio = $(this).width() / $zoomEl.width();
		if(mouseX <= minX) x = 0;
		else if(mouseX >= maxX) x = maxX - minX;
		else x = mouseX - minX;
		
		if(mouseY <= minY) y = 0;
		else if(mouseY >= maxY) y = maxY - minY;
		else y = mouseY - minY;
		$zoomEl.css({
			left: `${ x }px`,
			top: `${ y }px`,
			backgroundPosition: `-${ x }px -${ y }px`
		});
		$zoomBigEl.css({
			backgroundPosition: `-${ ratio * x }px -${ ratio * y }px`
		});
	});
})();

// 相关推荐
(function() {
	data.recommendList.filter(item => item.pid === did).forEach(item => {
		$(`
			<li>
				<a href="#">
					<img src="${ item.image  }" alt="" />
					<span class="span-text">${ item.name }</span>
					<span class="span-price">￥${ item.price.toFixed(2) }</span>
				</a>
			</li>
		`).appendTo($('.recommend-end>ul.public-ul'));
	});
})();

//最后商品中的新华推荐
(function() {
	var recommendList = data.recommendList;
	for(var i = 0; i < 6; i++) {
		var randomItem = recommendList[Math.floor(Math.random() * recommendList.length)];
		$(`
			<li>
				<a href="#">
					<img src="${ randomItem.image }" alt="" />
					<span class="name">${ randomItem.name }</span>
					<span class="price">￥${ randomItem.price.toFixed(2) }</span>
				</a>
			</li>
		`).appendTo('.end-box>.end-left>.content>ul');
	}
})();

// 动态展示最后商品中的数据
(function() {
	var product = data.productList.find(item => item.id = did);
	var arr = product.end.split(',');
	$(`
		<div class="middle-a public active">
			<div class="middle-a-top">
				<img src="${ arr[0] }" alt="" />
			</div>
			<div class="middle-a-bottom">
				<img src="${ arr[1] }" alt="" />
				<img src="${ arr[2] }" alt="" />
			</div>
		</div>
		
		<div class="middle-b public">
			<div class="middle-b-content">
				<img src="${ arr[3] }" alt="" />
				<img src="${ arr[4] }" alt="" />
				<img src="${ arr[5] }" alt="" />
				<img src="${ arr[6] }" alt="" />
			</div>
		</div>
		
		<div class="middle-c public">
			<div class="middle-c-content">
				<img src="${ arr[7] }" alt="" />
			</div>
		</div>
		
		<div class="middle-d public">
			<div class="middle-d-content">
				<i class="iconfont icon-pingjia"></i>
				<span>该商品还没有评价~</span>
			</div>
		</div>
	`).appendTo('.end-right>.middle');
})();


//最后商品中的选项卡切换
(function() {
	$('.end-right>.top>ul>li').on('click', function() {
		$(this).add($('.end-right>.middle>.public').eq($(this).index())).addClass('active').siblings('.active').removeClass('active');
	});
})();

// 回到顶部
(function() {
	var scrollTimer = null;
	function scroll(top) {
		var newTop = document.documentElement.scrollTop || document.body.scrollTop;
		var diff = newTop-top;
		if(Math.abs(diff) <= 30) {
			window.scrollTo(0, top);
			clearInterval(scrollTimer);
			scrollTimer = null;
		}
		else
			window.scrollTo(0, diff > 0 ? diff - 30 : diff + 30);
	}
	
	$('.return-top').on('click', function() {
		var top = 0;
		scrollTimer = setInterval(function() { scroll(top); }, 10);
	});
	$(window).on('mousewheel', function() {
		//如果滚动鼠标滚轮时，存在左边点击激活的滚动任务时，将滚动任务取消
		if(scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
	});	
})();		



























