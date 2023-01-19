<div align="center">
  <a href="https://github.com/LIjiAngChen8/datepicker-pro-vue" target="_blank">
    <img alt="DatepickerPpro Logo" width="200" src="https://imgur.com/ZEmf07N.png"/>
  </a>
</div>

<div align="center">
  <h1>DatePicker Pro</h1>
</div>

<div align="center">

![version](https://img.shields.io/npm/v/datepicker-pro-vue.svg?label=version&logo=npm)
![minizipped](https://img.shields.io/bundlephobia/minzip/datepicker-pro-vue.svg?color=165DFF)
![minified](https://img.shields.io/bundlephobia/min/datepicker-pro-vue.svg?color=165DFF)

[![Release](https://github.com/LIjiAngChen8/datepicker-pro-vue/actions/workflows/release.yml/badge.svg)](https://github.com/LIjiAngChen8/datepicker-pro-vue/actions/workflows/release.yml)
![last-commit](https://img.shields.io/github/last-commit/LIjiAngChen8/datepicker-pro-vue.svg)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?)](https://github.com/LIjiAngChen8/datepicker-pro-vue/blob/main/LICENSE)
[![](https://data.jsdelivr.com/v1/package/npm/datepicker-pro-vue/badge)](https://www.jsdelivr.com/package/npm/datepicker-pro-vue)

一个轻量、界面简洁、直观、功能齐全的日期选择器。支持多语言、农历展示和各种日期格式。

</div>

# 特性
- 遵循的是 ISO 8601 时间格式标准。
- 支持预设时间快捷选择。
- 提供农历/节假日的显示，可自定义假日信息。
- 组件提供了众多属性方便灵活配置，覆盖了绝大部份的时间业务场景。
- 界面简洁美观、交互流畅。

# 快速上手

#### 安装

npm
```bash
npm install datepicker-pro-vue
```

yarn
```bash
yarn add datepicker-pro-vue
```
CDN
```html
// jsdelivr
<script src="https://cdn.jsdelivr.net/npm/datepicker-pro-vue"></script>

// unpkg
<script src="https://unpkg.com/datepicker-pro-vue"></script>
```
*需要引入指定版本时只需在包名后面加入具体版本信息即可。*`datepicker-pro-vue@xxx`*，不加默认为最新版*。


#### 引入

全局注册

```js
import Vue from "vue";
import App from "./App.vue";
import DatePickerPro from 'datepicker-pro-vue'; // 引入组件

Vue.use(DatePickerPro)
// DatePickerPro.install(Vue);

new Vue({
  render: h => h(App),
}).$mount('#app')
```

#### 使用

``` html
<DatePickerPro v-model="value" showTime></DatePickerPro>
```
效果：
![image.png](https://imgur.com/aKPpqMM.png)

# 使用

# API
Props

|参数名         | 描述                                 | 类型                  | 默认值|
| ------------ | ----------------------------------- | --------------------- | -------| 
|**v-model**|面板显示的日期|`Date` `string` `number`|`-`|
| allow-clear | 是否允许清除 | `boolean` | `true`| 
| readonly | 是否为只读 | `boolean` | `false`| 
| disabled | 是否为禁用 | `boolean` | `false`| 
| disabled-date |不可选取的日期|`(current?: Date) => boolean`|`-`|
| disabled-time |不可选取的时间|`(current: Date) => DisabledTimeProps`|`-`|
| default-picker-value |面板默认显示的日期|`Date` `string` `number`|`-`|
| error | 是否为错误状态 | `boolean` | `false`| 
| shortcuts | 预设时间范围快捷选择 | `ShortcutType[]`| `[]`| 
| position | 弹出的框的位置 | `top` `bottom`<br>`left` `right`<br>`top-start`<br>`top-end`<br>`bottom-start`<br> `bottom-end`<br>`right-start`<br>`right-end`<br>`left-start`<br>`left-end`| `bottom`| 
| trigger  | 触发方式 | `toggle` `click` `hover` `focus` `click`| 
| popupTag  | 容器标签 | `String` | `div`| 
| showArrow  | 是否显示箭头 | `boolean` | `false`| 
| offset  | 偏移量 | `String` `number` | `4`| 
| mouseEnterDelay  | 移入事件延迟触发时间 | `number`| `100` | 
| mouseLeaveDelay  | 移出事件延迟触发时间 | `number`| `100`| 
| forceShow | 持续展示 | `boolean`| `false`| 
| renderToBody | 是否挂载在body下 | `boolean`| `false`| 
| unmountOnClose | 是否在隐藏的时候销毁DOM结构 | `boolean`             | `false`| 
| popupContainer | 弹出框的挂载容器 | `string` `HTMLElement` `null` `undefined`| - | 
| gpuAcceleration | 开启GPU加速渲染（低端机可能无法开启）| `boolean` | `true` | 
| stopPropagation | 阻止弹窗事件冒泡 | `boolean` | `false` | 
| preventDefault | 阻止弹窗默认行为 | `boolean` | `false` | 
|value-format|值的格式，对 `value` `defaultValue` `pickerValue` `defaultPickerValue` 以及事件中的返回值生效，支持设置为时间戳，Date 和字符串（参考[字符串解析格式](#字符串解析格式)）。如果没有指定，将格式化为字符串，格式同 `format`。|`timestamp` `Date` `string`|`-`|
|preview-shortcut|是否要预览快捷选择的结果|`boolean`|`true`|
|show-confirm-btn|是否显示确认按钮，`showTime = true` 的时候始终显示。|`boolean`|`false`|

### `Common` Events

|事件名|描述|参数|
|---|---|---|
|change|组件值发生改变|value: `Date \| string \| number \| undefined`<br>date: `Date \| undefined`<br>dateString: `string \| undefined`|
|select|选中日期发生改变但组件值未改变|value: `Date \| string \| number`<br>date: `Date`<br>dateString: `string`|
|popup-visible-change|打开或关闭弹出框|visible: `boolean`|
|ok|点击确认按钮|value: `Date \| string \| number`<br>date: `Date`<br>dateString: `string`|
|clear|点击清除按钮|-|
|select-shortcut|点击快捷选项|shortcut: `ShortcutType`|
|picker-value-change|面板日期改变|value: `Date \| string \| number`<br>date: `Date`<br>dateString: `string`|



### 字符串解析格式

格式     | 输出               | 描述                |
| ------ | ---------------- | ----------------- |
| `YY`   | 21               | 两位数的年份            |
| `YYYY` | 2021             | 四位数年份             |
| `M`    | 1-12             | 月份，从 1 开始         |
| `MM`   | 01-12            | 月份，两位数            |
| `MMM`  | Jan-Dec          | 缩写的月份名称           |
| `MMMM` | January-December | 完整的月份名称           |
| `D`    | 1-31             | 月份里的一天            |
| `DD`   | 01-31            | 月份里的一天，两位数        |
| `d`    | 0-6              | 一周中的一天，星期天是 0     |
| `dd`   | Su-Sa            | 最简写的一周中一天的名称      |
| `ddd`  | Sun-Sat          | 简写的一周中一天的名称       |
| `dddd` | Sunday-Saturday  | 一周中一天的名称          |
| `H`    | 0-23             | 小时                |
| `HH`   | 00-23            | 小时，两位数            |
| `h`    | 1-12             | 小时, 12 小时制        |
| `hh`   | 01-12            | 小时, 12 小时制, 两位数   |
| `m`    | 0-59             | 分钟                |
| `mm`   | 00-59            | 分钟，两位数            |
| `s`    | 0-59             | 秒                 |
| `ss`   | 00-59            | 秒，两位数             |
| `S`    | 0-9              | 数百毫秒，一位数          |
| `SS`   | 00-99            | 几十毫秒，两位数          |
| `SSS`  | 000-999          | 毫秒，三位数字           |
| `Z`    | -5:00            | UTC 的偏移量          |
| `ZZ`   | -0500            | UTC 的偏移量，数字前面加上 0 |
| `A`    | AM PM            | -                 |
| `a`    | am pm            | -                 |
| `Do`   | 1st... 3st       | 带序号的月份中的某天        |
| `X`    | 1410715640.579   | Unix 时间戳          |
| `x`    | 1410715640579    | Unix 毫秒时间戳
# 相关依赖

| 名称         | 版本     | 作者        |
| ----------- | ------- |------------ |
| [dayjs]     | ^1.11.7 | iamkun      |
| [@popperjs/core] | ^2.11.6 | floating-ui |
| [b-tween]   | ^0.3.3  | PengJiyuan  |

[dayjs]: https://day.js.org/
[@popperjs/core]: https://popper.js.org/
[b-tween]: https://github.com/PengJiyuan/b-tween

# 参与贡献

贡献之前请先阅读 [行为准则](./CODE_OF_CONDUCT.md)。

感谢本项目中所有用到的资源、工具的开发们，以及参与贡献的人！

<a href="https://github.com/LIjiAngChen8/datepicker-pro-vue/graphs/contributors"><img src="https://contrib.rocks/image?repo=LIjiAngChen8/datepicker-pro-vue" />
</a>

# License

本项目使用 [MIT 协议](./LICENSE)许可证。