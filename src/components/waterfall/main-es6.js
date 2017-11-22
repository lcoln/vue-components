/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";

class WaterFall{

    constructor(){
        this.id = Date.now() + '_waterfall'
    }

    init(parendId, childId, config){
        let parentDom = document.getElementById(parendId),
            childDom = parentDom.querySelectorAll('.' + childId)

        if(Object.prototype.toString.call(config) !== '[object Object]')
            console.error('第三个参数须为对象');

        let rangeh = config.range

        for(let it of childDom){
            it.style.width = config.width + 'px'
            it.style.height = Math.random() * (rangeh[1] - rangeh[0]) + rangeh[0] + 'px'
            it.style.position = 'absolute'
            it.style.margin = config.distance || '5px'
            it.style.transition = '.4s'
        }

        this.setPosition(parentDom, childDom)

        let _this = this
        common.listenEvent(window, 'resize', function(){
            let parentDom = document.getElementById(parendId),
                childDom = parentDom.querySelectorAll('.' + childId)

            _this.setPosition(parentDom, childDom)
        })
    }

    setPosition(container, box){

        let containerw = container.offsetWidth
        let boxMarginLeft = box[0].style.marginLeft.replace('px', '') >> 0
        let boxMarginRight = box[0].style.marginRight.replace('px', '') >> 0
        let boxMarginTop = box[0].style.marginTop.replace('px', '') >> 0
        let boxMarginBottom = box[0].style.marginBottom.replace('px', '') >> 0

        let boxw = box[0].offsetWidth + boxMarginLeft + boxMarginRight
        let maxColumLen = Math.floor(containerw / boxw)
        for(let i = 0;i < box.length;i++){
            let margin = boxMarginTop + boxMarginBottom

            let top = 0
            let left = boxw * (i % maxColumLen) + 'px'

            if(i + 1 > maxColumLen){
                if(i - maxColumLen < maxColumLen){
                    top = box[i - maxColumLen].offsetHeight + margin + 'px'
                }else{
                    let curBox = box[i - maxColumLen]
                    top = (curBox.style.transform.split(',')[1].replace('px)', '') >> 0) + curBox.offsetHeight + margin + 'px'
                }
            }

            box[i].style.cssText += `transform: translate(${left},${top})`
        }
    }


}

export default WaterFall
