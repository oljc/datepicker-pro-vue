<template>
  <Popper
    v-if="!hideTrigger"
    trigger="click"
    animation="slide-dynamic-origin"
    :offset="4"
    :position="position"
    :disabled="triggerDisabled || readonly"
    :popup-visible="panelVisible"
    :unmount-on-close="unmountOnClose"
    :popup-container="popupContainer"
    @popupVisibleChange="setPanelVisible"
  >
    <slot>
      <DateRangeInput
        ref="refInput"
        v-bind="$attrs"
        :size="size"
        :focused="panelVisible"
        :visible="panelVisible"
        :error="error"
        :disabled="disabled"
        :readonly="readonly"
        :allow-clear="allowClear && !readonly"
        :placeholder="computedPlaceholder"
        :input-value="inputValue"
        :value="panelValue"
        :focusedIndex.sync="focusedIndex"
        :format="computedFormat"
        @clear="onInputClear"
        @change="onInputChange"
        @pressEnter="onInputPressEnter"
      >
        <template #suffix-icon>
          <slot name="suffix-icon">
            <IconCommon use="calendar" />
          </slot>
        </template>
        <template #separator>
          <slot name="separator">
            {{ separator || '-' }}
          </slot>
        </template>
      </DateRangeInput>
    </slot>
    <template #content>
      <RangePickerPanel v-bind="rangePanelProps" v-on="rangePanelOn" />
    </template>
  </Popper>
</template>

<script>
import RangePickerPanel from './range-picker-panel.vue';
import DateRangeInput from './common/input-range.vue';
import Popper from './popper/index.vue';
import IconCommon from './icon/icon-common.vue';

import { getPrefixCls } from './utils/config';
import { rangePlaceholder } from './utils/placeholder';
import { isFunction, isArray, isUndefined, isBoolean } from './utils/is';
import {
  dayjs,
  initializeDateLocale,
  getDayjsValue,
  getNow,
  methods,
  getSortedDayjsArray,
  getDateValue,
  getReturnRangeValue,
  getFormattedValue,
  isValueChange,
  isValidInputValue,
} from './utils/date';
import {
  normalizeRangeValue,
  pick,
  omit,
  getColumnsFromFormat,
  isCompleteRangeValue,
  mergeValueWithTime,
  isValidRangeValue,
} from './utils/index';

let clearShortcutPreviewTimer = null;

