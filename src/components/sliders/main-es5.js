/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */
'use strict'

var pageNums = 0
var listen = function(el, ev, fn, capture){
    if(window.addEventListener){
        el.addEventListener(ev, fn, capture)
    }else if(window.attachEvent){
        el.attachEvent('on' + ev, fn, capture)
    }else{
        el['on' + ev] = fn
    }
}

var remove = function(el, ev, fn, capture){
    if(window.removeEventListener){
        el.removeEventListener(ev, fn, capture)
    }else if(window.attachEvent){
        el.attachEvent('on' + ev, fn, capture)
    }
}

var watch = function(obj, prop, cb){
    var oldVal = ''
    if(prop in obj){
        oldVal = obj[prop]
    }
    Object.defineProperty(obj, prop, {
        get: function(){
            return oldVal
        },
        set: function(newVal){
            oldVal = newVal
            cb && cb(newVal)
        }
    })
}

/**
 * [监听对象所有属性变化]
 * @param  {Object}   obj [要监听属性的对象]
 * @param  {Function} cb  [description]
 */
var observable = function(obj, prop, cb){
    var type = Object.prototype.toString.call(prop)
    var props = []
    if(type === '[object String]'){
        props = [prop]
    }else if(type === '[object Function]'){
        props = Object.keys(obj)
        cb = prop
    }else if(type === '[object Array]'){
        props = prop
    }
    for(var i = 0;i < props.length;i++){
        watch(obj, props[i], cb)
    }

}

if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

var skin = ['skin-0','skin-1','skin-2','skin-3']

/**
 * [根据当前幻灯片索引获取填充底下按钮数据]
 * @param  {Object} vm [vm对象]
 * @return {[Array]}    [填充到按钮的数据]
 */
function getBtnList(vm, el){
    if(el){
        dom = el
    }
    vm.maxNum = Math.floor(dom.offsetWidth / 90)
    var curr = vm.curr + 1
    let res = []
    if(!vm.preview)
        res = vm.sliderList

    if(vm.maxNum >= vm.sliderList.length){
        res = vm.sliderList
    }else{
        if(curr > vm.maxNum){
            res = vm.sliderList.slice(curr - vm.maxNum, curr)
        }else if(curr <= vm.maxNum){
            res = vm.sliderList.slice(0, vm.maxNum)
        }
    }
    return res
}

/**
 * [设置自动轮播]
 * @param  {[type]} vm [description]
 * @return {[type]}    [description]
 */
function autoSlide(vm){
    vm.timer = setTimeout(function(){
        vm.$go(1)
        autoSlide(vm)
    }, vm.time <= 0 ? 3000 : vm.time)
}

window.UiSliders = function (){}
UiSliders.prototype = {

    id: Date.now() + '_waterfall',

    currWidth: 0,
    animation: '',
    curr: 0,
    sliderBtnList: [],
    maxNum: 0,
    timer: function(){},
    sliderType: 1,

    sliderList: [],
    autoSlide: '',
    time: 3000,
    preview: false,
    skin: 0,
    fullScreen: false,

    onSuccess: function(){},
    setSliderList: function(list){
        this.sliderBtnList.removeAll()
        this.sliderList.pushArray(list)
    },
    jump: function(i){
        var curr = this.curr + 1
        if(curr > this.maxNum && this.preview){
            var distance = this.maxNum - (i + 1)
            this.curr -= distance
        }else{
            this.curr = i
        }
    },
    stopSlide: function(){
        if(this.autoSlide){
            clearTimeout(this.timer)
        }
    },
    startSlide: function(){
        if(this.autoSlide)
            autoSlide(this)
    },
    go: function(num){
        this.curr += num
        if(this.curr < 0){
            this.curr = this.sliderList.length - 1
        }else if(this.curr > this.sliderList.length - 1){
            this.curr = 0
        }
    },
    init: function(parendId, config, callback){
        console.log(config);
        var parentDom = document.getElementById(parendId)
        if(!parentDom)
            return

        config = config ? config : {}
        for(var it of Object.keys(config)){
            if(it === 'skin' && !skin.includes(config[it]))
                continue
            if(this[it] || this[it] == 0){
                this[it] = config[it]
            }
        }

        if(!UiSliders.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/sliders/main.css">'
        }
        UiSliders.prototype.hasCss = true

        var container = document.createElement('div')
        container.className = ` ui-sliders`
        var box = document.createElement('div')
        box.className = ` skin-box `
        var content = document.createElement('div')
        content.className = ` slider-content`
        if(this.preview && !this.fullScreen)
            content.className += ' h-83'
        if(!this.preview || this.fullScreen)
            content.className += ' h-100'

        if(this.fullScreen){
            container.className += ' fullscreen'
        }
        box.appendChild(content)
        container.appendChild(box)
        parentDom.appendChild(container)

        var _this = this
        this.skin = skin[this.skin]
        box.className += this.skin
        this.currWidth = (100 / this.sliderList.length)
        console.log(this.autoSlide);
        if(this.autoSlide)
            autoSlide(this)

        if(this.preview){
            this.sliderBtnList.removeAll()
            this.sliderBtnList.pushArray(getBtnList(this, el))
        }

        this.render(container, this.sliderList)


        observable(this, 'curr', function(val){

            _this.animation = _this.sliderType > 2 ? 'translate(0, ' + (-_this.currWidth * val) + '%)' : 'translate(' + (-_this.currWidth * val) + '%, 0)'
            if(_this.preview && _this.maxNum < _this.sliderList.length){
                _this.sliderBtnList.removeAll()
                _this.sliderBtnList.pushArray(getBtnList(_this, el))
            }
        })

        listen(window, 'resize', function(ev){

            _this.animation = _this.sliderType > 2 ? 'translate(0, ' + (-_this.currWidth * _this.curr) + '%)' : 'translate(' + (-_this.currWidth * _this.curr) + '%, 0)'
            if(_this.preview && _this.maxNum < _this.sliderList.length){
                _this.sliderBtnList.removeAll()
                _this.sliderBtnList.pushArray(getBtnList(_this, el))
            }
        }, false)

        if(this.sliderType >= 3){
            var now = 0
            var mouseWheelEv = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll": "mousewheel"
            var direction = /Firefox/i.test(navigator.userAgent) ? "detail": "deltaY"

            listen(window, mouseWheelEv, function(ev){
                if(Date.now() - now > 500 || now == 0){
                    if(ev[direction] > 0){
                        this.$go(1)
                    }else{
                        this.$go(-1)
                    }
                    now = Date.now()
                }
            }, false)

        }

        this.onSuccess(this)
    },
    render: function(container, sliders){
        if(sliders.length > 0 && container){
            var dom = '<div class="skin-box" ms-class=" ' + this.skin + ' "></div>'
        }

    }
}

UiSliders.prototype.hasCss = false

