/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */
'use strict'

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

window.UiPointerHover = function (parendId, childId, time){

}

UiPointerHover.prototype.init = function(elm, opt){
    if(Object.prototype.toString.call(opt) !== '[object Object]')
        opt = {}
    opt.angle = opt.angle ? opt.angle.replace('deg', '') : 10
    opt.shadow = opt.shadow ? opt.shadow : '0 10px 30px rgba(0, 0, 0, .4)'

    var parentDom = document.getElementById(elm)
    parentDom.style.perspective = '800px'
    parentDom.style['transform-style'] = 'preserve-3d'
    parentDom.style.background = ''


    var container = document.createElement('section')
    container.style.perspective = '800px'
    container.style['transform-style'] = 'preserve-3d'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.transition = '.3s'

    for(let i = 0;i < parentDom.children.length;i++){
        container.appendChild(parentDom.children[i])
    }

    parentDom.appendChild(container)

    var curHeight = (window.getComputedStyle ? (window.getComputedStyle(parentDom).height).replace('px', '') : parentDom.offsetHeight) >> 0
    var curWidth = (window.getComputedStyle ? (window.getComputedStyle(parentDom).width).replace('px', '') : parentDom.offsetWidth) >> 0

    var halfh = curHeight / 2
    var halfw = curWidth / 2

    var moveh = opt.angle / curHeight
    var movew = opt.angle / curWidth
    var movex = 0
    var movey = 0

    listen(container, 'mousemove', function(ev){

        movey = ev.offsetX
        if(movey < halfw){
            movey = -(halfw - movey) / halfw * opt.angle
        }else if(movey >= halfw){
            movey = (movey - halfw) / halfw * opt.angle
        }

        movex = ev.offsetY

        if(movex < halfh){
            movex = (halfh - movex) / halfh * opt.angle
        }else if(movex >= halfh){
            movex = -(movex - halfh) / halfh * opt.angle
        }

        container.style.transform = 'rotateX(' + movex + 'deg) rotateY(' + movey + 'deg)'

    })

    listen(parentDom, 'mouseenter', function(){
        container.style['box-shadow'] = opt.shadow
    })

    listen(parentDom, 'mouseleave', function(){
        container.style['box-shadow'] = ''
        container.style.transform = 'rotateX(' + 0 + 'deg) rotateY(' + 0 + 'deg)'
    })
}