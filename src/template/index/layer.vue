<template>
    <div>
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
                layer.alert('alert', {title: '提示'})
            },
            confirm () {
                layer.confirm('confirm', {yes: function(){console.log('yes');}, no: function(){console.log('no');}})
            },
            loading () {
                layer.loading({callback: function(){setTimeout(function(){layer.close()}, 3000)}})
            },
            prompt () {
                layer.prompt('<div>Are you a boy or a girl ?</div>',{
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
            layer = new UiLayer()
            console.log(layer);
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

</style>