<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div id="waterfall">
                <div v-for="it in box" class="waterfall-box"></div>
            </div>
            <div id="waterfall1">
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
                <div class="waterfall-box"></div>
            </div>
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
    import UiWaterFall from '@/components/waterfall/main-es6.js'

    export default {
        name: 'app',
        data () {
            return {
                box: new Array(15),
                code: `
<div id="waterfall">
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
</div>
<div id="waterfall1">
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
    <div class="waterfall-box"></div>
</div>

es5: <script src="https://components.cncoders.me/components/waterfall/main-es5.js"><\/script>
es6: https://components.cncoders.me/components/waterfall/main-es6.js //import UiWaterFall from 'path/to/waterfall/main-es6.js'

<script>
    window.onload = function(){
        var waterfall = new WaterFall()
        waterfall.init('waterfall', 'waterfall-box', {width: 200, range: [300, 400]})
        var waterfall1 = new WaterFall()
        waterfall1.init('waterfall1', 'waterfall-box', {width: 200, range: [300, 400]})
    }
<\/script>

<style>
    #waterfall{position: relative;height: 500px;overflow: auto;}
    #waterfall .waterfall-box{border: 1px solid #333;background: #1E6075;margin: 10px;}
    #waterfall1{position: relative;height: 500px;overflow: auto;margin: 30px 0;}
    #waterfall1 .waterfall-box{border: 1px solid #333;background: #2DA89C;margin: 10px;}
</style>
                `
            }
        },
        methods: {

        },
        mounted: async function(){
            var dom = document.getElementById('waterfall')
            function createDiv(){
                var arr = new Array(10).fill(0)
                var html = []
                for(var i = 0;i < arr.length;i++){
                    html.push('<div class="waterfall-box"></div>')
                }
                dom.innerHTML += html.join('')
                console.log(dom);
            }

            // require('@/components/waterfall/main-es5.js')
            require('@/components/lazy_loading/main-es5.js')
            var waterfall = new UiWaterFall()
            waterfall.init('waterfall', 'waterfall-box')

            var _that = this

            UiLazyLoading(dom, function(){
                waterfall.addBox('waterfall', 'waterfall-box')
            }, 500)
            var waterfall1 = new UiWaterFall()
            waterfall1.init('waterfall1', 'waterfall-box', {width: 200, range: [300, 400]})
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

<style rel="stylesheet" lang="scss" type="text/css">
    #waterfall{position: relative;height: 500px;overflow: auto;
        .waterfall-box{border: 1px solid #333;background: #1E6075;margin: 10px;}
    }
    #waterfall1{position: relative;height: 500px;overflow: auto;margin: 30px 0;
        .waterfall-box{border: 1px solid #333;background: #2DA89C;margin: 10px;}
    }
</style>