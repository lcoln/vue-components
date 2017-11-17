/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */
'use strict'

import * as common from "common";

var pageNums = 0


class hover{
    constructor(){
        this.in = (elm, opt) => {
            if(Object.prototype.toString.call(opt) !== '[object Object]')
                opt = {}
            opt.angle = opt.angle ? opt.angle.replace('deg', '') : 10
            opt.shadow = opt.shadow ? opt.shadow : '0 10px 30px rgba(0, 0, 0, .4)'

            var parentDom = document.getElementById(elm)
            parentDom.style.perspective = '1000px'
            parentDom.style['transform-style'] = 'preserve-3d'
            parentDom.style.background = ''


            var container = document.createElement('section')
            container.style.perspective = '1000px'
            container.style['transform-style'] = 'preserve-3d'
            container.style.width = '100%'
            container.style.height = '100%'
            container.style.transition = '.3s'

            for(let i = 0;i < parentDom.children.length;i++){
                container.appendChild(parentDom.children[i])
            }

            parentDom.appendChild(container)

            var curHeight = (window.getComputedStyle ? (window.getComputedStyle(parentDom).height).replace('px', '') : parentDom.offsetHeight) >> 0
            var curWidth = (window.getComputedStyle ? (window.getComputedStyle(parentDom).width).replace('px', '') : parentDom.offsetWidth) >> 0

            var halfh = curHeight / 2
            var halfw = curWidth / 2

            var moveh = opt.angle / curHeight
            var movew = opt.angle / curWidth
            var movex = 0
            var movey = 0

            common.listenEvent(container, 'mousemove', function(ev){

                movey = ev.offsetX
                if(movey < halfw){
                    movey = -(halfw - movey) / halfw * opt.angle
                }else if(movey > halfw){
                    movey = (movey - halfw) / halfw * opt.angle
                }

                movex = ev.offsetY
                if(movex < halfh){
                    movex = (halfh - movex) / halfh * opt.angle
                }else if(movex > halfh){
                    movex = -(movex - halfh) / halfh * opt.angle
                }

                container.style.transform = 'rotateX(' + movex + 'deg) rotateY(' + movey + 'deg)'

            })

            common.listenEvent(parentDom, 'mouseenter', function(){
                container.style['box-shadow'] = opt.shadow
            })

            common.listenEvent(parentDom, 'mouseleave', function(){
                container.style['box-shadow'] = ''
                container.style.transform = 'rotateX(' + 0 + 'deg) rotateY(' + 0 + 'deg)'
            })
        }
    }
}


var hoverSlider = new hover()

export {hoverSlider}