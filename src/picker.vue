<template>
  <Popper
    v-if="!hideTrigger"
    animation="slide-dynamic-origin"
    :offset="offset"
    :trigger="trigger"
    :position="position"
    :disabled="disabled || readonly"
    :popup-visible="panelVisible"
    :unmount-on-close="unmountOnClose"
    :popup-container="popupContainer"
    :renderToBody="renderToBody"
    @popupVisibleChange="onPanelVisibleChange"
  >
    <DateInput
      v-bind="$attrs"
      ref="refInput"
      :size="size"
      :focused="panelVisible"
      :visible="panelVisible"
      :error="error"
      :disabled="disabled"
      :readonly="!inputEditable"
      :allow-clear="allowClear && !readonly"
      :placeholder="computedPlaceholder"
      :input-value="inputValue"
      :value="needConfirm ? panelValue : selectedValue"
      :format="inputFormat"
      @clear="onInputClear"
      @change="onInputChange"
      @pressEnter="onInputPressEnter"
    >
      <template slot="suffix-icon">
        <slot name="suffix-icon">
          <IconCommon use="calendar" />
        </slot>
      </template>
    </DateInput>
    <template slot="content">
      <PickerPanel v-bind="panelProps" v-on="panelOn" @click="onPanelClick" />
    </template>
  </Popper>
</template>

<script>
import Popper from './popper/index.vue';
import DateInput from './common/input.vue';
import IconCommon from './icon/icon-common.vue';
import PickerPanel from './picker-panel.vue';

import { getPrefixCls } from './utils/config';
import placeholder from './utils/placeholder';
import { isFunction, isBoolean } from './utils/is';
import {
  omit,
  getColumnsFromFormat,
  mergeValueWithTime,
  pick,
} from './utils/index';
import {
  dayjs,
  methods,
  getNow,
  getDateValue,
  getDayjsValue,
  isValueChange,
  getFormattedValue,
  isValidInputValue,
  initializeDateLocale,
} from './utils/date';

