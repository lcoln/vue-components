<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div class="table">
                <ul class="th ui-fn-cl">
                    <li>name</li>
                    <li>sex</li>
                    <li>age</li>
                    <li>skill</li>
                </ul>
                <ul class="tr ui-fn-cl">
                    <li class="td" v-for="el in list">
                        <span>{{el.name}}</span>
                        <span>{{el.sex}}</span>
                        <span>{{el.age}}</span>
                        <span>{{el.skill}}</span>
                    </li>
                </ul>
                <div id="pages"></div>
            </div>
            <div class="table">
                <ul class="th ui-fn-cl">
                    <li>name</li>
                    <li>sex</li>
                    <li>age</li>
                    <li>skill</li>
                </ul>
                <ul class="tr ui-fn-cl">
                    <li class="td" v-for="el in list2">
                        <span>{{el.name}}</span>
                        <span>{{el.sex}}</span>
                        <span>{{el.age}}</span>
                        <span>{{el.skill}}</span>
                    </li>
                </ul>
                <div id="pages2"></div>
            </div>
        </div>
        <pre class="code" v-if="showType == 2">
            <code class="html" v-text="code">

            </code>
        </pre>
    </div>
</template>

<script>
    import store from 'store'
    import vue from 'vue'
    import UiPages from '@/components/pages/main-es6.js'

    function showData(list, curr, num = 10){
        var start = (curr - 1) * num
        var end = start + num
        var data = []
        for(var i in list){
            if(i < start)
                continue
            if(i < end)
                data.push(list[i])
            else
                break
        }
        return data
    }

    export default {
        data () {
            return {
                code: `
<div id="pages"></div>
<div id="pages2"></div>

es5: <script src="https://components.cncoders.me/components/pages/main-es5.js"><\/script>
es6: https://components.cncoders.me/components/pages/main-es6.js //import UiPages from 'path/to/pages/main-es6.js'

<script type="text/javascript">
    var pages = new UiPages()
    pages.init('pages', {
        total: Number,      //总页数
        max: Number,        //最大页数
        skin: String,       //组件皮肤['blue', 'green', 'pine', 'darkGreen', 'yellow'] dafault: blue
        showJumpBtn: true   //跳转按钮. true: 显示; false: 不显示
    }, function(curr){      //curr: 点击页码回调的页码
        //dosomething rander data
    })
    var pages2 = new UiPages()
    pages2.init('pages2', {
        total: Number,      //总页数
        max: Number,        //最大页数
    }, function(curr){
        //dosomething rander data
    })
<\/script>`,
                list: [],
                list2: [],
            }
        },
        methods: {

        },
        mounted: async function(){
            let arr = []
            for(let i = 0;i<88;i++){
                arr[i] = {name: 'lili', sex: 'man', age: i, skill: 'html5'}
            }

            let arr2 = []
            for(let i = 0;i<120;i++){
                arr2[i] = {name: 'lili', sex: 'women', age: 19, skill: `html${i}`}
            }


            this.list = showData(arr, 1)
            this.list2 = showData(arr2, 1, 15)
            let _this = this
            // require('@/components/pages/main-es5.js')
            var pages = new UiPages()
            pages.init('pages', {
                total: Math.ceil(arr.length / 10),
                max: 8, skin: 'green',
                showJumpBtn: true
            }, function(curr){
                _this.list = showData(arr, curr)
            })
            vue.log(pages)

            var pages2 = new UiPages()
            pages2.init('pages2', {
                total: Math.ceil(arr2.length / 15),
                max: 6,
                skin: 'blue',
                showJumpBtn: true
            }, function(curr){
                _this.list2 = showData(arr2, curr, 15)
            })
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
        components: {

        }
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    #pages, #pages2{margin: 20px 0;}
    .table{width: 100%;margin-bottom: 20px;color: #666;
        .th{width: 100%;height: 30px;border: 1px solid #999;border-right: none;line-height: 30px;
            li{float: left;height: 100%;width: 25%;border-right: 1px solid #999;line-height: 30px;text-align: center;}
        }
        .tr{border-left: 1px solid #999;
            .td{width: 100%;height: 30px;line-height: 30px;text-align: center;
                span{float: left;width: 25%;height: 100%;border-right: 1px solid #999;border-bottom: 1px solid #999;line-height: 30px;text-align: center;}
            }
        }

    }
</style>