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

var skin = ['blue', 'green', 'pine', 'darkGreen', 'yellow']
window.UiPages = function (){

    this.init = function(parendId, config, callback){
        var parentDom = document.getElementById(parendId)
        if(!parentDom)
            return

        for(var it of Object.keys(config)){
            if(it === 'skin' && !skin.includes(config[it]))
                continue
            if(this[it] || this[it] == 0){
                this[it] = config[it]
            }
        }

        var container = document.createElement('div')
        container.className = ` ui-fn-noselect ui-pages ${this.skin}`

        if(this.total > 0){
            this.render(container, this.calculate(1))
        }
        parentDom.appendChild(container)

        if(!UiPages.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/pages/pages.css">'
        }
        UiPages.prototype.hasCss = true

        this.callback = callback
        var _this = this
        listen(container, 'click', function(ev){
            var target = ev.target
            var curr = _this.curr
            var total = _this.total
            if(target.nodeName === 'SPAN' && target.innerHTML !== '...' && target.className !== 'jump'){

                if(parseInt(target.innerHTML) > 0){curr = parseInt(target.innerHTML);}
                if(target.innerHTML === '首页'){curr = 1}
                if(target.innerHTML === '«' && curr > 1){curr = --curr}
                if(target.innerHTML === '»' && curr < total){curr = ++curr}
                if(target.innerHTML === '未页'){curr = total}

                // console.log(curr, curr);
                _this.jump(container, curr)
            }

            if(target.nodeName === 'SPAN' && target.className === 'jump'){
                var txt = container.getElementsByTagName('input')[0].value
                // console.log(txt);
                if(txt <= 0)
                    return _this.msg = '页数必须大于0'
                if(txt > total)
                    return _this.msg = `最大页数是${total}`
                if(txt % 1 !== 0)
                    return _this.msg = `页数必须是整数`

                _this.jump(container, txt)
                container.getElementsByTagName('input')[0].value = txt

            }
        })

        observable(this, 'msg', function(msg){
            var span = document.createElement('span')
            span.className = 'msg'
            span.innerHTML = msg
            container.appendChild(span)
            setTimeout(function(){
                container.removeChild(span)
            }, 1000)
        })

    }
}

UiPages.prototype = {
    id: Date.now() + '_pages',
    max: 5,
    total: 0,
    skin: 'blue',
    msg: '',
    curr: 1,
    showJumpBtn: false,
    callback: function(){},
    /**
     * [渲染dom结构]
     * @param  {Dom} container [页码容器]
     * @param  {Array} pages      [返回dom字符串]
     * @return {Dom}           [重新渲染dom结构]
     */
    render: function(container, pages){
        if(pages.length > 0 && container){
            var dom = '<span class="first">首页</span><span>«</span>'

            if(this.curr - Math.floor(this.max /2) > 1 && this.total > this.max)
                dom += '<span>...</span>'

            pages.map((v, i) => {
                dom += v
            })

            if(this.total - this.curr > Math.floor(this.max /2) && this.total > this.max)
                dom += '<span>...</span>'

            dom += '<span>»</span><span class="last">未页</span>'

            if(this.showJumpBtn)
                dom += '<input type="text" class="txt" /><span class="jump" href="javascript:;">跳转</span>'

            container.innerHTML = dom

            var firstChild = container.firstChild
            while (firstChild) {
                if(firstChild.innerHTML == this.curr){
                    firstChild.className = 'active'
                }
                firstChild = firstChild.nextSibling
            }
        }
    },
    /**
     * [跳转]
     * @param  {Dom} container [页码容器]
     * @param  {Number} curr      [当前跳转页码]
     * @return {Dom}           [重新渲染dom结构]
     */
    jump: function(container, curr){
        if(curr < 1 || curr > this.total)
            return

        if(!(curr >> 0 > 0)){
            this.msg = '页码不符合格式'
        }
        else if(curr > this.total){
            this.msg = '页数不能超过' + this.total + '页'
        }

        this.curr = curr
        this.render(container, this.calculate(curr))
        this.callback && this.callback(curr)
    },
    /**
     * [根据当前页码计算得出dom字符串]
     * @param  {Number} curr [当前页码]
     */
    calculate: function(curr){

        var dis = Math.floor(this.max / 2)
        var start
        if(this.total - curr < dis && this.total >= this.max)
            start = this.total - (this.max - 1)
        else if(curr - dis > 0 && this.total >= this.max)
            start = curr - dis
        else
            start = 1

        var end = start + (this.max - 1) < this.total ? start + (this.max - 1) : this.total
        var pages = []
        for(var i = 0,s = start,e = end;i<this.max;i++,s++){
            if(s <= e)
                pages[i] = `<span>${s}</span>`
        }
        return pages
    }
}

UiPages.prototype.hasCss = false