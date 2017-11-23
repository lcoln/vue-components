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
            </div>
            <div id="pages"></div>
        </div>
        <pre class="code" v-if="showType == 2" v-text="code">
            <code class="html">

            </code>
        </pre>
    </div>
</template>

<script>
    import store from 'store'
    import vue from 'vue'
    import Pages from '@/components/pages/main-es6.js'

    function showData(list, curr){
        var start = (curr - 1) * 10
        var end = start + 10
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
                code: ``,
                list: []
            }
        },
        methods: {

        },
        mounted: async function(){
            let arr = []
            for(var i = 0;i<88;i++){
                arr[i] = {name: 'lili', sex: 'man', age: 19 + i, skill: 'html5'}
            }
            this.list = showData(arr, 1)
            let _this = this
            // require('@/components/pointer-hover-slider/main-es5.js')
            var pages = new Pages()
            pages.init('pages', {total: Math.ceil(arr.length / 10), max: 5}, function(curr){_this.list = showData(arr, curr)})
            // console.log(pages);
            /*var pointer2 = new Pages()
            pointer2.init('pointer2')*/
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