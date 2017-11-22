/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";

class Pages{

    constructor(){
        this.id = Date.now() + '_pages'
        this.max = 0
        this.total = 0
        this.skin = ''
        this.callback = function(){}
    }

    checkFields(para, fields){
        for(let it of fields){
            if(!para[it] && para[it] != 0)
                return it
        }
        return true
    }

    init(parendId, config = {total: 0, }){
        let parentDom = document.getElementById(parendId)
        for(let it of Object.keys(config)){
            if(this[it])
                this[it] = config[it]
        }


    }

    jump(){}

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
                pages[i] = s
        }
        return pages
    }

}

export default Pages