export default {
  name: 'RangePickerPro',
  components: {
    RangePickerPanel,
    DateRangeInput,
    Popper,
    IconCommon,
  },
  inheritAttrs: false,
  props: {
    /**
     * @zh 范围选择器的类型
     * @en Type of range selector
     * */
    mode: {
      type: String,
      default: 'date',
    },
    /**
     * @zh 绑定值
     * @en Value
     */
    modelValue: {
      type: Array,
    },
    /**
     * @zh 默认值
     * @en Default value
     */
    defaultValue: {
      type: Array,
    },
    /**
     * @zh 默认面板显示的日期
     * @en The date displayed in the default panel
     * */
    pickerValue: {
      type: Array,
    },
    /**
     * @zh 面板显示的日期
     * @en Date displayed on the panel
     * */
    defaultPickerValue: {
      type: Array,
    },
    /**
     * @zh 是否禁用
     * @en Whether to disable
     * */
    disabled: {
      type: [Boolean, Array],
      default: false,
    },
    dayStartOfWeek: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
    },
    valueFormat: {
      type: String,
    },
    showTime: {
      type: Boolean,
    },
    timePickerProps: {
      type: Object,
    },
    placeholder: {
      type: Array,
    },
    disabledDate: {
      type: Function,
    },
    disabledTime: {
      type: Function,
    },
    separator: {
      type: String,
    },
    // 时间是否会交换，默认情况下时间会影响和参与开始和结束值的排序，如果要固定时间顺序，可将其关闭。
    exchangeTime: {
      type: Boolean,
      default: true,
    },
    popupContainer: {
      type: [String, Object],
    },
    locale: {
      type: Object,
    },
    hideTrigger: {
      type: Boolean,
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
    size: {
      type: String,
    },
    showLunar: {
      type: Boolean,
    },
    shortcuts: {
      type: Array,
      default: () => [],
    },
    shortcutsPosition: {
      type: String,
      default: 'bottom',
    },
    position: {
      type: String,
      default: 'bottom',
    },
    popupVisible: {
      type: Boolean,
      default: undefined,
    },
    defaultPopupVisible: {
      type: Boolean,
    },
    triggerProps: {
      type: Object,
    },
    unmountOnClose: {
      type: Boolean,
    },
    previewShortcut: {
      type: Boolean,
      default: true,
    },
    showConfirmBtn: {
      type: Boolean,
    },
  },
  data() {
    return {
      eventHandlers: undefined,
      prefixCls: getPrefixCls('picker'),
      refInput: undefined,
      focusedIndex: this.getFocusedIndex(),
      localValue: !isUndefined(this.computedModelValue)
        ? this.computedModelValue
        : !isUndefined(this.computedDefaultValue)
        ? this.computedDefaultValue
        : [],
      processValue: undefined, // 操作值
      previewValue: undefined, // 预览值
      inputValue: undefined, // 输入操作的值
      startHeaderMode: undefined,
      endHeaderMode: undefined,
      localPanelVisible: this.popupVisible || this.defaultPopupVisible,

      startLocalValue: this.computedStartDefaultValue || getNow(),
      endLocalValue: this.computedEndDefaultValue || getNow(),

      footerValue: [
        this.panelValue?.[0] || getNow(),
        this.panelValue?.[1] || getNow(),
      ],
      startTimeValue:
        this.sValue || this.startDefaultTimePickerValue || getNow(),
      endTimeValue: this.eValue || this.endDefaultTimePickerValue || getNow(),
    };
  },
  created() {
    initializeDateLocale('zh-cn', this.dayStartOfWeek);
    // 非受控情况
    const [selected0, selected1] = this.getFormSelectedValue();
    const [header0, header1] = this.getFixedValue([
      selected0 || this.startHeaderValue,
      selected1 || this.endHeaderValue,
    ]);
    this.setStartHeaderValue(header0, false);
    this.setEndHeaderValue(header1, false);
  },
  watch: {
    computedModelValue(val) {
      if (isUndefined(val)) {
        this.localValue = [];
      }
    },
    popupVisible(newVal) {
      if (isUndefined(newVal)) {
        this.localPanelVisible = undefined;
      }
    },
    panelValue(val) {
      const [value0, value1] = val;
      this.footerValue[0] = value0 || this.footerValue[0];
      this.footerValue[1] = value1 || this.footerValue[1];
    },
    sValue(newVal) {
      if (newVal) {
        this.startTimeValue = newVal;
      }
    },
    eValue(newVal) {
      if (newVal) {
        this.endTimeValue = newVal;
      }
    },
    panelVisible(newVisible) {
      if (this.mode === 'year') {
        this.startHeaderMode = 'year';
        this.endHeaderMode = 'year';
      } else {
        this.startHeaderMode = undefined;
        this.endHeaderMode = undefined;
      }
      this.processValue = undefined;
      this.previewValue = undefined;
      // open
      if (newVisible) {
        this.resetHeaderValue();
        this.resetTimePickerValue();
        this.focusedIndex = this.getFocusedIndex(this.focusedIndex);
        this.$nextTick(() => this.focusInput(this.focusedIndex));
      }
      // close
      if (!newVisible) {
        this.inputValue = undefined;
      }
    },
    focusedIndex() {
      this.focusInput(this.focusedIndex);
      this.inputValue = undefined;
    },
  },
  computed: {
    startHeaderProps() {
      return {
        headerValue: this.startHeaderValue,
        headerOperations: this.computedStartHeaderOperations,
      };
    },
    endHeaderProps() {
      return {
        headerValue: this.endHeaderValue,
        headerOperations: this.computedEndHeaderOperations,
      };
    },
    mergedSize() {
      return this.size;
    },
    formDisabled() {
      return this.disabled;
    },
    mergedError() {
      return this.error;
    },
    computedPlaceholder() {
      return (
        this.placeholder || rangePlaceholder[this.mode] || rangePlaceholder.date
      );
    },
    computedFormat() {
      return (
        (!isFunction(this.format) && this.format) ||
        this.getDefaultFormat(this.mode, this.showTime)
      );
    },
    returnValueFormat() {
      return this.valueFormat || this.computedFormat;
    },
    parseValueFormat() {
      return ['timestamp', 'Date'].includes(this.returnValueFormat)
        ? this.computedFormat
        : this.returnValueFormat;
    },
    disabledArray() {
      const disabled0 =
        this.disabled === true ||
        this.formDisabled ||
        (isArray(this.disabled) && this.disabled[0] === true);
      const disabled1 =
        this.disabled === true ||
        this.formDisabled ||
        (isArray(this.disabled) && this.disabled[1] === true);
      return [disabled0, disabled1];
    },
    triggerDisabled() {
      return this.disabledArray[0] && this.disabledArray[1];
    },
    nextFocusedIndex() {
      const cur = this.focusedIndex;
      const next = cur ^ 1;
      return this.disabledArray[next] ? cur : next;
    },
    isNextDisabled() {
      return this.disabledArray[this.focusedIndex ^ 1];
    },
    computedModelValue() {
      return getDayjsValue(
        normalizeRangeValue(this.modelValue),
        this.parseValueFormat
      );
    },
    computedDefaultValue() {
      return getDayjsValue(
        normalizeRangeValue(this.defaultValue),
        this.parseValueFormat
      );
    },
    // 选中值-混合
    selectedValue() {
      return this.computedModelValue || this.localValue;
    },
    // 待确认的选中值
    forSelectedValue() {
      return this.processValue || this.selectedValue;
    },
    // 面板显示的值
    panelValue() {
      return this.previewValue || this.processValue || this.selectedValue;
    },
    panelVisible() {
      return !isUndefined(this.popupVisible)
        ? this.popupVisible
        : this.localPanelVisible;
    },

    unit() {
      return ['date', 'week'].includes(this.mode) ? 'M' : 'y';
    },
    span() {
      return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
        this.mode
      ];
    },
    superSpan() {
      return ['year'].includes(this.mode) ? 10 * 12 : 12;
    },
    startValue() {
      return this.pickerValue?.[0];
    },
    endValue() {
      return this.pickerValue?.[1];
    },
    startDefaultValue() {
      return this.defaultPickerValue?.[0];
    },
    endDefaultValue() {
      return this.defaultPickerValue?.[1];
    },
    // ----------------------------------------
    spanStart() {
      return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
        this.startHeaderMode || 'date'
      ];
    },
    superSpanStart() {
      return ['year'].includes(this.startHeaderMode || 'date') ? 10 * 12 : 12;
    },
    computedStartDefaultValue() {
      return getDayjsValue(this.startDefaultValue, this.format);
    },
    startHeaderValue() {
      return (
        getDayjsValue(this.startValue, this.format) || this.startLocalValue
      );
    },
    showStartSingleBtn() {
      return this.spanStart !== this.superSpanStart;
    },
    startHeaderOperations() {
      return {
        onSuperPrev: () => {
          this.setStartHeaderValue(
            methods.subtract(this.startHeaderValue, this.superSpanStart, 'M')
          );
        },
        onPrev: this.showStartSingleBtn
          ? () => {
              this.setStartHeaderValue(
                methods.subtract(this.startHeaderValue, this.spanStart, 'M')
              );
            }
          : undefined,
        onNext: this.showStartSingleBtn
          ? () => {
              this.setStartHeaderValue(
                methods.add(this.startHeaderValue, this.spanStart, 'M')
              );
            }
          : undefined,
        onSuperNext: () => {
          this.setStartHeaderValue(
            methods.add(this.startHeaderValue, this.superSpanStart, 'M')
          );
        },
      };
    },
    // *******************END******************
    spanEnd() {
      return { date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 }[
        this.endHeaderMode || 'date'
      ];
    },
    superSpanEnd() {
      return ['year'].includes(this.endHeaderMode || 'date') ? 10 * 12 : 12;
    },
    computedEndDefaultValue() {
      return getDayjsValue(this.endDefaultValue, this.format);
    },
    endHeaderValue() {
      return getDayjsValue(this.endValue, this.format) || this.endLocalValue;
    },
    showSingleBtn() {
      return this.spanEnd !== this.superSpanEnd;
    },
    endHeaderOperations() {
      return {
        onSuperPrev: () => {
          this.setEndHeaderValue(
            methods.subtract(this.endHeaderValue, this.superSpanEnd, 'M')
          );
        },
        onPrev: this.showSingleBtn
          ? () => {
              this.setEndHeaderValue(
                methods.subtract(this.endHeaderValue, this.spanEnd, 'M')
              );
            }
          : undefined,
        onNext: this.showSingleBtn
          ? () => {
              this.setEndHeaderValue(
                methods.add(this.endHeaderValue, this.spanEnd, 'M')
              );
            }
          : undefined,
        onSuperNext: () => {
          this.setEndHeaderValue(
            methods.add(this.endHeaderValue, this.superSpanEnd, 'M')
          );
        },
      };
    },
    /** ************* 以下为操作 ****************** */
    canShortenMonth() {
      return methods
        .add(this.startHeaderValue, this.span, 'M')
        .isBefore(this.endHeaderValue, this.unit);
    },
    canShortenYear() {
      return methods
        .add(this.startHeaderValue, this.superSpan, 'M')
        .isBefore(this.endHeaderValue, this.unit);
    },
    computedStartHeaderOperations() {
      const operations = ['onSuperPrev', 'onPrev'];
      if (this.canShortenMonth) operations.push('onNext');
      if (this.canShortenYear) operations.push('onSuperNext');
      return pick(this.startHeaderOperations, operations);
    },
    computedEndHeaderOperations() {
      const operations = ['onSuperNext', 'onNext'];
      if (this.canShortenMonth) operations.push('onPrev');
      if (this.canShortenYear) operations.push('onSuperPrev');
      return pick(this.endHeaderOperations, operations);
    },
    sValue() {
      return this.panelValue?.[0];
    },
    eValue() {
      return this.panelValue?.[1];
    },
    timePickerDefaultValue() {
      return this.timePickerProps?.defaultValue;
    },
    startTimePickerProps() {
      return isArray(this.timePickerDefaultValue)
        ? {
            ...this.timePickerProps,
            defaultValue: this.timePickerDefaultValue[0],
          }
        : this.timePickerProps;
    },
    endTimePickerProps() {
      return isArray(this.timePickerDefaultValue)
        ? {
            ...this.timePickerProps,
            defaultValue: this.timePickerDefaultValue.value[1],
          }
        : this.timePickerProps;
    },
    startTimePickerPropsFormat() {
      return this.startTimePickerProps?.format;
    },
    starTimePickerPropsUse12Hours() {
      return !!this.startTimePickerProps?.use12Hours;
    },
    startFormat() {
      let res = this.starTimePickerPropsFormat || undefined;
      if (!res || !getColumnsFromFormat(res).list.length) {
        res = this.starTimePickerPropsUse12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
      }
      return res;
    },
    startDefaultTimePickerValue() {
      return getDayjsValue(
        this.startTimePickerProps?.defaultValue,
        this.startFormat
      );
    },
    endTimePickerPropsFormat() {
      return this.endTimePickerProps?.format;
    },
    endimePickerPropsUse12Hours() {
      return !!this.endTimePickerProps?.use12Hours;
    },
    endFormat() {
      let res = this.endimePickerPropsFormat || undefined;
      if (!res || !getColumnsFromFormat(res).list.length) {
        res = this.endimePickerPropsUse12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
      }
      return res;
    },
    endDefaultTimePickerValue() {
      return getDayjsValue(
        this.endTimePickerProps?.defaultValue,
        this.endFormat
      );
    },
    timePickerValue() {
      return [this.startTimeValue, this.endTimeValue];
    },
    isDateTime() {
      return this.mode === 'date' && this.showTime;
    },
    hasTime() {
      return this.isDateTime || this.timePickerProps;
    },
    needCheckTime() {
      return this.mode === 'date' && this.showTime;
    },
    useIsDisabledDate() {
      return (current, type) => {
        if (!this.disabledDate) return false;
        const dateValue = getDateValue(current);
        return this.disabledDate(dateValue, type);
      };
    },
    useIsDisabledTime() {
      return (current, type) => {
        if (!this.needCheckTime) return false;
        if (!this.disabledTime) return false;
        const dateValue = getDateValue(current);
        const disabledTimeProps = this.disabledTime(dateValue, type);
        return (
          this.isDisabledItem(
            current.hour(),
            disabledTimeProps.disabledHours
          ) ||
          this.isDisabledItem(
            current.minute(),
            disabledTimeProps.disabledMinutes
          ) ||
          this.isDisabledItem(
            current.second(),
            disabledTimeProps.disabledSeconds
          )
        );
      };
    },
    needConfirm() {
      return this.isDateTime || this.showConfirmBtn;
    },
    confirmBtnDisabled() {
      return (
        this.needConfirm &&
        (!isCompleteRangeValue(this.forSelectedValue) ||
          this.isDisabledDate(this.forSelectedValue[0], 'start') ||
          this.isDisabledDate(this.forSelectedValue[1], 'end'))
      );
    },
    computedTimePickerProps() {
      return {
        format: this.computedFormat,
        ...omit(this.timePickerProps || {}, ['defaultValue']),
        visible: this.panelVisible,
      };
    },
    rangePanelProps() {
      return {
        ...pick(this.$props, [
          'mode',
          'showTime',
          'shortcuts',
          'shortcutsPosition',
          'dayStartOfWeek',
          'disabledDate',
          'disabledTime',
          'hideTrigger',
        ]),
        prefixCls: this.prefixCls,
        format: this.parseValueFormat,
        value: this.panelValue,
        showConfirmBtn: this.needConfirm,
        confirmBtnDisabled: this.confirmBtnDisabled,
        timePickerValue: this.timePickerValue,
        timePickerProps: this.computedTimePickerProps,
        extra: this.$slots.extra,
        dateRender: this.$slots.cell,
        startHeaderProps: this.startHeaderProps,
        endHeaderProps: this.endHeaderProps,
        footerValue: this.footerValue,
        disabled: this.disabledArray,
        visible: this.panelVisible,
        startHeaderMode: this.startHeaderMode,
        endHeaderMode: this.endHeaderMode,
        showLunar: this.showLunar,
      };
    },
    rangePanelOn() {
      return {
        onCellClick: this.onPanelCellClick,
        onCellMouseEnter: this.onPanelCellMouseEnter,
        onShortcutClick: this.onPanelShortcutClick,
        onShortcutMouseEnter: this.previewShortcut
          ? this.onPanelShortcutMouseEnter
          : undefined,
        onShortcutMouseLeave: this.previewShortcut
          ? this.onPanelShortcutMouseLeave
          : undefined,
        onConfirm: this.onPanelConfirm,
        onTimePickerSelect: this.onTimePickerSelect,
        onStartHeaderLabelClick: this.onStartPanelHeaderLabelClick,
        onEndHeaderLabelClick: this.onEndPanelHeaderLabelClick,
        onStartHeaderSelect: this.onStartPanelHeaderSelect,
        onEndHeaderSelect: this.onEndPanelHeaderSelect,
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
    getFocusedIndex(cur = 0) {
      return this.disabledArray?.[cur] ? cur ^ 1 : cur;
    },
    setPanelVisible(newVisible) {
      if (this.panelVisible !== newVisible) {
        this.localPanelVisible = newVisible;
        this.$emit('popup-visible-change', newVisible);
        this.$emit('update:popupVisible', newVisible);
      }
    },

    onChange(newVal) {
      const returnValue = getReturnRangeValue(newVal, this.returnValueFormat);
      const formattedValue = getFormattedValue(newVal, this.parseValueFormat);
      const dateValue = getDateValue(newVal);
      this.$emit('picker-value-change', returnValue, dateValue, formattedValue);
      this.$emit('update:pickerValue', returnValue);
    },
    // --------------
    isSameStart(current, target) {
      const computedMode = this.startHeaderMode || 'date';
      const unit =
        computedMode === 'date' || computedMode === 'week' ? 'M' : 'y';
      return current.isSame(target, unit);
    },
    setStartLocalValue(newVal) {
      if (!newVal) return;
      this.startLocalValue = newVal;
    },
    setStartHeaderValue(newVal, emitChange = true) {
      if (!newVal) return;
      if (emitChange && !this.isSameStart(this.startHeaderValue, newVal)) {
        this.onChange([newVal, this.endHeaderValue]);
      }
      this.setStartLocalValue(newVal);
    },
    getDefaultStartHeaderValue() {
      return this.computedStartDefaultValue || getNow();
    },
    resetStartHeaderValue(emitChange = true) {
      const defaultLocalValue = this.getDefaultStartHeaderValue();
      if (emitChange) {
        this.setStartHeaderValue(defaultLocalValue);
      } else {
        this.setStartLocalValue(defaultLocalValue);
      }
    },
    // ***************END***************
    isSameEnd(current, target) {
      const computedMode = this.endHeaderMode || 'date';
      const unit =
        computedMode === 'date' || computedMode === 'week' ? 'M' : 'y';
      return current.isSame(target, unit);
    },
    setLocalValue(newVal) {
      if (!newVal) return;
      this.endLocalValue = newVal;
    },
    setEndHeaderValue(newVal, emitChange = true) {
      if (!newVal) return;
      if (emitChange && !this.isSameEnd(this.endHeaderValue, newVal)) {
        this.onChange([this.startHeaderValue, newVal]);
      }
      this.setLocalValue(newVal);
    },
    getDefaultEndHeaderValue() {
      return this.computedEndDefaultValue || getNow();
    },
    resetEndHeaderValue(emitChange = true) {
      const defaultLocalValue = this.getDefaultEndHeaderValue();
      if (emitChange) {
        this.setEndHeaderValue(defaultLocalValue);
      } else {
        this.setLocalValue(defaultLocalValue);
      }
    },
    // -1-------
    setHeaderValue(newVal) {
      const isSameStartValue = this.startHeaderValue.isSame(
        newVal[0],
        this.unit
      );
      const isSameEndValue = this.endHeaderValue.isSame(newVal[1], this.unit);
      this.setStartHeaderValue(newVal[0], false);
      this.setEndHeaderValue(newVal[1], false);
      if (!isSameStartValue || !isSameEndValue) {
        this.onChange(newVal);
      }
    },
    getFixedValue(values) {
      // eslint-disable-next-line prefer-const
      let [header0, header1] = getSortedDayjsArray(values);
      const nextHeader = methods.add(header0, this.span, 'M');
      if (header1.isBefore(nextHeader, this.unit)) {
        header1 = nextHeader;
      }
      return [header0, header1];
    },
    getFormSelectedValue() {
      let selected0 = this.panelValue?.[0];
      let selected1 = this.panelValue?.[1];
      if (selected0 && selected1) {
        [selected0, selected1] = getSortedDayjsArray([selected0, selected1]);
      }
      return [selected0, selected1];
    },
    resetHeaderValue() {
      const defaultStartHeaderValue = this.getDefaultStartHeaderValue();
      const defaultEndHeaderValue = this.getDefaultEndHeaderValue();
      this.$nextTick(() => {
        const [selected0, selected1] = this.getFormSelectedValue();
        const [header0, header1] = this.getFixedValue([
          selected0 || defaultStartHeaderValue,
          selected1 || defaultEndHeaderValue,
        ]);
        this.setHeaderValue([header0, header1]);
      });
    },

    onStartPanelHeaderLabelClick(type) {
      this.startHeaderMode = type;
    },
    onEndPanelHeaderLabelClick(type) {
      this.endHeaderMode = type;
    },
    onStartPanelHeaderSelect(date) {
      let newStartValue = this.startHeaderValue;
      newStartValue = newStartValue.set('year', date.year());
      if (this.startHeaderMode === 'month') {
        newStartValue = newStartValue.set('month', date.month());
      }
      this.setHeaderValue([newStartValue, this.endHeaderValue]);
      this.startHeaderMode = undefined;
    },
    onEndPanelHeaderSelect(date) {
      let newEndValue = this.endHeaderValue;
      newEndValue = newEndValue.set('year', date.year());
      if (this.endHeaderMode === 'month') {
        newEndValue = newEndValue.set('month', date.month());
      }
      this.setHeaderValue([this.startHeaderValue, newEndValue]);
      this.endHeaderMode = undefined;
    },
    setTimePickerValue(val) {
      if (!val) return;
      const [start, end] = val;
      this.startTimeValue = start;
      this.endTimeValue = end;
    },
    resetTimePickerValue() {
      this.startTimeValue =
        this.sValue || this.startDefaultTimePickerValue || getNow();
      this.endTimeValue =
        this.eValue || this.endDefaultTimePickerValue || getNow();
    },
    isDisabledItem(num, getDisabledList) {
      const list = getDisabledList?.() || [];
      return list.includes(num);
    },
    isDisabledDate(value, type) {
      return (
        value &&
        (this.useIsDisabledDate(value, type || 'start') ||
          this.useIsDisabledTime(value, type || 'start'))
      );
    },
    emitChange(value, emitOk) {
      const returnValue = value
        ? getReturnRangeValue(value, this.returnValueFormat)
        : undefined;
      const formattedValue = getFormattedValue(value, this.parseValueFormat);
      const dateValue = getDateValue(value);
      if (isValueChange(value, this.selectedValue)) {
        this.$emit('update:modelValue', returnValue);
        this.$emit('change', returnValue, dateValue, formattedValue);
        this.eventHandlers?.onChange();
      }
      if (emitOk) {
        this.$emit('ok', returnValue, dateValue, formattedValue);
      }
    },
    confirm(value, showPanel, emitOk) {
      if (
        this.isDisabledDate(value?.[0], 'start') ||
        this.isDisabledDate(value?.[1], 'end')
      ) {
        return;
      }
      let newValue = value ? [...value] : undefined;
      if (isCompleteRangeValue(newValue)) {
        let sortedValue = getSortedDayjsArray(newValue);
        if (this.hasTime && !this.exchangeTime) {
          sortedValue = [
            this.getMergedOpValue(sortedValue[0], newValue[0]),
            this.getMergedOpValue(sortedValue[1], newValue[1]),
          ];
        }
        newValue = sortedValue;
      }
      this.emitChange(newValue, emitOk);
      this.localValue = newValue || [];
      this.processValue = undefined;
      this.previewValue = undefined;
      this.inputValue = undefined;
      this.startHeaderMode = undefined;
      this.endHeaderMode = undefined;
      if (isBoolean(showPanel)) {
        this.setPanelVisible(showPanel);
      }
    },
    emitSelectEvent(value) {
      const returnValue = getReturnRangeValue(value, this.returnValueFormat);
      const formattedValue = getFormattedValue(value, this.parseValueFormat);
      const dateValue = getDateValue(value);
      this.$emit('select', returnValue, dateValue, formattedValue);
    },
    select(value, options) {
      const { emitSelect = false, updateHeader = false } = options || {};
      let newValue = [...value];
      if (isCompleteRangeValue(newValue)) {
        newValue = getSortedDayjsArray(newValue);
      }
      this.processValue = newValue;
      this.previewValue = undefined;
      this.inputValue = undefined;
      this.startHeaderMode = undefined;
      this.endHeaderMode = undefined;
      if (emitSelect) {
        this.emitSelectEvent(newValue);
      }
      if (updateHeader) {
        this.resetHeaderValue();
      }
    },
    preview(value, options) {
      const { updateHeader = false } = options || {};
      this.previewValue = value;
      this.inputValue = undefined;
      if (updateHeader) {
        this.resetHeaderValue();
      }
    },
    focusInput(index) {
      this.$refs.refInput?.focus(index);
    },
    getMergedOpValue(date, time) {
      if (!this.hasTime) return date;
      return mergeValueWithTime(getNow(), date, time);
    },
    onPanelCellMouseEnter(date) {
      if (
        this.processValue &&
        this.panelValue[this.nextFocusedIndex] &&
        (!this.needConfirm || !isCompleteRangeValue(this.processValue))
      ) {
        const newValue = [...this.panelValue];
        const mergedOpValue = this.getMergedOpValue(
          date,
          this.timePickerValue[this.focusedIndex]
        );
        newValue[this.focusedIndex] = mergedOpValue;
        this.preview(newValue);
      }
    },
    getValueToModify(isTime = false) {
      if (this.isNextDisabled) return [...this.selectedValue];
      if (this.processValue) {
        return isTime || !isCompleteRangeValue(this.processValue)
          ? [...this.processValue]
          : [];
      }
      return isTime ? [...this.selectedValue] : [];
    },
    onPanelCellClick(date) {
      console.log('单击', date);
      const newValue = this.getValueToModify();
      const mergedOpValue = this.getMergedOpValue(
        date,
        this.timePickerValue[this.focusedIndex]
      );
      newValue[this.focusedIndex] = mergedOpValue;
      this.emitSelectEvent(newValue);
      if (!this.needConfirm && isCompleteRangeValue(newValue)) {
        this.confirm(newValue, false);
      } else {
        this.select(newValue);
        if (!isCompleteRangeValue(newValue)) {
          this.focusedIndex = this.nextFocusedIndex;
        }
      }
    },
    onTimePickerSelect(time, type) {
      const updateIndex = type === 'start' ? 0 : 1;
      const mergedOpValue = this.getMergedOpValue(
        this.timePickerValue[updateIndex],
        time
      );
      const newTimeValue = [...this.timePickerValue];
      newTimeValue[updateIndex] = mergedOpValue;
      this.setTimePickerValue(newTimeValue);

      const newValue = this.getValueToModify(true);
      if (newValue[updateIndex]) {
        newValue[updateIndex] = mergedOpValue;
        this.select(newValue, { emitSelect: true });
      }
    },
    onPanelShortcutMouseEnter(value) {
      clearTimeout(clearShortcutPreviewTimer);
      this.preview(value, { updateHeader: true });
    },
    onPanelShortcutMouseLeave() {
      clearTimeout(clearShortcutPreviewTimer);
      clearShortcutPreviewTimer = setTimeout(() => {
        this.previewValue = undefined;
        this.inputValue = undefined;
        this.resetHeaderValue();
      }, 100);
    },
    onPanelShortcutClick(value, shortcut) {
      this.$emit('select-shortcut', shortcut);
      this.confirm(value, false);
    },
    onPanelConfirm() {
      this.confirm(this.panelValue, false, true);
    },
    onInputClear(e) {
      e.stopPropagation();
      this.confirm(undefined);
      this.$emit('clear');
    },
    onInputChange(e) {
      this.setPanelVisible(true);
      const targetValue = e.target.value;
      // TODO: Null value should be restored to the current value, invalid when deleted as a whole
      if (!targetValue) {
        this.inputValue = undefined;
        return;
      }
      const formattedPanelValue = getFormattedValue(
        this.panelValue,
        this.computedFormat
      );
      const newInputValue = isArray(this.inputValue)
        ? [...this.inputValue]
        : formattedPanelValue || [];

      newInputValue[this.focusedIndex] = targetValue;
      this.inputValue = newInputValue;
      if (!isValidInputValue(targetValue, this.computedFormat)) return;
      const targetValueDayjs = dayjs(targetValue, this.computedFormat);
      if (
        this.isDisabledDate(
          targetValueDayjs,
          this.focusedIndex === 0 ? 'start' : 'end'
        )
      )
        return;

      const newValue = isArray(this.panelValue) ? [...this.panelValue] : [];
      newValue[this.focusedIndex] = targetValueDayjs;
      this.select(newValue, { updateHeader: true });
    },
    onInputPressEnter() {
      if (isValidRangeValue(this.panelValue)) {
        this.confirm(this.panelValue, false);
      } else {
        this.focusedIndex = this.nextFocusedIndex;
      }
    },
  },
  beforeDestroy() {
    clearTimeout(clearShortcutPreviewTimer);
  },
};
</script>
