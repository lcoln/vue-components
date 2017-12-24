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

var now = new Date()
var curMonth = now.getMonth() + 1
var curYear = now.getFullYear()
var curDay = now.getDate()
var minDate = Date.now() - 40 * 60 * 60 * 24 * 1000,
    maxDate = Date.now() + 10 * 60 * 60 * 24 * 1000
var monthChange = false

function filterDate(date, format){
    var now = new Date(date),
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

function setDateVal(container){

    if(this.showTime){
        container.querySelector('.date-time').style.display = 'block'
        container.querySelector('.date-input').value = filterDate(this.dateVal, 'Y-M-D h:m:s')
    }else{
        container.querySelector('.date-input').value = filterDate(this.dateVal, 'Y-M-D')
    }

}

window.UiDatePicker = function (){

}

//
var curTime = []

UiDatePicker.prototype = {
    curYear: curYear,
    curMonth: curMonth < 10 ? '0' + curMonth : curMonth,
    currDay: curDay,
    dateList: [],
    isShow: false,
    dateVal: now,
    minDate: minDate,
    maxDate: maxDate,
    msg: '',
    opts: {},
    hasCss: false,
    showTime: false,
    init: function(parendId, config, callback){

        var _this = this
        var parentDom = document.getElementById(parendId)
        if(!parentDom)
            return

        if(config){
            for(var it of Object.keys(config)){
                if(this[it] || this[it] == 0){
                    this[it] = config[it]
                }
            }
        }

        if(!UiDatePicker.prototype.hasCss){
            document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/static/css/datepicker/datepicker.css">'
        }
        UiDatePicker.prototype.hasCss = true

        var container = document.createElement('div')
        container.className = ` ui-datepicker`
        container.innerHTML = '<input type="text" class="date-input" /><dl class="date-dl" style="display: none;"><dt>请选择日期</dt><dd><nav class="ui-fn-cl date-nav" class="ui-fn-cl"><a href="javascript:;"><<</a><a href="javascript:;"><</a><span class="date-val">' + this.curYear + ' - ' + this.curMonth + '</span><a href="javascript:;">></a><a href="javascript:;">>></a></nav><ul><li class="ui-fn-cl"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>七</span></li><li class="msg" style="display: none;">' + this.msg + '</li><li class="ui-fn-cl date-list"></li></ul></dd><dd class="date-time"><label><input class="date-time-h" type="text" />时</label><label><input class="date-time-m" type="text" />分</label><label><input class="date-time-s" type="text" />秒</label><a class="date-time-now" href="javascript:;">现在</a></dd></dl>'


        curTime = [filterDate(this.dateVal, 'h'), filterDate(this.dateVal, 'm'), filterDate(this.dateVal, 's')]
        container.querySelector('.date-time-h').value = curTime[0]
        container.querySelector('.date-time-m').value = curTime[1]
        container.querySelector('.date-time-s').value = curTime[2]
        setDateVal.call(this, container)



        listen(container.querySelector('.date-input'), 'click', function(ev){
            _this.caculateDate(ev)
        })

        listen(container.querySelector('.date-input'), 'focus', function(ev){
            _this.show()
        })

        listen(container.querySelector('.date-dl'), 'click', function(ev){
            _this.keepShow(ev)
        })

        listen(container.querySelector('.date-list'), 'click', function(ev){
            var target = ev.target
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

        listen(container.querySelector('.date-nav'), 'click', function(ev){
            var target = ev.target
            if(target.nodeName === 'A'){
                var text = escape2Html(target.innerHTML)
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

        listen(container.querySelector('.date-time-now'), 'click', function(ev){
            _this.dateVal = Date.now()
            setDateVal.call(_this, container)
            _this.curYear = filterDate(_this.dateVal, 'Y')
            _this.curMonth = filterDate(_this.dateVal, 'M')
            _this.render(container.querySelector('.date-list'))

        })

        var timeList = ['.date-time-h', '.date-time-m', '.date-time-s']
        var maxTime = [23, 59, 59]
        var oldTime = []
        for(var i = 0;i < timeList.length;i++){
            oldTime.push(container.querySelector(timeList[i]).value)
            setTimeout((function(index){listen(container.querySelector(timeList[i]), 'input', function(ev){
                var target = ev.target
                var curVal = target.value
                if(curVal > maxTime[index] || curVal < 0 || (curVal + '').indexOf('.') > -1 || !/^\d+$/.test(curVal)){
                    _this.msg = '时间不符合格式'
                    curVal = oldTime[index]
                    ev.target.value = curVal
                }
                var tmp = container.querySelector('.date-input').value.split(' ')
                var time = tmp[1].split(':')
                time[index] = curVal
                curTime[index] = curVal
                _this.dateVal = tmp[0] + ' ' + time.join(':')
                setDateVal.call(_this, container)

            })})(i), 0)
        }

        listen(document, 'click', function(){
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

        observable(this, 'curYear',function(v){
            if(monthChange)
                return
            calculate(_this, v, _this.curMonth)
            container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
        })

        /*observable(this, 'dateVal',function(v){

        })*/
        observable(this, 'curMonth',function(v){
            monthChange = true
            setTimeout(function(){
                calculate(_this, _this.curYear, v)
                container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
                monthChange = false
            }, 0)
        })

        observable(this, 'dateList',function(v){
            setTimeout(function(){
                _this.render(container.querySelector('.date-list'))
            }, 0)
        })

        observable(this, 'msg',function(v){
            if(!v)
                return
            container.querySelector('.msg').innerHTML = v
            container.querySelector('.msg').style.display = 'block'
            setTimeout(function(){
                container.querySelector('.msg').style.display = 'none'
                _this.msg = ''
            },1000)
        })

        observable(this, 'isShow', function(v){
            container.querySelector('.date-dl').style.display = v ? 'block' : 'none'
        })

    },
    show: function(){
        this.isShow = !0
    },
    keepShow: function(ev){
        ev.stopPropagation && ev.stopPropagation() || (ev.cancelBubble = true)
    },
    caculateDate: function(ev){
        ev.stopPropagation()
    },
    jump: function(type, step){
        var year = this.curYear >> 0,
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

        var time = new Date(year + '-' + month, curDay).getTime()
        month = fullNum(month)

        if((time < this.minDate || time > this.maxDate) || (year + '' + month < this.opts.miny + '' + this.opts.minm) || (year + '' + month > this.opts.maxy + '' + this.opts.maxm) || (month == this.opts.minm && year == this.opts.miny && this.opts.mind == getMonthLen(year, month)))
            return this.msg = '超过日期限制'
        if(month !== this.curMonth)
            this.curMonth = month
        if(year !== this.curYear)
            this.curYear = year
    },
    getDate: function(v){
        if(v && !v.disabled){
            v = fullNum(v)
            this.dateVal = this.curYear + '-' + this.curMonth + '-' + v.day
        }
    },
    /**
     * [渲染dom结构]
     * @param  {Dom} container [页码容器]
     * @param  {Array} dates      [返回dom字符串]
     * @return {Dom}           [重新渲染dom结构]
     */
    render: function(container){
        let dates = this.dateList
        var curDate = filterDate(this.dateVal, 'Y-M-D')
        if(dates.length > 0 && container){
            var dom = ''
            var className = ''
            for(var i = 0, len = dates.length;i < len;i++){
                className = dates[i].disabled || !dates[i].day ? 'disabled' : 'act'
                className += this.curYear + '-' + this.curMonth + '-' + dates[i].day == curDate ? ' select' : ''
                dom += '<span class="' + className + '">' + dates[i].day + '</span>'
            }
            container.innerHTML = dom
        }

    }
}


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
    var firstDay = getDay(y, m)
    var monthLen = getMonthLen(y, m)
    firstDay = firstDay == 0 ? 7 : firstDay
    for(var i = 1 - firstDay;i < monthLen;i++){

        var disabled = false

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
   var arrEntities = {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
