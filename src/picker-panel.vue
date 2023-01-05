<template>
  <div :class="classNames">
    <PanelShortcuts
      v-if="showShortcutsInLeft"
      v-bind="shortcutsProps"
      @itemClick="onShortcutClick"
      @itemMouseEnter="onShortcutMouseEnter"
      @itemMouseLeave="onShortcutMouseLeave"
      @nowClick="onTodayBtnClick"
    />
    <div :class="`${prefixCls}-panel-wrapper`">
      <template v-if="headerMode">
        <YearPanel
          v-if="headerMode === 'year'"
          :header-value="localValue"
          :show-lunar="showLunar"
          :header-operations="headerPanelHeaderOperations"
          @select="onHeaderPanelSelect"
        />
        <MonthPanel
          v-else-if="headerMode === 'month'"
          :header-value="localValue"
          :show-lunar="showLunar"
          :header-operations="headerPanelHeaderOperations"
          :onHeaderLabelClick="onMonthHeaderLabelClick"
          @select="onHeaderPanelSelect"
        />
      </template>
      <template v-else>
        <WeekPanel
          v-if="mode === 'week'"
          v-bind="commonPanelProps"
          :day-start-of-week="dayStartOfWeek"
          @select="onPanelSelect"
        />
        <MonthPanel
          v-else-if="mode === 'month'"
          v-bind="commonPanelProps"
          @select="onPanelSelect"
        />
        <YearPanel
          v-else-if="mode === 'year'"
          v-bind="commonPanelProps"
          @select="onPanelSelect"
        />
        <QuarterPanel
          v-else-if="mode === 'quarter'"
          v-bind="commonPanelProps"
          @select="onPanelSelect"
        />
        <DatePanel
          v-else
          v-bind="commonPanelProps"
          mode="date"
          :show-time="showTime"
          :time-picker-props="timePickerProps"
          :day-start-of-week="dayStartOfWeek"
          :footer-value="footerValue"
          :time-picker-value="timePickerValue"
          :disabled-time="disabledTime"
          @select="onPanelSelect"
          @timePickerSelect="onTimePickerSelect"
        />
        <PanelFooter
          :prefix-cls="prefixCls"
          :show-today-btn="
            showNowBtn && !(showConfirmBtn || showShortcutsInBottom)
          "
          :show-confirm-btn="showConfirmBtn"
          :confirm-btn-disabled="confirmBtnDisabled"
          @todayBtnClick="onTodayBtnClick"
          @confirmBtnClick="onConfirmBtnClick"
        >
          <template v-if="extra" #extra>
            <RenderFunction v-if="extra" :render-func="extra" />
          </template>
          <template v-if="showShortcutsInBottom" #btn>
            <PanelShortcuts
              v-bind="shortcutsProps"
              @itemClick="onShortcutClick"
              @itemMouseEnter="onShortcutMouseEnter"
              @itemMouseLeave="onShortcutMouseLeave"
              @nowClick="onTodayBtnClick"
            />
          </template>
        </PanelFooter>
      </template>
    </div>
    <PanelShortcuts
      v-if="showShortcutsInRight"
      v-bind="shortcutsProps"
      @itemClick="onShortcutClick"
      @itemMouseEnter="onShortcutMouseEnter"
      @itemMouseLeave="onShortcutMouseLeave"
      @nowClick="onTodayBtnClick"
    />
  </div>
</template>

<script>
import PanelShortcuts from './panels/shortcuts.vue';
import DatePanel from './panels/date/index.vue';
import WeekPanel from './panels/week/index.vue';
import MonthPanel from './panels/month/index.vue';
import YearPanel from './panels/year/index.vue';
import QuarterPanel from './panels/quarter/index.vue';
import PanelFooter from './panels/footer.vue';
import RenderFunction from './common/render-function.vue';

import { isFunction } from './utils/is';
import { getDayjsValue, getNow, methods } from './utils/date';

