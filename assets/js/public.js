// 开发插件
// 插件用户如何用

//根据插件的功能来分析具体的参数设计
var Message = {
	alert: function(msg) {
		if(document.querySelector('.message-alert')) return;
		var div = document.createElement('div');
		div.className = 'message-alert';
		div.style.position = 'fixed';
		div.style.left = '0';
		div.style.top = '0';
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.backgroundColor = 'rgba(100,100,100,0.3)';
		div.style.zIndex = '120';
		div.innerHTML += `
			<div class='message-content' style='
				min-width: 300px;
				max-width: 500px;
				min-height: 160px;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				background-color: white;
				z-index: 120;
			'>
			
				<div class='content-top' style='
					background-color: rgba(114,209,255,0.4);
					padding: 10px 0;
				'>
					<span style='display: block;text-indent: 1em;font-size: 18px; line-height: 16px;'>提示:<span>
				</div>
				
				<div class='text' style='
					padding: 10px 0;
				'> 
					<p style='text-indent: 2em; color: blue;'>${ msg }</p>
				</div>
				
				<div class='btn' style='
					height: 40px;
					box-sizing: border-box;
					padding: 10px 0;
					text-align: center;
				'>
					<span class='btn-ok' style='
						font-size: 16px;
						display: inline-block;
						width: 40px;
						text-align: center;
						background-color: #000;
						color: white;
						cursor: pointer;
						padding: 4px;
					'>确定</span>
				</div>
			</div>	
		`; 
		document.body.appendChild(div);
		div.querySelector('span.btn-ok').onclick = function() {
			document.body.removeChild(div);
		};
	},
	
	confirm: function(msg, callback) {
				if(document.querySelector('.message-confirm')) return;
				var div = document.createElement('div');
				div.className = 'message-confirm';
				div.style.position = 'fixed';
				div.style.left = '0';
				div.style.top = '0';
				div.style.width = '100%';
				div.style.height = '100%';
				div.style.backgroundColor = 'rgba(100,100,100,0.3)';
				div.style.zIndex = '120';
				div.innerHTML += `
					<div class='message-content' style='
						min-width: 300px;
						max-width: 500px;
						min-height: 160px;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						background-color: white;
						z-index: 120;
					'>
						<div class='content-top' style='
							background-color: rgba(114,209,255,0.4);
							padding: 10px 0;
						'>
							<span style='display: block;text-indent: 1em;font-size: 18px; line-height: 16px;'>提示:<span>
						</div>
						
						<div class='text' style='
							padding: 10px 0;
						'> 
							<p style='text-indent: 2em; color: blue;'>${ msg }</p>
						</div>
						
						<div class='btn' style='
							height: 40px;
							box-sizing: border-box;
							padding: 10px 0;
						'>
							<span class='btn-ok' style='
								font-size: 16px;
								display: inline-block;
								width: 40px;
								text-align: center;
								background-color: #000;
								color: white;
								cursor: pointer;
								margin-left: 70px;
								margin-right: 75px;
								padding: 4px;
							'>确定</span>
							
							<span class='btn-cancel' style='
								font-size: 16px;
								display: inline-block;
								width: 40px;
								text-align: center;
								background-color: #000;
								color: white;
								cursor: pointer;
								margin-right: 70px;
								padding: 4px;
							'>取消</span>
						</div>
					</div>	
				`; 
				document.body.appendChild(div);
				div.querySelector('span.btn-ok').onclick = function() {
					document.body.removeChild(div);
					if(typeof callback === 'function') callback();
				};
				div.querySelector('span.btn-cancel').onclick = function() {
					document.body.removeChild(div);
				};
	},
	notice: function(msg) {
		var div = document.createElement('div');
		div.className = 'message-notice';
		div.innerText = msg;
		div.style.position = 'fixed';
		div.style.left = '50%';
		div.style.top = '50%';
		div.style.transform = 'translate(-50%, -50%)';
		div.style.padding = '10px 20px';
		div.style.backgroundColor = '#000';
		div.style.color = '#fff';
		div.style.zIndex = '120';
		document.body.appendChild(div);
		setTimeout(function() {
			document.body.removeChild(document.querySelector('.message-notice'));
		},2000);
	},
};



//假想的调用方式
// Message.alert();
// Message.confirm();