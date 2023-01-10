<div align="center">
  <a href="https://github.com/LIjiAngChen8/datepicker-pro-vue" target="_blank">
    <img alt="DatepickerPpro Logo" width="200" src="https://imgur.com/ZEmf07N.png"/>
  </a>
</div>

<div align="center">
  <h1>DatePicker Pro</h1>
</div>

<div align="center">

一个轻量、界面简洁、直观、功能齐全的日期选择器。支持多语言、农历展示和各种日期格式。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LIjiAngChen8/datepicker-pro-vue/blob/main/LICENSE)
[![](https://data.jsdelivr.com/v1/package/npm/datepicker-pro-vue/badge)](https://www.jsdelivr.com/package/npm/datepicker-pro-vue)


</div>

# 简介
组件提供了众多属性方便灵活配置，覆盖了绝大部份的时间业务场景。

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
<script src="https://cdn.jsdelivr.net/npm/datepicker-pro-vue@1"></script>
```

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
| xxxxxx | xxxxxxxxxxxxxxxxxxxxxxxxxx            | `boolean`             | `false`| 

字符串解析格式

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
# 依赖

| 名称         | 版本     | 作者        |
| ----------- | ------- |------------ |
| [dayjs]     | ^1.11.7 | iamkun      |
| [popper.js] | ^1.16.1 | floating-ui |
| [b-tween]   | ^0.3.3  | PengJiyuan  |

[dayjs]: https://day.js.org/
[popper.js]: https://popper.js.org/
[b-tween]: https://github.com/PengJiyuan/b-tween

# 致谢
感谢本项目中所有用到的资源、工具为本项目做出的贡献。

# License

本项目使用 [MIT 协议](./LICENSE)许可证。