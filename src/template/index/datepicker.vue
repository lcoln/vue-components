<template>
    <div style="height: 100%;">
        <div class="exam" v-show="showType == 1">
            <div id="datePicker" style="display: inline-block;"></div>
            <div id="datePicker2" style="display: inline-block;vertical-align: top;"></div>
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
    // import UiDatePicker from '@/components/datepicker/main-es6.js'

    export default {
        name: 'app',
        data () {
            return {
                code: `
<div id="datePicker" style="display: inline-block;"></div>
<div id="datePicker2" style="display: inline-block;vertical-align: top;"></div>

es5: <script src="https://components.cncoders.me/components/datepicker/main-es5.js"><\/script>
es6: https://components.cncoders.me/components/datepicker/main-es6.js // import UiDatePicker from 'path/to/datepicker/main-es6.js'

var datePicker = new UiDatePicker()
datePicker.init('datePicker', {
    maxDate: Date.now() + 240 * 60 * 60 * 24 * 1000,
    minDate: Date.now() - 240 * 60 * 60 * 24 * 1000
})

var datePicker2 = new UiDatePicker()
datePicker2.init('datePicker2', {
    maxDate: Date.now() + 240 * 60 * 60 * 24 * 1000,
    minDate: Date.now() - 240 * 60 * 60 * 24 * 1000
})
`
            }
        },
        methods: {

        },
        mounted: async function(){
            require('@/components/datepicker/main-es5.js')
            var datePicker = new UiDatePicker()
            // console.log(datePicker.init);
            datePicker.init('datePicker', {
                maxDate: Date.now() + 240 * 60 * 60 * 24 * 1000,
                minDate: Date.now() - 240 * 60 * 60 * 24 * 1000,
                dateVal: Date.now(),
                showTime: true
            })

            var datePicker2 = new UiDatePicker()
            datePicker2.init('datePicker2', {
                maxDate: Date.now() + 191 * 60 * 60 * 24 * 1000,
                minDate: Date.now() - 541 * 60 * 60 * 24 * 1000
            })

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