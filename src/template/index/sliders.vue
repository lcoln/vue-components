<template>
    <div>
        <div class="exam" v-show="showType == 1">
            <div id="slider">
                <div class="slider-item"></div>
                <div class="slider-item"></div>
                <div class="slider-item"></div>
                <div class="slider-item"></div>
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
    // import UiSliders from '@/components/sliders/main-es6.js'

    export default {
        name: 'app',
        data () {
            return {
                code: ``
            }
        },
        methods: {

        },
        mounted: function(){
            require('@/components/sliders/main-es5.js')
            var slider = new UiSliders()
            slider.init('slider', 'slider-item', {})
            /*var slider2 = new UiSliders()
            slider2.init('slider2', 'page', '.4')*/
            // console.log(fullpage2);
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    #slider{width: 400px;height: 300px;margin: 0 auto;background: #bbb;}
    #slider .slider-item{width: 100%;height: 100%;}
    #slider .slider-item:nth-of-type(1){background: lightblue}
    #slider .slider-item:nth-of-type(2){background: lightgreen}
    #slider .slider-item:nth-of-type(3){background: #000}
    #slider .slider-item:nth-of-type(4){background: red}
</style>