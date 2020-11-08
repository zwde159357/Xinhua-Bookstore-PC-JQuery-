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

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	$('span.product-count').text(typeof pcount === 'undefined'? 0 : pcount);
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
		if(i*50 <= 600)
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({ top:  i * 50 });
		else
			$(`ul.category-main>li:eq(${ i })>ul.category-sub`).css({ top: 300 });
		if(subCategoryList.length === 0)
			$(`<li>暂无相关信息</li>`).appendTo(`ul.category-main>li:eq(${ i }>ul.category-sub)`);
		else {
			// 第二级菜单
			subCategoryList.forEach(function(item2,j) {
				if(item2.id === 12 || item2.id === 16)
					$(`
						<li>
							<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
						</li>
					`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub`);
				else
					$(`
						<li>
							<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
						</li>
					`).appendTo(`ul.category-main>li:eq(${ i })>ul.category-sub`);
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

// 排行榜
(function() {
	// ranking-top
	$('ul.ranking-mid-title>li').each((i,li) => {
		// 创建ul
		$(`<ul class='ranking-bottom  ${ i === 0 ? 'active' : '' }'></ul>`).appendTo('.ranking-left-bottom');
		// 动态渲染数据
		data.rankingList.filter(item2 => item2.fid === i+1).forEach(function(item2,j) {
			$(`
				<li class=${ j === 0 ? 'active' : ''}>
					<a>
						<img src='${ item2.images }' alt=""/>
						<span class='sp-title'>${ item2.name }</span>
						<span class='sp-name'>${ item2.author }</span>
						<span class='sp-price'>￥${ item2.price.toFixed(2) }</span>
						<span class='sp-icon'>${ j+1 }</span>
					</a>
				</li>
			`).appendTo(`ul.ranking-bottom:eq(${ i })`);
		});
		
		// 滑过选项卡
		$(li).on('mouseover',function(j,item) {
			$(this).add(`ul.ranking-bottom:eq(${ i })`).add($(`ul.ranking-bottom>li:eq(${ 0 })`)).addClass('active').siblings().removeClass('active');
		});
	});
	
	// 排行榜具体展示
	$('ul.ranking-bottom>li').on('mouseover',function(i,item) {
		$(this).addClass('active').siblings().removeClass('active');
	});
})();	

// 新华推荐
(function() {
	$('.recommend-top>ul>li').each((i,item) => {
		$(`<ul class='public-ul ${ i === 0 ? 'active' : ''}'></ul>`).appendTo('.recommend');
		
		data.recommendList.filter(item2 => parseInt(item.id) === item2.fid).forEach(function(item2) {
			$(`
				<li>
					<a>
						<img src='${ item2.image }' alt='' />
						<span class='span-text'>${ item2.name }</span>
						<span class='span-price'>￥${ item2.price.toFixed(2) }</span>
						<span class='span-line'>￥${ item2.prev.toFixed(2) }</span>
					</a>
				</li>
			`).appendTo($('.recommend>ul.public-ul').eq(i));
		});
		
		$(item).on('click',function() {
			$(this).addClass('active').siblings().removeClass('active');
			$('.recommend>ul.public-ul').removeClass('active').eq(i).addClass('active');
		});
	});
})();

//监听滚轮滚动的事件
$(window).on('scroll',function() {
	var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
	if(nowTop >= 786)
		$('.fixed').css({ display: 'block' });
	else
		$('.fixed').css({ display: 'none' });
});

// 导航栏
(function() {
	var topAreas = [];
	var scrollTimer = null;
	var scrollTimer1 = null;
	imagesLoaded(document.body,function() {
		$('.part').each(function(i,item) {
			var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
			topAreas.push(Math.floor(nowTop + item.getBoundingClientRect().top - 70));
		});
	});
	
	function scroll(top) {
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
		var diffTop = top -nowTop;
		if(Math.abs(diffTop)<= 30) {
			window.scrollTo(0,top);
			setTimeout(function() {
				clearInterval(scrollTimer);
				scrollTimer = null;
				clearInterval(scrollTimer1);
				scrollTimer1= null;
			}, 20);
		}
		else
			window.scrollTo(0, diffTop > 0 ? nowTop + 30 : nowTop -30);
	}
	
	$('.part-nav>ul>li').each(function(i,item) {
		$(item).on('click',function() {
			if($(this).hasClass('active')) return;
			if(scrollTimer !== null) {
				clearInterval(scrollTimer);
				scrollTimer = null;
			}
			if(scrollTimer1 !== null) {
				clearInterval(scrollTimer1);
				scrollTimer1 = null;
			}
			$('.part-nav>ul>li').removeClass('active');
			$(this).addClass('active');
			var top = topAreas[i];
			scrollTimer = setInterval(function() { scroll(top); }, 10);
		});
	});
	
	$('.return-top').on('click',function() {
		if(scrollTimer !== null) {
			clearInterval(scrollTimer);
			scrollTimer = null;
		}
		if(scrollTimer1 !== null) {
			clearInterval(scrollTimer1);
			scrollTimer1 = null;
		}
		
		var top = 0;
		scrollTimer1 = setInterval(function() { scroll(top); }, 10);
	});
	
	$(window).on('mousewheel',function() {
		//如果滚动鼠标滚轮时，存在左边点击激活的滚动任务时，将滚动任务取消
		if(scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
		if(scrollTimer1) { clearInterval(scrollTimer1); scrollTimer1 = null; }
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
	});
	
	$('.part-nav').removeClass('active');
	
	// 监听窗口滚动事件
	$(window).on('scroll',function() {
		//情况一 点击左边出发的滚动，不做处理
		if(scrollTimer) return;
		
		if(scrollTimer1) {
			var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
			for(var i = topAreas.length - 1; i >= 0; i--) {
				if(nowTop >= topAreas[i]) break;
			}
			//循环结束后i值非常关键
			if(i > 0) $('.part-nav>ul>li').removeClass('active').eq(i).addClass('active');
		}
		//情况二：滚动鼠标滚轮触发的滚动，要联动左边的激活状态
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
		//for循环算出哪个part正处于激活
		for(var i = topAreas.length - 1; i >= 0; i--) {
			if(nowTop >= topAreas[i]) break;
		}
		if(i > 0) $('.part-nav>ul>li').removeClass('active').eq(i).addClass('active');
		if(nowTop > topAreas[0]) {
			$('.part-nav').addClass('active');
		}
		else {
			$('.part-nav').removeClass('active');
		}
	});
})();