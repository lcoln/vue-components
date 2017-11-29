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
    switch(format) {
        case 'Y':
            return new Date(date).getFullYear()
            break;
        case 'm':
            return new Date(date).getMonth() + 1
            break;
        case 'd':
            return new Date(date).getDate()
            break;
    }
}

window.UiDatePicker = function (){

    var _this = this
    this.init = function(parendId, config, callback){

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
        container.innerHTML = '<input type="text" class="date-input" /><dl class="date-dl" style="display: none;"><dt>请选择日期</dt><dd><nav class="ui-fn-cl date-nav" class="ui-fn-cl"><a href="javascript:;"><<</a><a href="javascript:;"><</a><span class="date-val">' + this.curYear + ' - ' + this.curMonth + '</span><a href="javascript:;">></a><a href="javascript:;">>></a></nav><ul><li class="ui-fn-cl"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>七</span></li><li class="msg" style="display: none;">' + this.msg + '</li><li class="ui-fn-cl date-list"></li></ul></dd></dl>'

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
                container.querySelector('.date-input').value = _this.curYear + '-' + _this.curMonth + '-' + target.innerHTML
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

        listen(document, 'click', function(){
            _this.isShow = !1
        })


        this.opts = {
            maxy: this.maxDate && filterDate(this.maxDate, 'Y'),
            miny: this.minDate && filterDate(this.minDate, 'Y'),
            maxm: this.maxDate && fullNum(filterDate(this.maxDate, 'm')),
            minm: this.minDate && fullNum(filterDate(this.minDate, 'm')),
            maxd: this.maxDate && fullNum(filterDate(this.maxDate, 'd')),
            mind: this.minDate && fullNum(filterDate(this.minDate, 'd'))
        }

        calculate(this, this.curYear, this.curMonth)

        this.render(container.querySelector('.date-list'))

        parentDom.appendChild(container)

        observable(_this, 'curYear',function(v){
            if(monthChange)
                return
            calculate(_this, v, _this.curMonth)
            container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
        })

        observable(_this, 'curMonth',function(v){
            monthChange = true
            setTimeout(function(){
                calculate(_this, _this.curYear, v)
                container.querySelector('.date-val').innerHTML = _this.curYear + '-' + _this.curMonth
                monthChange = false
            }, 0)
        })

        observable(_this, 'dateList',function(v){
            setTimeout(function(){
                _this.render(container.querySelector('.date-list'))
            }, 0)
        })

        observable(_this, 'msg',function(v){
            if(!v)
                return
            container.querySelector('.msg').innerHTML = v
            container.querySelector('.msg').style.display = 'block'
            setTimeout(function(){
                container.querySelector('.msg').style.display = 'none'
                _this.msg = ''
            },1000)
        })

        /*observable(this, 'dateVal', function(v){
            container.querySelector('.date-input').value = v
        })*/

        observable(this, 'isShow', function(v){
            container.querySelector('.date-dl').style.display = v ? 'block' : 'none'
        })

    }
}

UiDatePicker.prototype = {
    curYear: curYear,
    curMonth: curMonth < 10 ? '0' + curMonth : curMonth,
    currDay: curDay,
    dateList: [],
    isShow: false,
    dateVal: '',
    minDate: minDate,
    maxDate: maxDate,
    msg: '',
    opts: {},
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

        if((time < this.minDate || time > this.maxDate) || (year + '' + month < this.opts.miny + '' + this.opts.minm) || (year + '' + month > this.opts.maxy + '' + this.opts.maxm))
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
        if(dates.length > 0 && container){
            var dom = ''
            var className = ''
            for(var i = 0, len = dates.length;i < len;i++){
                className = dates[i].disabled ? 'disabled' : 'act'
                className += this.curYear + '-' + this.curMonth + '-' + dates[i].day == this.dateVal ? ' select' : ''
                dom += '<span class="' + className + '">' + dates[i].day + '</span>'
            }
            container.innerHTML = dom
            // console.log(container);
        }

    }
}

UiDatePicker.prototype.hasCss = false

function fullNum(num){
    if(num < 10)
        return '0' + parseInt(num)

    return num
}

//获取当月天数
function getMonth(y, m){
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
    firstDay = firstDay == 0 ? 7 : firstDay
    for(var i = 1 - firstDay;i < getMonth(y, m);i++){
        var time = new Date(y, m - 1, i + 1).getTime()
        var disabled = false

        if(vm.curYear + '' + vm.curMonth + fullNum(i) < vm.opts.miny + '' + vm.opts.minm + vm.opts.mind){
            disabled = true
        }
        else if(vm.curYear + '' + vm.curMonth + fullNum(i) > vm.opts.maxy + '' + vm.opts.maxm + vm.opts.maxd){
            disabled = true
        }

        vm.dateList.push({
            day: i >= 0 ? i + 1 : '',
            disabled: disabled
        })
    }
}

function escape2Html(str) {
   var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
