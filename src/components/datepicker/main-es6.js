/**
 *
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-09-07 19:53:18
 */

'use strict'

import * as common from "common";


let now = new Date()
let curMonth = now.getMonth() + 1
let curYear = now.getFullYear()
let curDay = now.getDate()
let minDate = Date.now() - 40 * 60 * 60 * 24 * 1000,
    maxDate = Date.now() + 10 * 60 * 60 * 24 * 1000
let monthChange = false
let curTime = []

function fullNum(num){
    if(num < 10)
        return '0' + parseInt(num)

    return num
}

//获取当月天数
function getMonthLen(y, m){
    return new Date(y, m, 0).getDate()
}

//获取当月第一天是星期几
function getDay(y, m){
    return new Date(y, m - 1, 1).getDay()
}

//计算当月日历
function calculate(vm, y, m){
    vm.dateList = []
    let firstDay = getDay(y, m)
    let monthLen = getMonthLen(y, m)
    firstDay = firstDay == 0 ? 7 : firstDay
    for(let i = 1 - firstDay;i < monthLen;i++){

        let disabled = false

        if(vm.curYear + '' + fullNum(vm.curMonth) + fullNum(i) < vm.opts.miny + '' + vm.opts.minm + vm.opts.mind){
            disabled = true
        }
        else if(vm.curYear + '' + fullNum(vm.curMonth) + fullNum(i) >= vm.opts.maxy + '' + vm.opts.maxm + vm.opts.maxd){
            disabled = true
        }

        vm.dateList.push({
            day: i >= 0 ? i + 1 : '',
            disabled: disabled
        })
    }
}

