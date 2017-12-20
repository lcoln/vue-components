<template>
    <div>
        <div id="UiLayer" class="ui-layer" v-show="type <= 3">
            <i class="ui-layer-drag ui-fn-noselect ui-layer-icon iconfont" v-if="icon !== ''" v-html="icon"></i>
            <span class="ui-layer-drag ui-layer-title ui-fn-noselect">
                {{title}}
                <a class="ui-layer-close iconfont" href="javascript:;" @click="close">✗</a>
            </span>
            <div class="ui-layer-content ui-fn-noselect" id="layer-content">
                {{html}}
                <input class="prompt-val" v-if="type == 3" type="text" v-model="promptVal" />
            </div>
            <div class="ui-layer-group-btn ui-fn-noselect" v-show="type >= 2">
                <a href="javascript:;" class="ui-layer-btn ui-layer-yes" @click="yes">确定</a>
                <a href="javascript:;" class="ui-layer-btn ui-layer-no" @click="close">取消</a>
            </div>
        </div>
        <div class="ui-layer-shade" v-show="type <= 4"></div>
        <div v-show="type == 4" class="ui-layer-loading">
            <span class="point point1"></span>
            <span class="point point2"></span>
            <span class="point point3"></span>
            <span class="point point4"></span>
            <span class="point point5"></span>
        </div>
    </div>
</template>

<script>

    import vue from 'vue'

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

    function move(ev){
        if(ev.type != 'contextmenu'){
            var mx = ev.pageX - layer.getAttribute('ox')
            var my = ev.pageY - layer.getAttribute('oy')
            var curLeft = mx + (offset[0] >> 0)
            var curTop = my + (offset[1] >> 0)
            layer.style.transform = 'translate(' + curLeft + 'px,' + curTop + 'px)'
        }
    }

    function getLayerPosition(vm){
        vue.nextTick(function(){
            var vw,vh,x,y
            layer = document.getElementById('UiLayer')
            if(vm.type <= 3){
                vw = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
                vh = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight
                x = (vw - layer.offsetWidth) / 2
                y = (vh - layer.offsetHeight) / 2
            }
            layer.style.transform = 'translate(' + x + 'px,' + y + 'px)'
        })
    }

    var listen = (function(){
        if(window.addEventListener){
            return function(dom, event, fn, capture){
                dom.addEventListener(event, function(ev){
                    fn.call(dom, ev)
                }, capture)
            }
        }else if(window.attachEvent){
            return function(dom, event, fn, capture){
                dom.attachEvent('on' + event, function(ev){
                    fn.call(dom, ev)
                })
            }
        }else{
            dom['on' + event] = fn
        }
    })()

    listen(document, 'mousedown',function(ev){
        if(ev.type != 'contextmenu'){
            layer = ev.target.offsetParent
            if(layer && /ui-layer-drag/.test(ev.target.className)){
                offset = layer.style.transform.replace(/[^\d,.]/g,'').split(',')
                layer.setAttribute('ox', ev.pageX)
                layer.setAttribute('oy', ev.pageY)
                document.addEventListener('mousemove',move)
            }
        }
    })

    listen(document, 'mouseup',function(){
        document.removeEventListener('mousemove',move)
        offset = layer = null
    })

    listen(document, 'contextmenu',function(){
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


    export default {
        data () {
            return {
                title: '提示',
                html: '',
                type: 5,
                $callback: {},
                icon: icon[1],
                promptVal: ''
            }
        },
        mounted () {
            this.$callback = {}
            window.onresize = function(){
                getLayerPosition(this)
            }

        },
        methods: {
            alert: function(html,opt = {}){
                this.type = 1
                method.apply(this, arguments)
            },
            confirm: function(html,opt = {}){
                this.type = 2
                method.apply(this, arguments)
            },
            prompt: function(html, opt = {}){
                this.type = 3
                method.apply(this, arguments)
            },
            loading: function(callback){
                this.type = 4
                callback && callback()
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
            },
            yes: function(){
                if(this.$callback['yes']){
                    if(this.promptVal){
                        this.$callback['yes'](this.promptVal)
                    }else{
                        this.$callback['yes']()
                    }
                }
                this.close()
            }
        },
        watch: {
            type: function (t) {
                if(t <= 3)
                    getLayerPosition(this)
            }
        }
    }


</script>

<style>
    @import './layer.css';
</style>