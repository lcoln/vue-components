/**
 * [日历组件]
 * @authors Lincoln (875482941@qq.com)
 * @date    2017-03-14 15:53:39
 *
 */

"use strict"

define(['avalon', 'text!./datepicker.htm', 'css!./datepicker'],function(av, tpl){

    var now = new Date()
    var curMonth = now.getMonth() + 1
    var curYear = now.getFullYear()
    var curDay = now.getDate()
    var minDate = Date.now() - 40 * 60 * 60 * 24 * 1000,
        maxDate = Date.now() + 10 * 60 * 60 * 24 * 1000

    av.component('ui:datepicker', {
        $replace: true,
        $template: tpl,
        $init: function(vm){

            vm.$show = function(ev){
                vm.isShow = !0
            }

            vm.$keepShow = function(ev){
                ev.stopPropagation && ev.stopPropagation() || (ev.cancelBubble = true)
            }

            vm.$caculateDate = function(ev){
                ev.stopPropagation()
            }

            vm.$jump = function(type, step){
                var year = vm.curYear >> 0,
                    month = vm.curMonth >> 0

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

                if((time < vm.minDate || time > vm.maxDate) || (year < vm.opts.miny || month < vm.opts.minm || year > vm.opts.maxy || month > vm.opts.maxm))
                    return vm.msg = '超过日期限制'
                month = fullNum(month)
                vm.curYear = year
                vm.curMonth = month
            }

            vm.$getDate = function(v){
                if(v && !v.disabled){
                    v = fullNum(v)
                    vm.dateVal = vm.curYear + '-' + vm.curMonth + '-' + v.day
                }
                // vm.isShow = !1
            }

            document.addEventListener('click', function(){
                vm.isShow = !1
            })

            vm.$watch('curYear',function(v){
                calculate(vm, v, vm.curMonth)
            })

            vm.$watch('curMonth',function(v){
                calculate(vm, vm.curYear, v)
            })

            vm.$watch('msg',function(v){
                setTimeout(function(){
                    vm.msg = ''
                },1000)
            })
        },
        $ready: function(vm){
            vm.opts = {
                maxy: vm.maxDate && av.filters.date(vm.maxDate, 'Y'),
                miny: vm.minDate && av.filters.date(vm.minDate, 'Y'),
                maxm: vm.maxDate && av.filters.date(vm.maxDate, 'm'),
                minm: vm.minDate && av.filters.date(vm.minDate, 'm'),
                maxd: vm.maxDate && av.filters.date(vm.maxDate, 'd'),
                mind: vm.minDate && av.filters.date(vm.minDate, 'd')
            }

            calculate(vm, vm.curYear, vm.curMonth)

            vm.$onSuccess(vm)
        },
        curYear: curYear,
        curMonth: curMonth < 10 ? '0' + curMonth : curMonth,
        dateList: [],
        isShow: false,
        dateVal: '',
        minDate: 0,
        maxDate: 0,
        msg: '',
        opts: {},
        $show: av.noop,
        $keepShow: av.noop,
        $caculateDate: av.noop,
        $jump: av.noop,
        $getDate: av.noop,
        $onSuccess: function(vm){}
    })

    function fullNum(num){
        if(num < 10)
            return '0' + num

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
            vm.dateList.push({
                day: i >= 0 ? i + 1 : '',
                disabled: vm.curYear < vm.opts.miny || i < 0 ? true : (vm.curMonth >= vm.opts.minm ? (time <= vm.minDate || time >= vm.maxDate ? true : false) : true)
            })
        }
    }

    av.scan()
    return av
})
