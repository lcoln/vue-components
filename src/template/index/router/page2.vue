<template>
    <div>
        <div class="exam" v-show="showType == 1">
            <div>

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
    import vueRouter from 'vue-router'

    export default {
        name: 'app',
        data () {
            return {

            }
        },
        methods: {

        },
        mounted: async function(){
            console.log(vueRouter);
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

</style>