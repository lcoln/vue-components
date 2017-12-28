/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";


//设置幻灯片样式
function setBoxStyle(container, box){
    var i = 0,
        len = box.length

    if(this.type == 1){
        container.style.cssText = 'width: ' + this.maxPage * 100 + '%;'
        for(;i < len;i++){
            box[i].className += ' left'
            box[i].style.cssText = 'float: left;width: ' + 100 / this.maxPage + '%;transition: .4s;'
        }
    }else if(this.type == 2){
        container.style.cssText = 'height: ' + this.maxPage * 100 + '%;width: 100%;'
        for(;i < len;){
            box[i++].style.cssText = 'height: ' + 100 / this.maxPage + '%;transition: .4s;'
        }
    }

}

//设置导航样式(预览)
function fillNavWhitoutPreview(width){
    var navHtml = []
    // var style = width > 0 ? 'style="width: "'
    for(var i = 0;i < this.maxPage;i++){
        var className = i + 1 == this.curPage ? 'act' : ''

        navHtml.push('<div class="ui-sliders-nav-btn ' + className + '" data-index="' + (i + 1) + '"></div>')
    }
    return navHtml.join('')
}

//设置导航样式(无预览)
function fillNavWhitPreview(parentDom, config){

    var width = parentDom.offsetWidth * 0.8 - 60
    var left = parentDom.offsetWidth * 0.1 + 30
    this.maxPreview = Math.floor(width / 110)
    var box = '<div class="ui-sliders-preview-box" style="width: ' + width + 'px;left: ' + left + 'px;"><div class="ui-sliders-preview-content" style="width: ' + this.maxPage * 110 + 'px;">'

    var tmp = []
    for(var i = 0;i < this.maxPage;i++){
        var className = i + 1 == this.curPage ? 'act' : ''
        tmp.push('<div class="' + className + '"><img src="' + config.source[i] + '" data-index="' + (i + 1) + '" /></div>')
    }
    box += tmp.join('') + '</div></div>'
    return box
}

class UiSliders{

    constructor(){
        this.id = Date.now() + '_UiSliders'
        this.hasCss = false
        this.type = 1
        this.curPage = 1
        this.preview = false
        this.hasCss = false
        this.maxPreview = 0
    }

    init(parentId, childId, config){
        config = config ? config : {}

        var parentDom = document.getElementById(parentId),
            childHtml = parentDom.innerHTML,
            container = document.createElement('section'),
            _self = this

        for(var it in config){
            if(this[it] || this.hasOwnProperty(it)){
                this[it] = config[it]
            }
        }

        this.maxPage = parentDom.children.length

        container.className = 'ui-sliders'
        container.innerHTML = childHtml
        var box = container.querySelectorAll('.' + childId)

        setBoxStyle.call(this, container, box)

        if(!UiSliders.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/sliders/sliders.css">'
        }
        UiSliders.prototype.hasCss = true


        var typeBox = document.createElement('div')
        typeBox.className = this.type == 1 ? ' ui-sliders-horizontal ' : ' ui-sliders-vertical '
        typeBox.className += this.preview ? ' ui-sliders-preview ' : ' ui-sliders-nopreview '
        typeBox.style.cssText = 'position: relative;overflow: hidden;width: 100%;height: 100%;'
        typeBox.appendChild(container)


        var navGroup = document.createElement('section')
        navGroup.className = 'ui-sliders-nav-group'

        var firstChild = null,
            lastChild = null,
            nav = null

        if(this.preview){
            navGroup.innerHTML = fillNavWhitPreview.call(this, parentDom, config)

            navGroup.innerHTML = '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe697;</a>' + navGroup.innerHTML + '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe6a7;</a>'
            typeBox.appendChild(navGroup)

            firstChild = navGroup.firstChild
            lastChild = navGroup.lastChild
            nav = navGroup.querySelector('.ui-sliders-preview-content')

        }else{
            navGroup.innerHTML = fillNavWhitoutPreview.call(this)
            typeBox.appendChild(navGroup)
            typeBox.innerHTML = '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe697;</a>' + typeBox.innerHTML + '<a class="iconfont ui-sliders-btn" href="javascript:;">&#xe6a7;</a>'

            firstChild = typeBox.firstChild
            lastChild = typeBox.lastChild
            nav = typeBox.querySelector('.ui-sliders-nav-group')

        }

        common.listenEvent(firstChild, 'click', function(ev){
            _self.curPage = _self.curPage == 1 ? _self.maxPage : (_self.curPage - 1)
        })

        common.listenEvent(lastChild, 'click', function(ev){
            _self.curPage = (_self.curPage == _self.maxPage) ? 1 : (_self.curPage + 1)
        })

        common.listenEvent(nav, 'click', function(ev){
            var index = ev.target.getAttribute('data-index')
            if(index){
                _self.curPage = index - 0
            }
        })

        parentDom.innerHTML = ''
        parentDom.appendChild(typeBox)



        common.observable(this, 'curPage', function(v){
            var container = typeBox.querySelector('.ui-sliders'),
                box = [].slice.call(container.querySelectorAll('.' + childId)),
                btns = null,
                i = 0,
                len = box.length,
                movex = _self.maxPreview - v;

            if(!_self.preview){
                btns = typeBox.querySelector('.ui-sliders-nav-group').children
                for(;i < len;i++){
                    box[i].style.opacity = i + 1 == v ? 1 : 0
                    btns[i].className = i + 1 == v ? 'ui-sliders-nav-btn act' : 'ui-sliders-nav-btn'
                }

            }else{
                btns = typeBox.querySelector('.ui-sliders-preview-content').children
                for(;i < len;i++){
                    box[i].style.opacity = i + 1 == v ? 1 : 0
                    btns[i].className = i + 1 == v ? 'act' : ''
                }
                typeBox.querySelector('.ui-sliders-preview-content').style.transform = movex < 0 ? 'translate(' + movex * 110 + 'px, 0)' : 'translate(0, 0)'

            }

            container.style.cssText += 'transform: translate(' + (_self.curPage - 1) * (-100 / _self.maxPage) + '%, 0)'
        })


    }


}

export default UiSliders