export default {
  name: 'DatePickerPro',
  components: { Popper, DateInput, IconCommon, PickerPanel },
  data() {
    return {
      panelVisible: false,
      prefixCls: getPrefixCls('picker'),
      inputValue: undefined, // input 操作使用的值
      processValue: undefined, // 操作过程中的选中值
      previewValue: undefined, // 预览用的值：悬浮
      headerMode: undefined,
      localValue: this.computedDefaultPickerValue || getNow(),
      timePickerValue: this.getDefaultValue(),
      clearPreviewTimer: null,
    };
  },
  props: {
    offset: {
      type: Number,
      default: 4,
    },
    renderToBody: {
      type: Boolean,
      default: true,
    },
    popuperOptions: {
      type: Object,
      default: () => ({}),
    },
    trigger: {
      type: String,
      default: 'click',
    },
    // 没有触发元素，只显示选择面板
    hideTrigger: {
      type: Boolean,
    },
    // 是否允许清除
    allowClear: {
      type: Boolean,
      default: true,
    },
    // 是否为只读
    readonly: {
      type: Boolean,
    },
    // 是否为错误状态
    error: {
      type: Boolean,
    },
    // 日期选择器的尺寸
    size: {
      type: String,
      default: 'medium',
    },
    // 预设时间范围快捷选择
    shortcuts: {
      type: Array,
      default: () => [],
    },
    // 预设范围在面板上的位置，默认放在下方，侧边一般用于大量预设时间的场景
    shortcutsPosition: {
      type: String,
      default: 'bottom',
    },
    // 弹出的框的位置
    position: {
      type: String,
      default: 'bottom',
    },
    // 控制弹出框的打开或者关闭状态
    popupVisible: {
      type: Boolean,
      default: undefined,
    },
    // 默认弹出框是打开或者关闭
    defaultPopupVisible: {
      type: Boolean,
      default: false,
    },
    // 是否在隐藏的时候销毁DOM结构
    unmountOnClose: {
      type: Boolean,
    },
    // 提示文案
    placeholder: {
      type: String,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
    },
    // 不可选取的日期
    disabledDate: {
      type: Function,
    },
    // 不可选取的时间
    disabledTime: {
      type: Function,
    },
    // 面板显示的日期
    pickerValue: {
      type: [Object, String, Number],
    },
    // 面板默认显示的日期
    defaultPickerValue: {
      type: [Object, String, Number],
    },
    showLunar: {
      type: Boolean,
    },
    // 弹出框的挂载容器
    popupContainer: {
      type: [String, Object],
    },
    mode: {
      type: String,
      default: 'date',
      validator(value) {
        return ['date', 'year', 'quarter', 'month', 'week'].includes(value);
      },
    },
    format: {
      type: [String, Function],
    },
    // 值的格式，对 `value` `defaultValue` `pickerValue` `defaultPickerValue` 以及事件中的返回值生效，支持设置为时间戳，Date 和字符串（参考[字符串解析格式](#字符串解析格式)）。如果没有指定，将格式化为字符串，格式同 `format`。
    valueFormat: {
      type: String,
    },
    // 是否要预览快捷选择的结果
    previewShortcut: {
      type: Boolean,
      default: true,
    },
    // 是否显示确认按钮，`showTime = true` 的时候始终显示。
    showConfirmBtn: {
      type: Boolean,
    },
    showTime: {
      type: Boolean,
    },
    timePickerProps: {
      type: Object,
    },
    showNowBtn: {
      type: Boolean,
      default: true,
    },
    dayStartOfWeek: {
      type: Number,
      default: 0,
    },
    value: {
      type: [Object, String, Number],
    },
    defaultValue: {
      type: [Object, String, Number],
    },
  },
  created() {
    initializeDateLocale('zh-cn', this.dayStartOfWeek);
  },
  beforeDestroy() {
    clearTimeout(this.clearPreviewTimer);
  },
  watch: {
    panelValue(newVal) {
      if (newVal) {
        this.timePickerValue = newVal;
      }
      this.setHeaderValue(newVal);
    },
    panelVisible(newVisible) {
      this.processValue = undefined;
      this.previewValue = undefined;
      this.headerMode = undefined;
      // open
      if (newVisible) {
        this.resetHeaderValue();
        this.timePickerValue = this.getDefaultValue();
      }
      // close
      if (!newVisible) {
        this.inputValue = undefined;
      }
    },
  },
  computed: {
    computedPlaceholder() {
      return this.placeholder || placeholder[this.mode] || placeholder.date;
    },
    computedFormat() {
      const defaultFormat = this.getDefaultFormat(this.mode, this.showTime);
      return (!isFunction(this.format) && this.format) || defaultFormat;
    },
    returnValueFormat() {
      return (
        this.valueFormat ||
        (this.mode === 'week'
          ? 'YYYY-MM-DD'
          : this.mode === 'quarter'
          ? 'YYYY-MM'
          : this.computedFormat)
      );
    },
    parseValueFormat() {
      return ['timestamp', 'Date'].includes(this.returnValueFormat)
        ? this.computedFormat
        : this.returnValueFormat;
    },
    inputFormat() {
      const defaultFormat = this.computedFormat;
      return this.format && isFunction(this.format)
        ? (value) => this.format(getDateValue(value))
        : defaultFormat;
    },
    inputEditable() {
      return !this.readonly && !isFunction(this.inputFormat);
    },
    // 是否需要确认
    needConfirm() {
      return this.showTime || this.showConfirmBtn;
    },
    confirmBtnDisabled() {
      return (
        this.needConfirm &&
        (!this.forSelectedValue || this.isDisabledDate(this.forSelectedValue))
      );
    },
    // panel 展示用的值
    panelValue() {
      return this.previewValue || this.processValue || this.selectedValue;
    },
    // 待确认的值
    forSelectedValue() {
      return this.processValue || this.selectedValue;
    },
    computedModelValue() {
      return getDayjsValue(this.value, this.parseValueFormat);
    },
    computedTimePickerProps() {
      return {
        format: this.computedFormat,
        ...omit(this.timePickerProps || {}, ['defaultValue']),
        visible: this.panelVisible,
      };
    },
    computedMode() {
      return this.mode || 'date';
    },
    // 单个面板显示多少月份 | 单箭头跨越多少月份
    span() {
      return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
        this.computedMode
      ];
    },
    // 双箭头跨越多少个月份
    superSpan() {
      return ['year'].includes(this.computedMode) ? 10 * 12 : 12;
    },
    computedValue() {
      return getDayjsValue(this.pickerValue, this.parseValueFormat);
    },
    computedDefaultValue() {
      return getDayjsValue(this.defaultValue, this.parseValueFormat);
    },
    computedDefaultPickerValue() {
      return getDayjsValue(this.defaultPickerValue, this.parseValueFormat);
    },
    selectedValue() {
      return this.computedModelValue || this.computedDefaultValue || undefined;
    },
    headerValue() {
      return this.computedValue || this.localValue;
    },
    showSingleBtn() {
      return this.span !== this.superSpan;
    },
    headerOperations() {
      return {
        onSuperPrev: () => {
          this.setHeaderValue(
            methods.subtract(this.headerValue, this.superSpan, 'M')
          );
        },
        onPrev: this.showSingleBtn
          ? () => {
              this.setHeaderValue(
                methods.subtract(this.headerValue, this.span, 'M')
              );
            }
          : undefined,
        onNext: this.showSingleBtn
          ? () => {
              this.setHeaderValue(
                methods.add(this.headerValue, this.span, 'M')
              );
            }
          : undefined,
        onSuperNext: () => {
          this.setHeaderValue(
            methods.add(this.headerValue, this.superSpan, 'M')
          );
        },
      };
    },
    defaultTimePickerValue() {
      let format = this.timePickerProps?.format || undefined;
      if (!format || !getColumnsFromFormat(format).list.length) {
        format = this.timePickerProps?.use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
      }
      return getDayjsValue(this.timePickerProps?.defaultValue, format);
    },
    /**
     * 面板属性
     */
    panelProps() {
      return {
        ...pick(this.$props, [
          'mode',
          'shortcuts',
          'shortcutsPosition',
          'dayStartOfWeek',
          'disabledDate',
          'disabledTime',
          'showTime',
          'hideTrigger',
        ]),
        showNowBtn: this.showNowBtn && this.mode === 'date',
        prefixCls: this.prefixCls,
        format: this.parseValueFormat,
        value: this.panelValue,
        visible: this.panelVisible,
        showConfirmBtn: this.needConfirm,
        confirmBtnDisabled: this.confirmBtnDisabled,
        timePickerProps: this.computedTimePickerProps,
        extra: this.$slots?.extra?.[0],
        dateRender: this.$slots.cell,
        headerValue: this.headerValue,
        headerOperations: this.headerOperations,
        timePickerValue: this.timePickerValue,
        headerMode: this.headerMode,
        showLunar: this.showLunar,
      };
    },
    /**
     * 面板事件
     */
    panelOn() {
      return {
        onCellClick: this.onPanelCellClick,
        onTimePickerSelect: this.onTimePickerSelect,
        onConfirm: this.onPanelConfirm,
        onShortcutClick: this.onPanelShortcutClick,
        onShortcutMouseEnter: this.previewShortcut
          ? this.onPanelShortcutMouseEnter
          : undefined,
        onShortcutMouseLeave: this.previewShortcut
          ? this.onPanelShortcutMouseLeave
          : undefined,
        onTodayBtnClick: this.onPanelSelect,
        onHeaderLabelClick: this.onPanelHeaderLabelClick,
        onHeaderSelect: this.onPanelHeaderSelect,
        onMonthHeaderClick: this.onMonthHeaderClick,
        onYearHeaderClick: this.onYearHeaderClick,
      };
    },
  },
  methods: {
    getDefaultFormat(mode = 'date', showTime = false) {
      switch (mode) {
        case 'date':
          return showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        case 'month':
          return 'YYYY-MM';
        case 'year':
          return 'YYYY';
        case 'week':
          return 'gggg-wo';
        case 'quarter':
          return 'YYYY-[Q]Q';
        default:
          return 'YYYY-MM-DD';
      }
    },
    getReturnValue(date) {
      if (this.returnValueFormat === 'timestamp') {
        return date.toDate().getTime();
      }
      if (this.returnValueFormat === 'Date') {
        return date.toDate();
      }
      return date.format(this.returnValueFormat);
    },
    /**
     * 选择面板是否可见
     */
    setPanelVisible(newVisible) {
      if (this.panelVisible !== newVisible) {
        this.panelVisible = newVisible;
        this.$emit('popup-visible-change', newVisible);
        this.$emit('update:popupVisible', newVisible);
      }
    },
    /**
     * 输入框值发生改变
     */
    onInputChange(e) {
      this.setPanelVisible(true);
      const targetValue = e.target.value;
      this.inputValue = targetValue;
      if (!isValidInputValue(targetValue, this.computedFormat)) return;
      const newValue = dayjs(targetValue, this.computedFormat);
      if (this.isDisabledDate(newValue)) return;
      if (this.needConfirm) {
        this.select(newValue);
      } else {
        this.confirm(newValue, true);
      }
    },
    /**
     * 点击清除
     */
    onInputClear(e) {
      e.stopPropagation();
      this.confirm(undefined);
      this.$emit('clear');
    },
    /**
     * 按回车
     */
    onInputPressEnter() {
      this.confirm(this.panelValue, false);
    },
    onPanelClick() {
      this.$refs.refInput && this.$refs.refInput.focus();
    },
    isDisabledDate(value, type) {
      const needCheckTime = this.mode === 'date' && this.showTime;
      const isDDate = (current) => {
        if (!this.disabledDate) return false;
        const dateValue = getDateValue(current);
        return this.disabledDate(dateValue);
      };
      const isDisabledItem = (num, getDisabledList) => {
        const list = getDisabledList ? getDisabledList() : [];
        return list.includes(num);
      };
      const isDTime = (current) => {
        if (!needCheckTime) return false;
        if (!this.disabledTime) return false;
        const dateValue = getDateValue(current);
        const disabledTimeProps = this.disabledTime(dateValue);

        return (
          isDisabledItem(current.hour(), disabledTimeProps.disabledHours) ||
          isDisabledItem(current.minute(), disabledTimeProps.disabledMinutes) ||
          isDisabledItem(current.second(), disabledTimeProps.disabledSeconds)
        );
      };
      return (
        value &&
        (isDDate(value, type || 'start') || isDTime(value, type || 'start'))
      );
    },

    //------
    onPanelConfirm() {
      this.confirm(this.panelValue, false, true);
    },
    onPanelSelect(value) {
      if (this.needConfirm) {
        this.select(value, true);
      } else {
        this.confirm(value, false);
      }
    },
    onPanelShortcutClick(value, shortcut) {
      this.$emit('select-shortcut', shortcut);
      this.confirm(value, false);
    },
    onPanelShortcutMouseEnter(value) {
      clearTimeout(this.clearPreviewTimer);
      this.previewValue = value;
      this.inputValue = undefined;
    },
    onPanelShortcutMouseLeave() {
      clearTimeout(this.clearPreviewTimer);
      this.clearPreviewTimer = setTimeout(() => {
        this.previewValue = undefined;
      }, 100);
    },
    onPanelHeaderLabelClick(type) {
      this.headerMode = type;
    },
    onMonthHeaderClick() {
      this.headerMode = 'year';
    },
    onYearHeaderClick() {
      this.headerMode = 'date';
    },
    onPanelVisibleChange(visible) {
      if (this.disabled) return;
      this.setPanelVisible(visible);
    },
    onPanelHeaderSelect(date) {
      let newValue = this.headerValue;
      newValue = newValue.set('year', date.year());
      if (this.headerMode === 'month') {
        newValue = newValue.set('month', date.month());
      }
      this.setHeaderValue(newValue);
      if (this.mode === 'quarter' || this.mode === 'month') {
        // 季度选择器特殊处理，月份选完后关闭headerMode
        this.headerMode = undefined;
        return;
      }
      this.headerMode = this.headerMode === 'year' ? 'month' : undefined; // 年选择完后选择月
    },
    /**
     * 合并时间
     * @param {Date | string | number | undefined} date 日期
     * @param {Date | string | number | undefined} time 时间
     */
    getMergedOpValue(date, time) {
      if (
        !(this.mode === 'date' && this.showTime) &&
        !this.timePickerProps?.value
      )
        return date;
      return mergeValueWithTime(getNow(), date, time);
    },
    onPanelCellClick(value) {
      const newValue = this.getMergedOpValue(value, this.timePickerValue);
      this.onPanelSelect(newValue);
    },
    onTimePickerSelect(time) {
      const newValue = this.getMergedOpValue(this.panelValue || getNow(), time);
      this.onPanelSelect(newValue);
    },
    isSame(current, target) {
      const unit =
        this.computedMode === 'date' || this.computedMode === 'week'
          ? 'M'
          : 'y';
      return current.isSame(target, unit);
    },
    setLocalValue(newVal) {
      if (!newVal) return;
      this.localValue = newVal;
    },
    setHeaderValue(newVal, emitChange = true) {
      if (!newVal) return;
      if (emitChange && !this.isSame(this.headerValue, newVal)) {
        const returnValue = this.getReturnValue(newVal);
        const formattedValue = getFormattedValue(newVal, this.parseValueFormat);
        const dateValue = getDateValue(newVal);
        this.$emit(
          'picker-value-change',
          returnValue,
          dateValue,
          formattedValue
        );
        this.$emit('update:pickerValue', returnValue);
      }
      this.setLocalValue(newVal);
    },
    getDefaultLocalValue() {
      return this.panelValue || this.computedDefaultPickerValue || getNow();
    },
    resetHeaderValue(emitChange = true) {
      const defaultLocalValue = this.getDefaultLocalValue();
      if (emitChange) {
        this.setHeaderValue(defaultLocalValue);
      } else {
        this.setLocalValue(defaultLocalValue);
      }
    },
    getDefaultValue() {
      return this.panelValue || this.defaultTimePickerValue || getNow();
    },
    /**
     * 组件值发生改变
     * @param {Date | string | number | undefined} value 时间
     * @param {Boolean} emitOk 是否完成选择
     */
    emitChange(value, emitOk) {
      const returnValue = value ? this.getReturnValue(value) : undefined;
      const formattedValue = getFormattedValue(value, this.parseValueFormat);
      const dateValue = getDateValue(value);
      if (isValueChange(value, this.selectedValue)) {
        this.$emit('input', returnValue);
        this.$emit('change', returnValue, dateValue, formattedValue);
        // eventHandlers.onChange()
      }

      if (emitOk) {
        this.$emit('ok', returnValue, dateValue, formattedValue);
      }
    },
    /**
     * 完成时间的选择
     * @param {Date | string | number | undefined} value 时间
     * @param {Boolean} showPanel 是否显示面板
     * @param {Boolean} emitOk 是否完成
     */
    confirm(value, showPanel, emitOk) {
      if (this.isDisabledDate(value)) {
        return;
      }
      this.emitChange(value, emitOk);
      this.processValue = undefined;
      this.previewValue = undefined;
      this.inputValue = undefined;
      this.headerMode = undefined;
      if (isBoolean(showPanel)) {
        this.panelVisible = showPanel;
      }
    },
    /**
     * 选择操作但是不改变外部值
     * @param {Date | string | number | undefined} value 时间
     * @param {Boolean} emitSelect 是否暴露事件
     */
    select(value, emitSelect) {
      this.processValue = value;
      this.previewValue = undefined;
      this.inputValue = undefined;
      this.headerMode = undefined;
      if (emitSelect) {
        const returnValue = value ? this.getReturnValue(value) : undefined;
        const formattedValue = getFormattedValue(value, this.parseValueFormat);
        const dateValue = getDateValue(value);
        this.$emit('select', returnValue, dateValue, formattedValue);
      }
    },
  },
};
</script>
