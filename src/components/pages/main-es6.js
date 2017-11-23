/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";
let skin = ['blue', 'green', 'pine', 'green1', 'yellow']
class Pages{

    constructor(){
        this.id = Date.now() + '_pages'
        this.max = 5
        this.total = 0
        this.skin = 'blue'
        this.msg = ''
        this.curr = 1
        this.callback = function(){}
    }

    checkFields(para, fields){
        for(let it of fields){
            if(!para[it] && para[it] != 0)
                return it
        }
        return true
    }

    init(parendId, config, callback){
        let parentDom = document.getElementById(parendId)
        if(!parentDom)
            return
        let container = document.createElement('div')
        container.className = ` ui-fn-noselect ui-pages ${this.skin}`
        for(let it of Object.keys(config)){
            if(it === 'skin' && !skin.includes(config[it]))
                continue
            if(this[it] || this[it] == 0)
                this[it] = config[it]
        }
        if(this.total > 0){
            this.render(container, this.calculate(1))
        }
        parentDom.appendChild(container)
        require('./pages.css')

        this.callback = callback
        let _this = this
        common.listenEvent(container, 'click', function(ev){
            let target = ev.target
            let curr = _this.curr
            if(target.nodeName === 'SPAN' && target.innerHTML !== '...'){

                if(parseInt(target.innerHTML) > 0){curr = parseInt(target.innerHTML);}
                if(target.innerHTML === '首页'){curr = 1}
                if(target.innerHTML === '«' && _this.curr > 1){curr = --curr}
                if(target.innerHTML === '»' && curr < _this.total){
                    curr = ++curr
                }
                if(target.innerHTML === '未页'){curr = _this.total}

                // console.log(curr, curr);
                _this.jump(container, curr)
            }
        })

    }

    render(container, pages){
        if(pages.length > 0 && container){
            let dom = '<span class="first">首页</span><span>«</span>'

            if(this.curr - Math.floor(this.max /2) > 1 && this.total > this.max)
                dom += '<span>...</span>'

            pages.map((v, i) => {
                dom += v
            })

            if(this.total - this.curr > Math.floor(this.max /2) && this.total > this.max)
                dom += '<span>...</span>'

            dom += '<span>»</span><span class="last">未页</span>'
            container.innerHTML = dom

            for(let i = 0, len = container.children.length;i < len;i++){
                if(container.children[i].innerHTML == this.curr)
                    container.children[i].className = 'active'
            }
        }
    }

    jump(container, curr){
        if(curr < 1 || curr > this.total)
            return

        if(!(curr >> 0 > 0)){
            this.msg = '页码不符合格式'
        }
        else if(curr > this.total){
            this.msg = '页数不能超过' + this.total + '页'
        }

        if(this.msg){
            return setTimeout(function(){
                this.msg = ''
            },1000)
        }
        this.curr = curr
        this.render(container, this.calculate(curr))
        this.callback && this.callback(curr)
    }

    calculate(curr){

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

export default Pages
