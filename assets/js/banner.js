var images = [
	'../images/index/banner/banner-008.jpg',
	'../images/index/banner/banner-001.jpg',
	'../images/index/banner/banner-002.jpg',
	'../images/index/banner/banner-003.jpg',
	'../images/index/banner/banner-004.jpg',
	'../images/index/banner/banner-005.jpg',
	'../images/index/banner/banner-006.jpg',
	'../images/index/banner/banner-007.jpg',
	'../images/index/banner/banner-008.jpg',
	'../images/index/banner/banner-001.jpg'
];

var divEl = document.querySelector('.banner');
var sliderUlEl = document.createElement('ul');
sliderUlEl.className = 'banner-slider';
for(var i = 0; i < images.length; i++) {
	sliderUlEl.innerHTML += `
		<li>
			<a href='#'>
				<img src='${ images[i] }'/>
			</a>
		</li>
	`;
}

var indicatorUlEl = document.createElement('ul');
indicatorUlEl.className = 'banner-indicator';

for(var i = 1; i <= images.length - 2; i++) {
	if(i === 1) {
		indicatorUlEl.innerHTML += `
			<li class='active'>
			</li>
		`;
	}
	else {
		indicatorUlEl.innerHTML += `
			<li>
			</li>
		`;
	}
}

var tSpanEl = document.createElement('span');
var bSpanEl = document.createElement('span');
tSpanEl.className = 'banner-prev iconfont icon-arrow-left';
bSpanEl.className = 'banner-next iconfont icon-arrow-right';


divEl.appendChild(sliderUlEl);
divEl.appendChild(indicatorUlEl);
divEl.appendChild(tSpanEl);
divEl.appendChild(bSpanEl);

var index = 0; //声明全局变量，记录哪一张是激活的
var interval = 5000; //轮播间隔时间
var timer = null;  //保存计时器对象
var count = images.length - 2;     //总共实际所需的图片数量
var lock = false; //标识是否执行动画
//自动播放的时候
//点击轮播图指示器的时候
//点击上一张下一张按钮的时候
function slide(nextIndex) {
	//锁关着
	//如果当前正在执行轮播动画直接返回。
	if(lock) return;
	lock = true;  //表示某一个动画开始了
	//nextIndex: -1 0 1 2 3 4
	//index: 0 1 2 3
	// 图片切换
	var slider = document.querySelector("ul.banner-slider");
	slider.style.transitionDuration = "1s";
    slider.style.marginLeft = -1 * nextIndex + '00%';
	
	//指示器切换
	var indicators = document.querySelectorAll("ul.banner-indicator>li");
	indicators[index].className = "";
	
	//更新index
	if(nextIndex === count) {
		index = 0;
	}
	else if(nextIndex === -1) {
		index = count - 1;
	}
	else {
		index = nextIndex;
	}
	indicators[index].className = "active";
	// 重置实现无缝效果
	// setTimeout()每隔多少时间只执行一次事件
	setTimeout(function() {
		slider.style.transitionDuration = "0s";
		if(nextIndex === count) slider.style.marginLeft = "0%";
		if(nextIndex === -1) slider.style.marginLeft = -1 * (count-1) + "00%";
		lock = false;  // 动画结束后开锁
	}, 1020);
}

// 自动播放
function play() {
	timer = setInterval(function() {
		slide(index+1);
    }, interval);
}

// 鼠标滑到banner区域停止自动播放
document.querySelector(".banner").onmouseover = function() { clearInterval(timer); };
// 鼠标滑出banner区域恢复自动播放
document.querySelector(".banner").onmouseout = function() {  play(); };

//指示器点击切换轮播图
var indicators = document.querySelectorAll("ul.banner-indicator>li");
for(var i = 0; i < indicators.length; i++) {
	indicators[i].b = i;
	indicators[i].onclick = function() {
		if(this.className === "active") return;
		slide(this.b);
	};
}

//上一张点击事件
document.querySelector("span.banner-prev").onclick = function() {
	//三步运算符
	slide(index - 1);
};

//下一张
document.querySelector("span.banner-next").onclick = function() {
	slide(index + 1);
};

//首次播放
play();

















