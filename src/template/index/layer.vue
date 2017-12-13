<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div class="layer">
                <a href="javascript:;" @click="alert">alert</a>
                <a href="javascript:;" @click="confirm">confirm</a>
                <a href="javascript:;" @click="loading">loading</a>
                <a href="javascript:;" @click="prompt">prompt</a>
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
    import dialog from '@/components/layer/';
    vue.use(dialog)

    // var layer = null
    export default {
        name: 'app',
        data () {
            return {
                code: ``
            }
        },
        methods: {
            alert () {
                /*UiLayer.alert("<div>Internal Server Error</div>",{
                    title: 'alert',
                    icon: 2,
                    callback: function(){console.log('test');}
                })*/

                this.$layer.alert(111, {title: 'alert', no: function(){console.log('close');}})
            },
            confirm () {
                /*UiLayer.confirm('<div>是否确定进行该操作</div>',{
                    title: 'confirm',
                    icon: 3,
                    yes: function(){

                    },
                    no: function(){

                    }
                })*/

                let _this = this

                this.$layer.confirm(111, {
                    title: 'confirm',
                    icon: 3,
                    yes: function(){console.log('yes');_this.$layer.close()},
                    no: function(){console.log('no');}
                })

            },
            loading () {
                // UiLayer.loading({callback: function(){setTimeout(function(){UiLayer.close()}, 3000)}})
                let _this = this
                this.$layer.loading(function(){setTimeout(function(){_this.$layer.close()}, 3000)})
            },
            prompt () {
                /*UiLayer.prompt('<div>Are you a boy or a girl ?</div>',{
                    title: 'prompt',
                    icon: 4,
                    yes: function(res){
                        console.log(res);
                    },
                    no: function(){

                    }
                })*/

                this.$layer.prompt('Are you a boy or a girl', {
                    title: 'prompt',
                    icon: 4,
                    yes: function(v){console.log(v);},
                    no: function(v){console.log(v);}
                })
            },
        },
        mounted: function(){
            // require('@/components/layer/main-es5.js')
        },
        computed: {
            showType () {
                return store.state.showType
            }
        },
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>
    .layer{
        a{display: inline-block;width: 100px;height: 30px;line-height: 30px;background: #59B390;color: #fff;text-align: center;}
    }
</style>