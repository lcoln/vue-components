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
        layer = document.getElementById('UiLayer')
        if(vm.type <= 3){
            vw = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
            vh = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight
            x = (vw - layer.offsetWidth) / 2
            y = (vh - layer.offsetHeight) / 2
        }
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

var Layer = function (){
    this.id = Date.now() + '_layer'
}
Layer.prototype = {
    title: '提示',
    html: '',
    type: 5,
    layerId: '',
    $callback: {},
    icon: '&#xe6af;',
    promptVal: '',
    show: false,
    init: function(){
        var _this = this

        if(!Layer.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/layer/layer.css">'
        }
        Layer.prototype.hasCss = true

        var div = document.createElement('div')

        div.innerHTML = '<div id="UiLayer" class="ui-layer"><i class="ui-layer-drag ui-fn-noselect ui-layer-icon iconfont">' + this.icon + '</i><span class="ui-layer-drag ui-layer-title ui-fn-noselect"><span class="ui-layer-title-text">' + this.html + '</span><a class="ui-layer-close iconfont" href="javascript:;">✗</a></span><div class="ui-layer-content ui-fn-noselect"><p class="ui-layer-content-html">' + this.html + '</p><input class="ui-layer-prompt-val" type="text" /></div><div class="ui-layer-group-btn ui-fn-noselect"><a href="javascript:;" class="ui-layer-btn ui-layer-yes">确定</a><a href="javascript:;" class="ui-layer-btn ui-layer-no">取消</a></div></div><div class="ui-layer-shade"></div><div class="ui-layer-loading"><span class="point point1"></span><span class="point point2"></span><span class="point point3"></span><span class="point point4"></span><span class="point point5"></span></div>'

        listenEvent(div.querySelector('.ui-layer-close'), 'click', function(){
            _this.close()
        })

        listenEvent(div.querySelector('.ui-layer-no'), 'click', function(){
            _this.$callback['no'] && _this.$callback['no']()
            _this.close()
        })

        listenEvent(div.querySelector('.ui-layer-yes'), 'click', function(){
            _this.yes()
        })

        listenEvent(div.querySelector('.ui-layer-prompt-val'), 'change', function(v){
            _this.promptVal = div.querySelector('.ui-layer-prompt-val').value
        })





        observable(this, 'type', function(v){

            if(v <= 3)
                getLayerPosition(_this)

        })

        observable(this, ['title', 'html', 'icon', 'promptVal'], function(v, k){
            if(k === 'title'){
                div.querySelector('.ui-layer-title-text').innerHTML = v
            }else if(k === 'html'){
                div.querySelector('.ui-layer-content-html').innerHTML = v
            }else if(k === 'icon'){
                div.querySelector('.ui-layer-icon').innerHTML = v
            }else if(k === 'promptVal'){
                div.querySelector('.ui-layer-prompt-val').value = v
            }
        })

        observable(this, 'show', function(v){
            var type = _this.type
            div.querySelector('.ui-layer-shade').style.display = v ? 'block' : 'none'
            if(type <= 3){
                div.querySelector('.ui-layer').style.display = v ? 'block' : 'none'
                if(type == 3)
                    div.querySelector('.ui-layer-prompt-val').style.display = v ? 'block' : 'none'
            }

            if(type == 4){
                div.querySelector('.ui-layer-loading').style.display = v ? 'block' : 'none'
            }
        })

        document.body.appendChild(div)

        window.onresize = function(){
            getLayerPosition(_this)
        }
    },
    render: function(container){

    },
    yes: function(){
        this.show = false
        if(this.$callback['yes']){
            if(this.promptVal){
                this.$callback['yes'](this.promptVal)
                this.promptVal = ''
            }else{
                this.$callback['yes']()
            }
        }
    },
    alert: function(html,opt){
        this.type = 1
        this.html = html
        this.$callback['no'] = opt.callback ? opt.callback : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : '&#xe6af;'
        this.show = true
    },
    confirm: function(html,opt){
        this.type = 2
        this.html = html
        this.$callback['yes'] = opt.yes ? opt.yes : function(){}
        this.$callback['no'] = opt.no ? opt.no : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : '&#xe6af;'
        this.show = true
    },
    prompt: function(html, opt){
        this.type = 3
        this.html = html
        this.$callback['yes'] = opt.yes ? opt.yes : function(){}
        this.$callback['no'] = opt.no ? opt.no : function(){}
        this.title = opt.title ? opt.title : '提示'
        this.icon = opt.icon ? icon[opt.icon] : '&#xe6af;'
        this.show = true
    },
    loading: function(opt){
        this.type = 4
        this.$callback.callback = opt && opt.callback ? opt.callback : function(){}
        this.show = true
    },
    close: function(ev){
        this.show = false
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

Layer.prototype.hasCss = false

Layer.prototype.init()

window.UiLayer = new Layer()