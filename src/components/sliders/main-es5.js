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

//设置幻灯片样式
function setBoxStyle(container, box){
    var i = 0,
        len = box.length

    if(this.type == 1){
        container.style.cssText = 'width: ' + this.maxPage * 100 + '%;'
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

//设置导航样式(预览)
function fillNavWhitoutPreview(width){
    var navHtml = []
    // var style = width > 0 ? 'style="width: "'
    for(var i = 0;i < this.maxPage;i++){
        var className = i + 1 == this.curPage ? 'act' : ''

        navHtml.push('<div class="ui-sliders-nav-btn ' + className + '" data-index="' + (i + 1) + '"></div>')
    }
    return navHtml.join('')
}

//设置导航样式(无预览)
function fillNavWhitPreview(parentDom, config){

    var width = parentDom.offsetWidth * 0.8 - 60
    var left = parentDom.offsetWidth * 0.1 + 30
    this.maxPreview = Math.floor(width / 110)
    var box = '<div class="ui-sliders-preview-box" style="width: ' + width + 'px;left: ' + left + 'px;"><div class="ui-sliders-preview-content" style="width: ' + this.maxPage * 110 + 'px;">'

    var tmp = []
    for(var i = 0;i < this.maxPage;i++){
        var className = i + 1 == this.curPage ? 'act' : ''
        tmp.push('<div class="' + className + '"><img src="' + config.source[i] + '" data-index="' + (i + 1) + '" /></div>')
    }
    box += tmp.join('') + '</div></div>'
    return box
}

window.UiSliders = function (){}

UiSliders.prototype = {
    id: Date.now() + '_UiSliders',
    hasCss: false,
    type: 1,        //1: 水平; 2: 垂直;
    curPage: 1,
    maxPage: 0,
    preview: false,
    maxPreview: 0,
    init: function(parentId, childId, config){
        config = config ? config : {}

        var parentDom = document.getElementById(parentId),
            childHtml = parentDom.innerHTML,
            container = document.createElement('section'),
            _self = this

        for(var it in config){
            if(this[it] || UiSliders.prototype.hasOwnProperty(it)){
                this[it] = config[it]
            }
        }

        this.maxPage = parentDom.children.length

        container.className = 'ui-sliders'
        container.innerHTML = childHtml
        var box = container.querySelectorAll('.' + childId)

        setBoxStyle.call(this, container, box)

        if(!UiSliders.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/sliders/sliders.css">'
        }
        UiSliders.prototype.hasCss = true


        var typeBox = document.createElement('div')
        typeBox.className = this.type == 1 ? ' ui-sliders-horizontal ' : ' ui-sliders-vertical '
        typeBox.className += this.preview ? ' ui-sliders-preview ' : ' ui-sliders-nopreview '
        typeBox.style.cssText = 'position: relative;overflow: hidden;width: 100%;height: 100%;'
        typeBox.appendChild(container)


        var navGroup = document.createElement('section')
        navGroup.className = 'ui-sliders-nav-group'

        var firstChild = null,
            lastChild = null,
            nav = null

        if(this.preview){
            navGroup.innerHTML = fillNavWhitPreview.call(this, parentDom, config)

            navGroup.innerHTML = '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe697;</a>' + navGroup.innerHTML + '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe6a7;</a>'
            typeBox.appendChild(navGroup)

            firstChild = navGroup.firstChild
            lastChild = navGroup.lastChild
            nav = navGroup.querySelector('.ui-sliders-preview-content')

        }else{
            navGroup.innerHTML = fillNavWhitoutPreview.call(this)
            typeBox.appendChild(navGroup)
            typeBox.innerHTML = '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe697;</a>' + typeBox.innerHTML + '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe6a7;</a>'

            firstChild = typeBox.firstChild
            lastChild = typeBox.lastChild
            nav = typeBox.querySelector('.ui-sliders-nav-group')

        }

        listen(firstChild, 'click', function(ev){
            _self.curPage = _self.curPage == 1 ? _self.maxPage : (_self.curPage - 1)
        })

        listen(lastChild, 'click', function(ev){
            _self.curPage = (_self.curPage == _self.maxPage) ? 1 : (_self.curPage + 1)
        })

        listen(nav, 'click', function(ev){
            var index = ev.target.getAttribute('data-index')
            if(index){
                _self.curPage = index - 0
            }
        })

        parentDom.innerHTML = ''
        parentDom.appendChild(typeBox)



        observable(this, 'curPage', function(v){
            var container = typeBox.querySelector('.ui-sliders'),
                box = [].slice.call(container.querySelectorAll('.' + childId)),
                btns = null,
                i = 0,
                len = box.length,
                movex = _self.maxPreview - v;

            if(!_self.preview){
                btns = typeBox.querySelector('.ui-sliders-nav-group').children
                for(;i < len;i++){
                    box[i].style.opacity = i + 1 == v ? 1 : 0
                    btns[i].className = i + 1 == v ? 'ui-sliders-nav-btn act' : 'ui-sliders-nav-btn'
                }

            }else{
                btns = typeBox.querySelector('.ui-sliders-preview-content').children
                for(;i < len;i++){
                    box[i].style.opacity = i + 1 == v ? 1 : 0
                    btns[i].className = i + 1 == v ? 'act' : ''
                }
                typeBox.querySelector('.ui-sliders-preview-content').style.transform = movex < 0 ? 'translate(' + movex * 110 + 'px, 0)' : 'translate(0, 0)'

            }

            container.style.cssText += 'transform: translate(' + (_self.curPage - 1) * (-100 / _self.maxPage) + '%, 0)'
        })


    }
}


