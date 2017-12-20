/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";


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

function method(html, opt){
    this.html = html
    this.$callback['yes'] = opt.yes ? opt.yes : function(){}
    this.$callback['no'] = opt.no ? opt.no : function(){}
    this.title = opt.title ? opt.title : '提示'
    this.icon = opt.icon ? icon[opt.icon] : '&#xe6af;'
    this.show = true
}

let toString = Object.prototype.toString

class Layer{

    constructor(){
        this.id = Date.now() + '_Layer'
        this.title = '提示'
        this.html = ''
        this.type = 5
        this.layerId = ''
        this.$callback = {}
        this.icon = '&#xe6af;'
        this.promptVal = ''
        this.show = false
    }

    init(){
        var _this = this

        var div = document.createElement('div')

        div.innerHTML = '<div id="UiLayer" class="ui-layer"><i class="ui-layer-drag ui-fn-noselect ui-layer-icon iconfont">' + this.icon + '</i><span class="ui-layer-drag ui-layer-title ui-fn-noselect"><span class="ui-layer-title-text">' + this.html + '</span><a class="ui-layer-close iconfont" href="javascript:;">✗</a></span><div class="ui-layer-content ui-fn-noselect"><p class="ui-layer-content-html">' + this.html + '</p><input class="ui-layer-prompt-val" type="text" /></div><div class="ui-layer-group-btn ui-fn-noselect"><a href="javascript:;" class="ui-layer-btn ui-layer-yes">确定</a><a href="javascript:;" class="ui-layer-btn ui-layer-no">取消</a></div></div><div class="ui-layer-shade"></div><div class="ui-layer-loading"><span class="point point1"></span><span class="point point2"></span><span class="point point3"></span><span class="point point4"></span><span class="point point5"></span></div>'

        require('./main.css')

        common.listenEvent(div.querySelector('.ui-layer-close'), 'click', function(){
            _this.close()
        })

        common.listenEvent(div.querySelector('.ui-layer-no'), 'click', function(){
            _this.close()
        })

        common.listenEvent(div.querySelector('.ui-layer-yes'), 'click', function(){
            _this.yes()
        })

        common.listenEvent(div.querySelector('.ui-layer-prompt-val'), 'change', function(v){
            _this.promptVal = div.querySelector('.ui-layer-prompt-val').value
        })





        common.observable(this, 'type', function(v){

            if(v <= 3)
                getLayerPosition(_this)

        })

        common.observable(this, ['title', 'html', 'icon', 'promptVal'], function(v, k){
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

        common.observable(this, 'show', function(v){
            var type = _this.type
            div.querySelector('.ui-layer-shade').style.display = v ? 'block' : 'none'

            div.querySelector('.ui-layer-group-btn').style.display = type == 1 ? 'none' : 'block'
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
    }

    yes(){
        this.show = false
        if(this.$callback['yes']){
            if(this.promptVal){
                this.$callback['yes'](this.promptVal)
                this.promptVal = ''
            }else{
                this.$callback['yes']()
            }
        }
    }

    alert(html,opt = {}){
        this.type = 1
        method.apply(this, arguments)
    }

    confirm(html,opt = {}){
        this.type = 2
        method.apply(this, arguments)
    }

    prompt(html, opt = {}){
        this.type = 3
        method.apply(this, arguments)
    }

    loading(cb){
        this.type = 4
        if(toString.call(cb) !== '[object Function]')
            return
        cb && cb()
        this.show = true
    }

    close(ev){
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

let UiLayer = new Layer()
UiLayer.init()

export default UiLayer
