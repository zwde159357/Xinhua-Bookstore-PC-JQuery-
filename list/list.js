var data = JSON.parse(sessionStorage.getItem('data'));
var cid = parseInt(window.location.search.slice(window.location.search.indexOf('=')+1));

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

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	var productCount = document.querySelector('.top-title-right>a span.product-count');
	productCount.innerText = typeof pcount === 'undefined'? 0 : pcount ;
})();

// 分类
(function() {
	data.categoryList.filter(item => item.fid === 0).forEach(function(item,i) {
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
		
		data.categoryList.filter(item2 => item2.tid === item.id).forEach(function(item2,j) {
			// 二级菜单
			$(`
				<li>
					<a href='#'>
						${ item2.name }
					</a>
				</li>
			`).appendTo(`ul.category-main>li:eq(${ i })>ul`);
		});
		
		$(`
			<ul class='category-sub'></ul>
		`).appendTo(`ul.category-main>li:eq(${ i })`);
		
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

// 动态展示图片
(function() {
	for(var i = 0; i < 4; i++) {
		data.productList.filter(item => item.cid === cid).forEach(item => {
			$(`
				<li>
					<a href='../detail/detail.html?did=${ item.id }'>
						<img src='${ item.image }' alt='' />
						<span class='span-text'>${ item.name }</span>
						<span class='span-author'>${ item.author }</span>
						<span class='span-price'>￥${ item.price }</span>
					</a>
				</li>
			`).appendTo('.comprehensive-product>ul.list-ul');
		});
	}
})();

// 搜索结果
(function() {
	data.searchList.filter(item => item.fid === cid).forEach(item => {
		$(`
			<span class='result-sum'>${ item.sum }</span>
		`).appendTo('.wrap');
		
		if(cid === 12) {
			$('.wrap>.box-a>select>option').eq(0).attr('selected',true);
			$('.wrap>.box-a>select>option').eq(1).attr('selected',false);
		}
		else {
			$('.wrap>.box-a>select>option').eq(1).attr('selected',true);
			$('.wrap>.box-a>select>option').eq(0).attr('selected',false);
		}
		
		$(`
			<option selected>${ item.option1 }</option>
			<option>${ item.option2 }</option>
			<option>${ item.option3 }</option>
			<option>${ item.option4 }</option>
		`).appendTo('.wrap>.box-b>select');
		
		$(`<a class="kind-detail">${ item.kind }</a>`).appendTo('.result-detail>ul>li.li-a');
		
		$(`
			<li>
				<a href="#">${ item.time1 }</a>
			</li>
			<li>
				<a href="#">${ item.time2 }</a>
			</li>
			<li>
				<a href="#">${ item.time3 }</a>
			</li>
			<li>
				<a href="#">${ item.time4 }</a>
			</li>
			<li>
				<a href="#">${ item.time5 }</a>
			</li>
		`).appendTo('.result-detail>ul>li.li-c>ul.kind-time');
		
		$(`
			<li>
				<a href="#">${ item.author1 }</a>
			</li>
			<li>
				<a href="#">${ item.author2 }</a>
			</li>
			<li>
				<a href="#">${ item.author3 }</a>
			</li>
			<li>
				<a href="#">${ item.author4 }</a>
			</li>
			<li>
				<a href="#">${ item.author5 }</a>
			</li>
		`).appendTo('.result-detail>ul>li.li-e>ul.kind-author');
		
		$(`
			<span class='pagination-sum'>${ item.sumEnd }</span>
		`).appendTo('.box');
		
		$('.btn>a.last').text(item.sumLast);
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

// 排序
var orderDir = 'asc'; //asc表示升序, desc表示降序
var orderKey = 'price'; //price表示按价格

(function() {
	$('.comprehensive-top>ul>li>span').each(function(i,item) {
		$(item).on('click',function() {
			if($(this).hasClass('active')) {
				if(orderDir === 'desc') $(this).removeClass(orderDir);
				orderDir = orderDir === 'asc' ? 'desc' : 'asc';
				$(this).addClass(orderDir);
				$(this).toggleClass('asc', orderDir === 'asc');
			}
			else {
				orderKey = $(this).attr('data-key');
				$(this).addClass('active').parent().siblings().children().removeClass('active');
			}
			sortList();
		});
	});
})();

function sortList() {
	var list = [];
	var product = data.productList.filter(item => item.cid === cid);
	for(var i = 0; i < 4; i++)
		product.forEach(item => list.push(item));
	list.sort((a,b) => orderDir === 'asc' ? a[orderKey] - b[orderKey] : b[orderKey] - a[orderKey]);
	$('.comprehensive-product>ul.list-ul').children().remove();
	list.forEach(item => {
		$(`
			<li>
				<a href='../detail/detail.html?did=${ item.id }'>
					<img src='${ item.image }' alt='' />
					<span class='span-text'>${ item.name }</span>
					<span class='span-author'>${ item.author }</span>
					<span class='span-price'>￥${ item.price }</span>
				</a>
			</li>
		`).appendTo('.comprehensive-product>ul.list-ul');
	});
}

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