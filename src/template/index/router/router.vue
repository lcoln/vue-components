<template>
    <div id="router">
        <div class="exam" v-show="showType == 1">
            <nav>
                <router-link to="/page1">/page1</router-link>
                <router-link to="/page2">/page2</router-link>
                <router-link to="/page3">/page3</router-link>
                <router-link to="/page3/1">/page3/1</router-link>
            </nav>
            <router-view></router-view>
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

    export default {
        name: 'router',
        data () {
            return {

            }
        },
        methods: {

        },
        mounted: async function(){
            require('./main')
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