function escape2Html(str) {
   let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

function setDateVal(container){

    if(this.showTime){
        curTime = [filterDate(this.dateVal, 'h'), filterDate(this.dateVal, 'm'), filterDate(this.dateVal, 's')]
        container.querySelector('.date-time').style.display = 'block'
        container.querySelector('.date-time-h').value = curTime[0]
        container.querySelector('.date-time-m').value = curTime[1]
        container.querySelector('.date-time-s').value = curTime[2]
        container.querySelector('.date-input').value = filterDate(this.dateVal, 'Y-M-D h:m:s')
    }else{
        container.querySelector('.date-input').value = filterDate(this.dateVal, 'Y-M-D')
    }

}

function filterDate(date, format){
    let now = new Date(date),
        Y = now.getFullYear(),
        M = fullNum(now.getMonth() + 1),
        D = fullNum(now.getDate()),
        h = fullNum(now.getHours()),
        m = fullNum(now.getMinutes()),
        s = fullNum(now.getSeconds())

    switch(format) {
        case 'Y':
            return Y
            break;
        case 'M':
            return M
            break;
        case 'D':
            return D
            break;
        case 'h':
            return h
            break;
        case 'm':
            return m
            break;
        case 's':
            return s
            break;
        case 'Y-M-D h:m:s':
            return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
            break;
        case 'Y-M-D':
            return Y + '-' + M + '-' + D
            break;
    }
}

class UiDatePicker{

    constructor(){
        this.curYear = curYear
        this.curMonth = fullNum(curMonth)
        this.currDay = curDay
        this.dateList = []
        this.isShow = false
        this.dateVal = now
        this.minDate = minDate
        this.maxDate = maxDate
        this.msg = ''
        this.opts = {}
        this.showTime = false
    }

    init(parendId, config, callback){

        let _this = this
        let parentDom = document.getElementById(parendId)
        if(!parentDom)
            return

        if(config){
            for(let it of Object.keys(config)){
                if(this[it] || this[it] == 0){
                    this[it] = config[it]
                }
            }
        }

        require('./datepicker.css')

        let container = document.createElement('div')
        container.className = ` ui-datepicker`
        container.innerHTML = `<input type="text" class="date-input" /><dl class="date-dl" style="display: none;"><dt>请选择日期</dt><dd><nav class="ui-fn-cl date-nav" class="ui-fn-cl"><a href="javascript:;"><<</a><a href="javascript:;"><</a><span class="date-val">${this.curYear} - ${this.curMonth}</span><a href="javascript:;">></a><a href="javascript:;">>></a></nav><ul><li class="ui-fn-cl"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>七</span></li><li class="msg" style="display: none;">${this.msg}</li><li class="ui-fn-cl date-list"></li></ul></dd><dd class="date-time"><label><input class="date-time-h" type="text" />时</label><label><input class="date-time-m" type="text" />分</label><label><input class="date-time-s" type="text" />秒</label><a class="date-time-now" href="javascript:;">现在</a></dd></dl>`


        setDateVal.call(this, container)



        common.listenEvent(container.querySelector('.date-input'), 'click', function(ev){
            _this.caculateDate(ev)
        })

        common.listenEvent(container.querySelector('.date-input'), 'focus', function(ev){
            _this.show()
        })

        common.listenEvent(container.querySelector('.date-dl'), 'click', function(ev){
            _this.keepShow(ev)
        })

        common.listenEvent(container.querySelector('.date-list'), 'click', function(ev){
            let target = ev.target
            if(target.nodeName === 'SPAN'){
                if(!target.className || target.className === 'disabled')
                    return
                if(_this.showTime){
                    container.querySelector('.date-input').value = _this.curYear + '-' + _this.curMonth + '-' + target.innerHTML + ' ' + curTime[0] + ':' + curTime[1] + ':' + curTime[2]
                    setTimeout(function(){
                        setDateVal.call(_this, container)
                    }, 0)
                }else{
                    container.querySelector('.date-input').value = _this.curYear + '-' + _this.curMonth + '-' + target.innerHTML
                }
                _this.dateVal = container.querySelector('.date-input').value
                _this.render(container.querySelector('.date-list'))
                callback && callback()
            }
        })

        common.listenEvent(container.querySelector('.date-nav'), 'click', function(ev){
            let target = ev.target
            if(target.nodeName === 'A'){
                let text = escape2Html(target.innerHTML)
                switch(text) {
                    case '<<':
                        _this.jump(1, -1)
                        break;
                    case '<':
                        _this.jump(2, -1)
                        break;
                    case '>':
                        _this.jump(2, 1)
                        break;
                    case '>>':
                        _this.jump(1, 1)
                        break;
                }
            }
        })

        common.listenEvent(container.querySelector('.date-time-now'), 'click', function(ev){
            _this.dateVal = Date.now()
            setDateVal.call(_this, container)
            _this.curYear = filterDate(_this.dateVal, 'Y')
            _this.curMonth = filterDate(_this.dateVal, 'M')
            _this.render(container.querySelector('.date-list'))

        })

        let timeList = ['.date-time-h', '.date-time-m', '.date-time-s']
        let maxTime = [23, 59, 59]
        let oldTime = []
        for(let i = 0;i < timeList.length;i++){
            oldTime.push(container.querySelector(timeList[i]).value)
            setTimeout((function(index){common.listenEvent(container.querySelector(timeList[i]), 'input', function(ev){
                let target = ev.target
                let curVal = target.value
                if(curVal > maxTime[index] || curVal < 0 || (curVal + '').indexOf('.') > -1 || !/^\d+$/.test(curVal)){
                    _this.msg = '时间不符合格式'
                    curVal = oldTime[index]
                    ev.target.value = curVal
                }
                let tmp = container.querySelector('.date-input').value.split(' ')
                let time = tmp[1].split(':')
                time[index] = curVal
                curTime[index] = curVal
                _this.dateVal = tmp[0] + ' ' + time.join(':')
                setDateVal.call(_this, container)

            })})(i), 0)
        }

        common.listenEvent(document, 'click', function(){
            _this.isShow = !1
        })


        this.opts = {
            maxy: this.maxDate && filterDate(this.maxDate, 'Y'),
            miny: this.minDate && filterDate(this.minDate, 'Y'),
            maxm: this.maxDate && filterDate(this.maxDate, 'M'),
            minm: this.minDate && filterDate(this.minDate, 'M'),
            maxd: this.maxDate && filterDate(this.maxDate, 'D'),
            mind: this.minDate && filterDate(this.minDate, 'D')
        }

        calculate(this, this.curYear, this.curMonth)

        this.render(container.querySelector('.date-list'))

        parentDom.appendChild(container)

        common.observable(this, 'curYear',function(v){
            if(monthChange)
                return
            calculate(_this, v, _this.curMonth)
            container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
        })

        /*common.observable(this, 'dateVal',function(v){

        })*/
        common.observable(this, 'curMonth',function(v){
            monthChange = true
            setTimeout(function(){
                calculate(_this, _this.curYear, v)
                container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
                monthChange = false
            }, 0)
        })

        common.observable(this, 'dateList',function(v){
            setTimeout(function(){
                _this.render(container.querySelector('.date-list'))
            }, 0)
        })

        common.observable(this, 'msg',function(v){
            if(!v)
                return
            container.querySelector('.msg').innerHTML = v
            container.querySelector('.msg').style.display = 'block'
            setTimeout(function(){
                container.querySelector('.msg').style.display = 'none'
                _this.msg = ''
            },1000)
        })

        common.observable(this, 'isShow', function(v){
            container.querySelector('.date-dl').style.display = v ? 'block' : 'none'
        })

    }

    show(){
        this.isShow = !0
    }

    keepShow(ev){
        ev.stopPropagation && ev.stopPropagation() || (ev.cancelBubble = true)
    }

    caculateDate(ev){
        ev.stopPropagation()
    }

    jump(type, step){
        let year = this.curYear >> 0,
            month = this.curMonth >> 0

        if(type == 1){
            year += step
        }else if(type == 2){
            month += step
            if(month < 1){
                year -= 1
                month = 12
            }else if(month > 12){
                year += 1
                month = 1
            }
        }

        let time = new Date(year + '-' + month, curDay).getTime()
        month = fullNum(month)

        if((time < this.minDate || time > this.maxDate) || (year + '' + month < this.opts.miny + '' + this.opts.minm) || (year + '' + month > this.opts.maxy + '' + this.opts.maxm) || (month == this.opts.minm && year == this.opts.miny && this.opts.mind == getMonthLen(year, month)))
            return this.msg = '超过日期限制'
        if(month !== this.curMonth)
            this.curMonth = month
        if(year !== this.curYear)
            this.curYear = year
    }

    getDate(v){
        if(v && !v.disabled){
            v = fullNum(v)
            this.dateVal = this.curYear + '-' + this.curMonth + '-' + v.day
        }
    }


    /**
     * [渲染dom结构]
     * @param  {Dom} container [页码容器]
     * @param  {Array} dates      [返回dom字符串]
     * @return {Dom}           [重新渲染dom结构]
     */
    render(container){
        let dates = this.dateList
        let curDate = filterDate(this.dateVal, 'Y-M-D')
        if(dates.length > 0 && container){
            let dom = ''
            let className = ''
            for(let i = 0, len = dates.length;i < len;i++){
                className = dates[i].disabled || !dates[i].day ? 'disabled' : 'act'
                className += this.curYear + '-' + fullNum(this.curMonth) + '-' + fullNum(dates[i].day) == curDate ? ' select' : ''
                dom += '<span class="' + className + '">' + dates[i].day + '</span>'
            }
            container.innerHTML = dom
        }

    }




}

export default UiDatePicker
