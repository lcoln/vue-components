<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div id="datePicker"></div>
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
    // import UiDatePicker from '@/components/pages/main-es6.js'

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
            require('@/components/datepicker/main-es5.js')
            var datePicker = new UiDatePicker()
            datePicker.init('datePicker')

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