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
            cb && cb(newVal, prop)
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


window.UiWaterFall = function (){
    this.id = Date.now() + '_waterfall'
}
UiWaterFall.prototype = {
    id: Date.now() + '_waterfall',
    config: {}
}

UiWaterFall.prototype.init = function(parendId, childId, config){
    var parentDom = document.getElementById(parendId),
        childDom = parentDom.querySelectorAll('.' + childId)


    var container = document.createElement('section')
    container.className = 'ui-waterfall'
    config = config || {}
    this.config = {
        margin: config.margin || 5,
        range: config.range && config.range.length ? config.range : [300, 400],
        width: config.width || 200
    }

    var rangeh = this.config.range
    var margin = this.config.margin
    var width = this.config.width

    var frag = document.createDocumentFragment()
    for(var i = 0, len = childDom.length;i < len;i++){
        childDom[i].style.cssText = 'position: absolute;width: ' + width + 'px;height: ' + (Math.random() * (rangeh[1] - rangeh[0]) + rangeh[0]) + 'px;margin: ' + margin + 'px;transition: .4s;'
        frag.appendChild(childDom[i])
    }

    container.appendChild(frag)
    var containerw = parentDom.offsetWidth
    var boxMarginLeft = childDom[0].style.marginLeft.replace('px', '') >> 0
    var boxMarginRight = childDom[0].style.marginRight.replace('px', '') >> 0
    var boxw = (childDom[0].style.width.slice(0, -2) >> 0) + boxMarginLeft + boxMarginRight
    var maxColumLen = Math.floor(containerw / boxw)

    if(!UiWaterFall.prototype.hasCss){
        document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/waterfall/waterfall.css">'
    }
    UiWaterFall.prototype.hasCss = true

    var w = maxColumLen * (width + margin * 2)
    container.style.cssText = 'width: ' + w + 'px;'
    parentDom.appendChild(container)
    this.setPosition(parentDom, childDom)

    var _this = this
    listenEvent(window, 'resize', function(){
        var parentDom = document.getElementById(parendId),
            childDom = parentDom.querySelectorAll('.' + childId)

        _this.setPosition(parentDom, childDom)
    })
}

UiWaterFall.prototype.setPosition = function(container, box){
    if(!container || !box)
        return
    var margin = this.config.margin
    var width = this.config.width

    let containerw = container.offsetWidth
    let boxMarginLeft = box[0].style.marginLeft.replace('px', '') >> 0
    let boxMarginRight = box[0].style.marginRight.replace('px', '') >> 0
    let boxMarginTop = box[0].style.marginTop.replace('px', '') >> 0
    let boxMarginBottom = box[0].style.marginBottom.replace('px', '') >> 0

    let boxw = box[0].offsetWidth + boxMarginLeft + boxMarginRight
    let maxColumLen = Math.floor(containerw / boxw)

    var w = maxColumLen * (width + margin * 2)
    container.querySelector('.ui-waterfall').style.cssText = 'width: ' + w + 'px;'


    let column = []
    for(let i = 0;i < box.length;i++){
        let margin = boxMarginTop + boxMarginBottom

        let top = 0
        let left = boxw * (i % maxColumLen) + 'px'

        let boxh = parseFloat(box[i].style.height.slice(0, -2))

        if(column.length < maxColumLen){
            column.push(boxh)
        }else{
            let tmpColumn = JSON.parse(JSON.stringify(column))
            let index = tmpColumn.indexOf(column.sort(function(a, b){return a - b})[0])
            tmpColumn[index] += boxh + margin
            left = boxw * index + 'px'
            top = column[0] + margin + 'px'
            column = tmpColumn
        }

        box[i].style.cssText += `transform: translate(${left},${top});text-align: center;`
    }
}

UiWaterFall.prototype.hasCss = false