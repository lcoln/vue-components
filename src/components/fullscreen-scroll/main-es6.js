/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";

class UiFullScreenScroll{


    constructor(){
        this.curPage = 0
        this.id = Date.now() + '_scroll'

    }

    static curHeight(el){
        return (window.getComputedStyle ? (window.getComputedStyle(el).height).replace('px', '') : el.offsetHeight) >> 0
    }

    $el(parendId, childId, time){
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
                common.listenEvent(btn, 'click', function(){
                    _this.curPage = i
                    container.style.transform = 'translate(0px, ' + -UiFullScreenScroll.curHeight(parentDom) * _this.curPage + 'px)'
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

    init(parendId, childId, time){
        this.el = this.$el(parendId, childId, time)
        var container = this.el.querySelector('.' + childId).parentNode,
            childDom = container.childNodes,
            len = container.childNodes.length

        var mouseWheelEv = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll": "mousewheel",
        direction = /Firefox/i.test(navigator.userAgent) ? "detail": "deltaY",
        now = Date.now()
        var _this = this
        common.listenEvent(this.el, mouseWheelEv, function(ev){
            if(Date.now() - now > 1000){
                if(ev[direction] > 0){
                    _this.curPage = (_this.curPage + 1 < len) ? (_this.curPage + 1) : 0
                }else{
                    _this.curPage = (_this.curPage - 1 >= 0) ? (_this.curPage - 1) : len - 1

                }
                container.style.transform = 'translate(0px, ' + -UiFullScreenScroll.curHeight(_this.el) * _this.curPage + 'px)'
                now = Date.now()
            }
        })
        common.listenEvent(window, 'resize', function(){

            container.style.transform = 'translate(0px, ' + -UiFullScreenScroll.curHeight(_this.el) * _this.curPage + 'px)'
            setTimeout(function(){
                container.style.transition = time.indexOf('s') < 0 ? time + 's' : time
            }, 0)
        })


        common.observable(this, 'curPage', function(index){
            var btnGroup = document.getElementById('ui-fullpage-btn-' + _this.id),
                span = btnGroup.childNodes

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

}

export default UiFullScreenScroll
