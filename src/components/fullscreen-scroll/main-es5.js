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

window.UiFullScreenScroll = function (parendId, childId, time){
    this.id = Date.now() + '_scroll'
    this.curPage = 0
}

UiFullScreenScroll.prototype.init = function(parendId, childId, time){
    this.el = this.$el(parendId, childId, time)
    var container = this.el.querySelector('.' + childId).parentNode,
        len = container.childNodes.length

    var mouseWheelEv = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll": "mousewheel",
        direction = /Firefox/i.test(navigator.userAgent) ? "detail": "deltaY",
        now = Date.now(),
        _this = this
    listen(this.el, mouseWheelEv, function(ev){
        if(Date.now() - now > 1000){
            if(ev[direction] > 0){
                _this.curPage = (_this.curPage + 1 < len) ? (_this.curPage + 1) : 0
            }else{
                _this.curPage = (_this.curPage - 1 >= 0) ? (_this.curPage - 1) : len - 1

            }
            container.style.transform = 'translate(0px, ' + -_this.curHeight() * _this.curPage + 'px)'
            now = Date.now()
        }
    })

    listen(window, 'resize', function(){

        container.style.transform = 'translate(0px, ' + -_this.curHeight() * _this.curPage + 'px)'
        setTimeout(function(){
            container.style.transition = time.indexOf('s') < 0 ? time + 's' : time
        }, 0)
    })

    observable(this, 'curPage', function(index){
        var span = document.getElementById('ui-fullpage-btn-' + _this.id).childNodes
        console.log(span);
        for(var i = 0;i < span.length;i++){
            if(i == index){
                span[index].style.background = '#f30'
                span[index].style.transform = 'scale(1.5)'
            }else{
                span[i].style.background = 'rgba(255,255,255,.6)'
                span[i].style.transform = ''
            }
        }

    })
}

UiFullScreenScroll.prototype.$el = function(parendId, childId, time){
    var parentDom = document.getElementById(parendId)

    var childDom = parentDom.querySelectorAll('.' + childId)
    var container = document.createElement('section')
    var btnGroup = container.cloneNode(false)

    var span = document.createElement('span')
    var frag = document.createDocumentFragment()
    var transition = time.indexOf('s') < 0 ? time + 's' : time
    var _this = this
    for(var i = 0;i < childDom.length;i++){
        container.appendChild(childDom[i])
        var btn = span.cloneNode(false)
        btn.style.cssText = 'display: inline-block;width: 10px;height: 10px;border-radius: 100%;background: rgba(255,255,255,.6);transition: .4s;'
        if(i == 0){
            btn.style.background = '#f30'
            btn.style.transform = 'scale(1.5)'
        }
        ;(function(i){
            listen(btn, 'click', function(){
                _this.curPage = i
                container.style.transform = 'translate(0px, ' + -_this.curHeight() * _this.curPage + 'px)'
            })
        })(i);
        frag.appendChild(btn)
    }
    btnGroup.appendChild(frag)
    btnGroup.style.cssText = 'position: absolute;right: 10px;top: 50%;width: 10px;text-align: center;transform: translate(0, -50%);transition: '+ transition +';'
    btnGroup.id = 'ui-fullpage-btn-' + this.id

    container.style.cssText = 'width: 100%;height: 100%;transition: ' + transition + ';'
    container.id = 'pageName-' + this.id

    parentDom.style.cssText = 'position: relative;overflow: hidden;'
    parentDom.appendChild(container)
    parentDom.appendChild(btnGroup)

    return parentDom
}

UiFullScreenScroll.prototype.curHeight = function(){
    return (window.getComputedStyle ? (window.getComputedStyle(this.el).height).replace('px', '') : this.el.offsetHeight) >> 0
}