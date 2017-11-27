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

var layer = null,
    offset = [],
    icon = {
        1: '&#xe6af;',      //笑脸
        2: '&#xe69c;',      //哭脸
        3: '&#xe6a4;',      //感叹号
        4: '&#xe6a3;',      //问号
        5: '&#xe6a0;',      //星星
        6: '&#xe6b1;'       //成功
    }

function getLayerPosition(vm){
    setTimeout(function(){
        var vw,vh,x,y
        layer = document.getElementById('layer')
        vw = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
        vh = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight
        x = (vw - layer.offsetWidth) / 2
        y = (vh - layer.offsetHeight) / 2
        layer.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    }, 0)
}

function move(ev){
    if(ev.type != 'contextmenu'){
        var mx = ev.pageX - layer.getAttribute('ox')
        var my = ev.pageY - layer.getAttribute('oy')
        var curLeft = mx + (offset[0] >> 0)
        var curTop = my + (offset[1] >> 0)
        layer.style.transform = 'translate(' + curLeft + 'px,' + curTop + 'px)'
    }
}

document.addEventListener('mousedown',function(ev){
    if(ev.type != 'contextmenu'){
        layer = ev.target.offsetParent
        if(layer && /ui-layer-title/.test(ev.target.className)){
            offset = layer.style.transform.replace(/[^\d,.]/g,'').split(',')
            layer.setAttribute('ox', ev.pageX)
            layer.setAttribute('oy', ev.pageY)
            document.addEventListener('mousemove',move)
        }
    }
})

document.addEventListener('mouseup',function(){
    document.removeEventListener('mousemove',move)
    offset = layer = null
})

document.addEventListener('contextmenu',function(){
    document.removeEventListener('mousemove',move)
    offset = layer = null
})

window.UiLayer = function (){
    this.id = Date.now() + '_layer'
}
UiLayer.prototype = {
    title: '提示',
    html: '',
    type: 5,
    layerId: '',
    $callback: {},
    icon: '',
    promptVal: '',
    init: function(){
        var _this = this

        if(!UiLayer.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/layer/layer.css">'
        }
        UiLayer.prototype.hasCss = true

        var div = document.createElement('div')

        div.innerHTML = '<div id="layer" class="ui-layer"><span class="ui-layer-title fn-noselect">'+ this.title +'<a class="ui-layer-close iconfont" href="javascript:;">✗</a></span><div class="ui-layer-content fn-noselect" id="layer-content"></div><div class="ui-layer-group-btn fn-noselect"><a href="javascript:;" class="ui-layer-btn ui-layer-yes">确定</a><a href="javascript:;" class="ui-layer-btn ui-layer-no">取消</a></div></div><div class="ui-layer-shade"></div><div class="ui-layer-loading"><span class="point point1"></span><span class="point point2"></span><span class="point point3"></span><span class="point point4"></span><span class="point point5"></span></div>'
        console.log(div);
        document.body.appendChild(div)

        observable(this, 'type', function(v){

            if(v <= 2){
                getLayerPosition(_this)
            }
        })

        observable(this, 'msg', function(v){

        })

        window.onresize = function(){
            getLayerPosition(_this)
        }
    },
    render: function(container){

    },
    yes: function(){
        if(this.$callback['yes']){
            if(this.promptVal){
                this.$callback['yes'](this.promptVal)
            }
        }
    },
    alert: function(html,opt){
        this.type = 1
        this.html = html
        this.$callback['no'] = opt.callback ? opt.callback : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : ''
    },
    confirm: function(html,opt){
        this.type = 2
        this.html = html
        this.$callback['yes'] = opt.yes ? opt.yes : function(){}
        this.$callback['no'] = opt.no ? opt.no : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : ''
    },
    prompt: function(html, opt){
        this.type = 3
        this.html = html
        this.$callback['yes'] = opt.yes ? opt.yes : function(){}
        this.$callback['no'] = opt.no ? opt.no : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : ''
    },
    loading: function(opt){
        this.type = 4
        this.$callback.callback = opt && opt.callback ? opt.callback : function(){}
    },
    close: function(ev){
        this.html = ''
        this.title = '提示'
        this.icon = '&#xe6af;'
        this.promptVal = ''
        if(this.$callback['no']){
            this.$callback['no']()
            delete this.$callback['no']
        }
        this.$callback = {}
        this.type = 5
    }
}

UiLayer.prototype.hasCss = false

UiLayer.prototype.init()