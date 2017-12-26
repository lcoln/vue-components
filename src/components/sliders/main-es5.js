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

function setBoxStyle(parentDom, container, box){
    var i = 0,
        len = box.length

    if(this.type == 1){
        container.style.cssText = 'width: ' + this.maxPage * 100 + '%;height: 100%;'
        for(;i < len;i++){
            box[i].className += ' left'
            box[i].style.cssText = 'float: left;width: ' + 100 / this.maxPage + '%;transition: .4s;'
        }
    }else if(this.type == 2){
        container.style.cssText = 'height: ' + this.maxPage * 100 + '%;width: 100%;'
        for(;i < len;){
            box[i++].style.cssText = 'height: ' + 100 / this.maxPage + '%;transition: .4s;'
        }
    }

}

window.UiSliders = function (){}

UiSliders.prototype = {
    id: Date.now() + '_UiSliders',
    hasCss: false,
    type: 1,        //1: 水平; 2: 垂直;
    curPage: 1,
    maxPage: 0,
    init: function(parentId, childId, config){
        config = config ? config : {}
        var parentDom = document.getElementById(parentId),
            childHtml = parentDom.innerHTML,
            container = document.createElement('section'),
            _self = this

        this.type = config.type || 1
        this.maxPage = parentDom.children.length

        parentDom.style.cssText = 'position: relative;overflow: hidden;'

        container.className = 'ui-sliders'
        container.innerHTML = childHtml
        var box = container.querySelectorAll('.' + childId)

        setBoxStyle.call(this, parentDom, container, box)

        if(!UiSliders.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/sliders/sliders.css">'
        }
        UiSliders.prototype.hasCss = true

        parentDom.innerHTML = ''
        parentDom.appendChild(container)
        var btnClass = this.type == 1 ? 'ui-sliders-horizontal-btn' : 'ui-sliders-vertical-btn'
        parentDom.innerHTML = '<a class="iconfont ' + btnClass + '" href="javascript:;">&#xe697;</a>' + parentDom.innerHTML + '<a class="iconfont ' + btnClass + '" href="javascript:;">&#xe6a7;</a>'

        listen(parentDom.firstChild, 'click', function(ev){
            if(_self.curPage == 1)
                _self.curPage = _self.maxPage
            else
                _self.curPage -= 1
        })

        listen(parentDom.lastChild, 'click', function(ev){
            if(_self.curPage == _self.maxPage)
                _self.curPage = 1
            else
                _self.curPage += 1
        })

        observable(this, 'curPage', function(){
            var container = parentDom.querySelector('.ui-sliders'),
                box = [].slice.call(container.querySelectorAll('.' + childId)),
                i = 0,
                len = box.length;


            for(;i < len;i++){
                if(i + 1 == _self.curPage)
                    box[i].style.opacity = 1
                else
                    box[i].style.opacity = 0
            }
            parentDom.querySelector('.ui-sliders').style.cssText += 'transform: translate(' + (_self.curPage - 1) * (-100 / _self.maxPage) + '%, 0)'
        })
    }
}


