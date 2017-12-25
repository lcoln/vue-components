<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">

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
    // import UiLazyLoading from '@/components/lazy_loading/main-es6.js'

    export default {
        name: 'app',
        data () {
            return {
                code: ``
            }
        },
        methods: {

        },
        mounted: async function(){
            require('@/components/lazy_loading/main-es5.js')
            var dom = document.querySelector('.exam')

            UiLazyLoading(dom, function(){
                createDiv()
            })

            function createDiv(){
                var arr = new Array(60).fill(0)
                var html = []
                for(var i = 0;i < arr.length;i++){
                    html.push('<p>' + i + '</p>')
                }
                dom.innerHTML += html.join('')
            }
            createDiv()

        },
        components: {

        },
        computed: {
            showType () {
                return store.state.showType
            }
        }
    }
</script>

<style rel="stylesheet" lang="scss" type="text/css" scoped>

</style>