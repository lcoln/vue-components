/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */
'use strict'

import * as common from "common";


class UiPointerHover{
    constructor(){

    }

    init(elm, opts){
        if(Object.prototype.toString.call(opts) !== '[object Object]')
            opts = {}
        opts.angle = opts.angle ? opts.angle.replace('deg', '') : 10
        opts.shadow = opts.shadow ? opts.shadow : '0 10px 30px rgba(0, 0, 0, .4)'

        var parentDom = document.getElementById(elm)
        parentDom.style.cssText = 'background: none;perspective: 800px;transform-style: preserve-3d;'


        var container = document.createElement('section')
        container.style.cssText = 'width: 100%;height: 100%;transform-style: preserve-3d;perspective: 800px;transition: .3s;'

        var i = 0, len = parentDom.children.length

        for(;i < len;){
            container.appendChild(parentDom.children[i++])
        }

        parentDom.appendChild(container)

        var curHeight = (window.getComputedStyle ? (window.getComputedStyle(parentDom).height).replace('px', '') : parentDom.offsetHeight) >> 0
        var curWidth = (window.getComputedStyle ? (window.getComputedStyle(parentDom).width).replace('px', '') : parentDom.offsetWidth) >> 0

        //当前元素的一半的宽与高
        var halfh = curHeight / 2
        var halfw = curWidth / 2

        //垂直与水平方向移动时平均应该改变的角度值
        var moveh = opts.angle / curHeight
        var movew = opts.angle / curWidth

        //最终应该改变的角度值
        var movex = 0
        var movey = 0

        common.listenEvent(container, 'mousemove', function(ev){

            movey = ev.offsetX
            if(movey < halfw){
                movey = -(halfw - movey) / halfw * opts.angle
            }else if(movey >= halfw){
                movey = (movey - halfw) / halfw * opts.angle
            }

            movex = ev.offsetY
            //如果在重心以上，水平的角度则为 (一半高度-移动距离) * 平均应该改变的角度值
            if(movex < halfh){
                movex = (halfh - movex) * moveh
            }else if(movex >= halfh){
                movex = -(movex - halfh) * movew
            }

            container.style.transform = 'rotateX(' + movex + 'deg) rotateY(' + movey + 'deg)'
        })

        common.listenEvent(parentDom, 'mouseenter', function(){
            container.style['box-shadow'] = opts.shadow
        })

        common.listenEvent(parentDom, 'mouseleave', function(){
            container.style['box-shadow'] = ''
            container.style.transform = 'rotateX(' + 0 + 'deg) rotateY(' + 0 + 'deg)'
        })
    }
}

export default UiPointerHover