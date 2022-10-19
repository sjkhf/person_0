var swipeEvent = {

	touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    
    //事件
    events:{
        handleEvent:function(event){
            var self = swipeEvent.events;     //this指events对象
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },
        //滑动开始
        start:function(event){
            swipeEvent.dom = event.currentTarget;
            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
            isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
        },
        //移动
        move:function(event){
            swipeEvent.dom = event.currentTarget;
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
            if(isScrolling === 0){
                event.preventDefault();//阻止触摸事件的默认行为，即阻止滚屏
            }
        },
        //滑动释放
        end:function(event){
            var duration = +new Date - startPos.time;    //滑动的持续时间
            var direction = "none";
            var distance = 100;
            swipeEvent.dom = event.currentTarget;
            if(Number(duration) > distance){
	            if(isScrolling === 0){    //当为水平滚动时
                    //判断是左移还是右移，当偏移量大于10时执行
                    if(endPos.x > distance){
                    	direction = "right";
                    }else if(endPos.x < (0 - distance)){
                    	direction = "left";
                    }
	            } else {
	            	//判断是上移还是下移，当偏移量大于10时执行
                    if(endPos.y > distance){
                    	direction = "down";
                    }else if(endPos.y < (0 - distance)){
                    	direction = "up";
                    }
	            }
            	swipeEvent.dom.endFun(direction);
            }
            event.stopPropagation();
        }
    },
    
    
	//初始化
	//selector:可以为dom对象，也可以为dom对象的id值
	//etype:监听的事件类型：
	//endFun:事件完毕后的回调方法
    init:function(selector, endFun){
        dom = typeof selector == "string" ? document.getElementById(selector) : selector;
        swipeEvent.dom = dom;
        // 绑定的事件跟dom走，防止多个事件绑定时事件之间相互冲突
        swipeEvent.dom.endFun = endFun;
        //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
        //addEventListener第三个参数为冒泡获取方式，false时为冒泡获取(由里向外)，true为capture方式(由外向里)
        if(!!this.touch){
            dom.addEventListener('touchstart', this.events.handleEvent, false);
            dom.addEventListener('touchmove',this.events.handleEvent,false);
            dom.addEventListener('touchend',this.events.handleEvent,false);
        }
    },
    unbind:function(selector, endFun){
    	dom = typeof selector == "string" ? document.getElementById(selector) : selector;
    	swipeEvent.dom = dom;
    	dom.removeEventListener('touchstart', this.events.handleEvent, false);
        dom.removeEventListener('touchmove',this.events.handleEvent,false);
        dom.removeEventListener('touchend',this.events.handleEvent,false);
    }
};