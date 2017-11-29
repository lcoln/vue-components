<template>
    <div class="layer">
        <a href="javascript:;" @click="alert">alert</a>
        <a href="javascript:;" @click="confirm">confirm</a>
        <a href="javascript:;" @click="loading">loading</a>
        <a href="javascript:;" @click="prompt">prompt</a>
    </div>
</template>

<script>
    import vue from 'vue'
    var layer = null
    export default {
        name: 'app',
        data () {
            return {

            }
        },
        methods: {
            alert () {
                UiLayer.alert('alert', {title: '提示', callback: function(){console.log('test');}})
            },
            confirm () {
                UiLayer.confirm('confirm', {yes: function(){console.log('yes');}, no: function(){console.log('no');}})
            },
            loading () {
                UiLayer.loading({callback: function(){setTimeout(function(){UiLayer.close()}, 3000)}})
            },
            prompt () {
                UiLayer.prompt('<div>Are you a boy or a girl ?</div>',{
                    title: 'prompt',
                    icon: 4,
                    yes: function(res){
                        console.log(res);
                    },
                    no: function(){

                    }
                })
            },
        },
        mounted: function(){
            require('@/components/layer/main-es5.js')
            /*layer = UiLayer
            console.log(UiLayer);*/
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
    .layer a{display: inline-block;width: 100px;height: 30px;line-height: 30px;background: #f30;color: #fff;text-align: center;}
</style>