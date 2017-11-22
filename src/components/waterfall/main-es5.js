/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */
'use strict'

var pageNums = 0
var listenEvent = function(el, ev, fn, capture){
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


window.WaterFall = function (){
    this.id = Date.now() + '_waterfall'
}


WaterFall.prototype.init = function(parendId, childId, config){
    var parentDom = document.getElementById(parendId),
        childDom = parentDom.querySelectorAll('.' + childId)

    if(Object.prototype.toString.call(config) !== '[object Object]')
        console.error('第三个参数须为对象');

    var rangeh = config.range

    for(var i = 0, len = childDom.length;i < len;i++){
        console.log(len);
        childDom[i].style.width = config.width + 'px'
        childDom[i].style.height = Math.random() * (rangeh[1] - rangeh[0]) + rangeh[0] + 'px'
        childDom[i].style.position = 'absolute'
        childDom[i].style.margin = config.distance || '5px'
        childDom[i].style.transition = '.4s'
    }

    this.setPosition(parentDom, childDom)

    var _this = this
    listenEvent(window, 'resize', function(){
        var parentDom = document.getElementById(parendId),
            childDom = parentDom.querySelectorAll('.' + childId)

        _this.setPosition(parentDom, childDom)
    })
}

WaterFall.prototype.setPosition = function(container, box){

    var containerw = container.offsetWidth
    var boxMarginLeft = box[0].style.marginLeft.replace('px', '') >> 0
    var boxMarginRight = box[0].style.marginRight.replace('px', '') >> 0
    var boxMarginTop = box[0].style.marginTop.replace('px', '') >> 0
    var boxMarginBottom = box[0].style.marginBottom.replace('px', '') >> 0

    var boxw = box[0].offsetWidth + boxMarginLeft + boxMarginRight
    var maxColumLen = Math.floor(containerw / boxw)
    for(var i = 0;i < box.length;i++){
        var margin = boxMarginTop + boxMarginBottom

        var top = 0
        var left = boxw * (i % maxColumLen) + 'px'

        if(i + 1 > maxColumLen){
            if(i - maxColumLen < maxColumLen){
                top = box[i - maxColumLen].offsetHeight + margin + 'px'
            }else{
                var curBox = box[i - maxColumLen]
                top = (curBox.style.transform.split(',')[1].replace('px)', '') >> 0) + curBox.offsetHeight + margin + 'px'
            }
        }

        box[i].style.cssText += `transform: translate(${left},${top})`
    }
}