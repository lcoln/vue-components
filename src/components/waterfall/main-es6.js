/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";

class UiWaterFall{

    constructor(){
        this.id = Date.now() + '_waterfall'
        this.config = {}
    }

    init(parendId, childId, config){
        var parentDom = document.getElementById(parendId),
            childDom = parentDom.querySelectorAll('.' + childId)

        require('./main.css')

        config = config || {}
        this.config = {
            margin: config.margin || 5,
            range: config.range && config.range.length ? config.range : [300, 400],
            width: config.width || 200
        }

        var rangeh = this.config.range
        var margin = this.config.margin
        var width = this.config.width

        var frag = document.createDocumentFragment(),
            i = 0,
            len = childDom.length
        for(;i < len;i++){
            childDom[i].style.cssText = 'position: absolute;width: ' + width + 'px;height: ' + (Math.random() * (rangeh[1] - rangeh[0]) + rangeh[0]) + 'px;margin: ' + margin + 'px;transition: .4s;'
            frag.appendChild(childDom[i])
        }

        var container = document.createElement('section')
        container.className = 'ui-waterfall'
        container.appendChild(frag)

        this.setContainerWidth(parentDom, childDom, container).setPosition(parentDom, childDom)

        parentDom.appendChild(container)

        var _this = this
        common.listenEvent(window, 'resize', function(){

            _this.setContainerWidth(parentDom, childDom, container).setPosition(parentDom, childDom)
        })
    }

    setPosition(container, box){
        if(!container || !box)
            return
        var margin = this.config.margin

        var column = [],
            i = 0,
            len = box.length
        for(;i < len;i++){

            var top = 0
            var left = this.boxw * (i % this.maxColumLen) + 'px'

            var boxh = parseFloat(box[i].style.height.slice(0, -2))

            if(column.length < this.maxColumLen){
                column.push(boxh)
            }else{
                var tmpColumn = JSON.parse(JSON.stringify(column))
                var index = tmpColumn.indexOf(column.sort(function(a, b){return a - b})[0])
                tmpColumn[index] += boxh + margin
                left = this.boxw * index + 'px'
                top = column[0] + margin + 'px'
                column = tmpColumn
            }

            box[i].style.cssText += `transform: translate(${left},${top});`
        }
    }

    setContainerWidth(parentDom, childDom, container){
        var containerw = parentDom.offsetWidth
        var boxMarginLeft = childDom[0].style.marginLeft.replace('px', '') >> 0
        var boxMarginRight = childDom[0].style.marginRight.replace('px', '') >> 0
        this.boxw = (childDom[0].style.width.slice(0, -2) >> 0) + boxMarginLeft + boxMarginRight
        this.maxColumLen = Math.floor(containerw / this.boxw)


        var w = this.maxColumLen * (this.config.width + this.config.margin * 2)
        container.style.cssText = 'width: ' + w + 'px;'
        return this

    }


}

export default UiWaterFall