export default {
  name: 'DatePikerPanel',
  components: {
    DatePanel,
    PanelShortcuts,
    PanelFooter,
    WeekPanel,
    MonthPanel,
    YearPanel,
    QuarterPanel,
    RenderFunction,
  },
  props: {
    mode: {
      type: String,
    },
    headerMode: {
      type: String,
    },
    prefixCls: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
    },
    headerValue: {
      type: Object,
      required: true,
    },
    timePickerValue: {
      type: Object,
    },
    showTime: {
      type: Boolean,
    },
    showConfirmBtn: {
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
    format: {
      type: String,
      required: true,
    },
    dayStartOfWeek: {
      type: Number,
      default: 0,
    },
    disabledDate: {
      type: Function,
    },
    disabledTime: {
      type: Function,
    },
    timePickerProps: {
      type: Object,
    },
    extra: {
      type: [Object, Function],
    },
    dateRender: {
      type: Function,
    },
    hideTrigger: {
      type: Boolean,
    },
    confirmBtnDisabled: {
      type: Boolean,
    },
    showNowBtn: {
      type: Boolean,
    },
    showLunar: {
      type: Boolean,
    },
    headerOperations: {
      type: Object,
    },
  },
  data() {
    return {
      localValue: getNow(),
    };
  },
  watch: {
    headerValue(val) {
      this.setHeaderPanelHeaderValue(val);
    },
  },
  computed: {
    shortcutsProps() {
      return {
        prefixCls: this.prefixCls,
        shortcuts: this.shortcuts,
        showNowBtn: this.showShortcutsNowBtn,
      };
    },
    commonPanelProps() {
      return {
        value: this.value,
        headerValue: this.headerValue,
        headerOperations: this.headerOperations,
        disabledDate: this.disabledDate,
        dateRender: this.dateRender,
        showLunar: this.showLunar,
        onHeaderLabelClick: this.onPanelHeaderLabelClick,
      };
    },
    showShortcutsNowBtn() {
      return (
        this.showNowBtn &&
        this.showConfirmBtn &&
        !(this.shortcuts && this.shortcuts.length)
      );
    },
    showShortcuts() {
      return (
        this.showShortcutsNowBtn || (this.shortcuts && this.shortcuts.length)
      );
    },
    showShortcutsInLeft() {
      return this.showShortcuts && this.shortcutsPosition === 'left';
    },
    showShortcutsInRight() {
      return this.showShortcuts && this.shortcutsPosition === 'right';
    },
    showShortcutsInBottom() {
      return this.showShortcuts && this.shortcutsPosition === 'bottom';
    },
    classNames() {
      return [
        `${this.prefixCls}-container`,
        {
          [`${this.prefixCls}-container-panel-only`]: this.hideTrigger,
          [`${this.prefixCls}-container-shortcuts-placement-left`]:
            this.showShortcutsInLeft,
          [`${this.prefixCls}-container-shortcuts-placement-right`]:
            this.showShortcutsInRight,
        },
      ];
    },
    footerValue() {
      return this.value || getNow();
    },

    computedMode() {
      return this.headerMode || 'date';
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
    showSingleBtn() {
      return this.span !== this.superSpan;
    },
    headerPanelHeaderOperations() {
      return {
        onSuperPrev: () => {
          this.setHeaderPanelHeaderValue(
            methods.subtract(this.localValue, this.superSpan, 'M')
          );
        },
        onPrev: this.showSingleBtn
          ? () => {
              this.setHeaderPanelHeaderValue(
                methods.subtract(this.localValue, this.span, 'M')
              );
            }
          : undefined,
        onNext: this.showSingleBtn
          ? () => {
              this.setHeaderPanelHeaderValue(
                methods.add(this.localValue, this.span, 'M')
              );
            }
          : undefined,
        onSuperNext: () => {
          this.setHeaderPanelHeaderValue(
            methods.add(this.localValue, this.superSpan, 'M')
          );
        },
      };
    },
  },
  methods: {
    isSame(current, target) {
      const unit =
        this.computedMode === 'date' || this.computedMode === 'week'
          ? 'M'
          : 'y';
      return current.isSame(target, unit);
    },
    setHeaderPanelHeaderValue(newVal, emitChange = true) {
      if (!newVal) return;
      if (emitChange && !this.isSame(this.localValue, newVal)) {
        this.onChange && this.onChange(newVal);
      }
      this.localValue = newVal;
    },

    getShortcutValue(shortcut) {
      const { value } = shortcut;
      return getDayjsValue(
        isFunction(value) ? value() : value,
        shortcut.format || this.format
      );
    },
    onShortcutClick(shortcut) {
      this.$emit('onShortcutClick', this.getShortcutValue(shortcut), shortcut);
    },
    onShortcutMouseEnter(shortcut) {
      this.$emit('onShortcutMouseEnter', this.getShortcutValue(shortcut));
    },
    onShortcutMouseLeave(shortcut) {
      this.$emit('onShortcutMouseLeave', this.getShortcutValue(shortcut));
    },

    onPanelSelect(date) {
      this.$emit('onCellClick', date);
    },
    onTimePickerSelect(time) {
      this.$emit('onTimePickerSelect', time);
    },

    onTodayBtnClick() {
      this.$emit('onTodayBtnClick', getNow());
    },

    onConfirmBtnClick() {
      this.$emit('onConfirm');
    },

    onPanelHeaderLabelClick(type) {
      this.$emit('onHeaderLabelClick', type);
    },

    onHeaderPanelSelect(date) {
      this.$emit('onHeaderSelect', date);
    },

    onMonthHeaderLabelClick() {
      this.$emit('onMonthHeaderClick');
    },
  },
};
</script>
