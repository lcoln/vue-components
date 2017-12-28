<template>
    <div>
        <div class="exam" v-show="showType == 1">
            <div id="slider">
                <div class="slider-item">
                    <img src="/static/images/http2.png"/>
                </div>
                <div class="slider-item">
                    <img src="/static/images/js.jpg"/>
                </div>
                <div class="slider-item">
                    <img src="/static/images/mysql.png"/>
                </div>
                <div class="slider-item">
                    <img src="/static/images/nodejs.jpg"/>
                </div>
                <div class="slider-item">
                    <img src="/static/images/ps.png"/>
                </div>
            </div>
            <div id="slider2">
                <div class="slider-item"></div>
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
    import UiSliders from '@/components/sliders/main-es6.js'

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
            // require('@/components/sliders/main-es5.js')
            var slider = new UiSliders()
            slider.init('slider', 'slider-item', {preview: true, source: ['/static/images/http2.png', '/static/images/js.jpg', '/static/images/mysql.png', '/static/images/nodejs.jpg', '/static/images/ps.png']})
            var slider2 = new UiSliders()
            slider2.init('slider2', 'slider-item', {})
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    #slider{width: 800px;height: 400px;margin: 0 auto;}
    #slider .slider-item{width: 100%;height: 100%;}
    #slider .slider-item:nth-of-type(1){background: #A7C5BD}
    #slider .slider-item:nth-of-type(2){background: #E5DDCB}
    #slider .slider-item:nth-of-type(3){background: #EB7B59}
    #slider .slider-item:nth-of-type(4){background: #CF4647}
    #slider .slider-item:nth-of-type(5){background: #524656}
    #slider .slider-item img{width: 100%;height: 100%;object-fit:cover;}

    #slider2{width: 600px;height: 400px;margin: 20px auto;}
    #slider2 .slider-item{width: 100%;height: 100%;}
    #slider2 .slider-item:nth-of-type(1){background: #A7C5BD}
    #slider2 .slider-item:nth-of-type(2){background: #E5DDCB}
    #slider2 .slider-item:nth-of-type(3){background: #EB7B59}
    #slider2 .slider-item:nth-of-type(4){background: #CF4647}
    #slider2 .slider-item:nth-of-type(5){background: #524656}
</style>