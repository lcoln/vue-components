# 幻灯片组件文档

## 配置说明

```json
    {
        minDate: Date.now() - 10 * 60 * 60 * 24 * 1000,         //最小日期
        maxDate: Date.now() + 15 * 60 * 60 * 24 * 1000,         //最大日期
        $onSuccess: function(vm){
            av.log(vm)
        }       //在组件初始化完成后的回调中返回组件对象
    }

```


## 用法

```html
<div ms-controller="date">
    <ui:datepicker identifier="indexDatepicker" config="datepickerOpts"></ui:datepicker>
</div>

<!--  
其中config属性是指定分页组件的配置，会自动从上一层controller里找;
identifier属性可以设定组件的$id值，方便各模块之间进行通讯
-->
<!--  引入分页组件  -->
<script type="text/javascript" src="avalon.min.js"></script>
<script type="text/javascript">
    require(['avalon', '../datepicker/datepicker'],function(av){

        var date = av.define({
            $id: 'date',
            datepickerOpts: {
                minDate: Date.now() - 10 * 60 * 60 * 24 * 1000,
                maxDate: Date.now() + 15 * 60 * 60 * 24 * 1000,
                $onSuccess: function(vm){
                    
                }
            }
        })

        av.scan()
    })


</script>
```
