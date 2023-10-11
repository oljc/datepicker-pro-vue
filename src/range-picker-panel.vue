<template>
  <div :class="classNames">
    <PanelShortcuts
      v-if="showShortcuts && shortcutsPosition === 'left'"
      :prefixCls="prefixCls"
      :shortcuts="shortcuts"
      @itemClick="onShortcutClick"
      @itemMouseEnter="onShortcutMouseEnter"
      @itemMouseLeave="onShortcutMouseLeave"
    />
    <div :class="`${prefixCls}-range-panel-wrapper`">
      <div :class="`${prefixCls}-range`">
        <div :class="`${prefixCls}-range-wrapper`">
          <template v-if="startHeaderMode || endHeaderMode">
            <YearPanel
              v-if="startHeaderMode === 'year'"
              v-bind="startPanelProps"
              v-on="startPanelOn"
              :onHeaderLabelClick="onStartPanelHeaderLabelClick"
            />
            <YearPanel
              v-if="endHeaderMode === 'year'"
              v-bind="endPanelProps"
              v-on="endPanelOn"
              :onHeaderLabelClick="onEndPanelHeaderLabelClick"
            />
            <MonthPanel
              v-else-if="startHeaderMode === 'month'"
              v-bind="startPanelProps"
              v-on="startPanelOn"
              :onHeaderLabelClick="onStartPanelHeaderLabelClick"
            />
            <MonthPanel
              v-else-if="endHeaderMode === 'month'"
              v-bind="endPanelProps"
              :onHeaderLabelClick="onEndPanelHeaderLabelClick"
              v-on="endPanelOn"
            />
          </template>
          <template v-else>
            <template v-if="mode === 'week'">
              <WeekPanel
                v-bind="startPanelProps"
                v-on="startPanelOn"
                :onHeaderLabelClick="onStartPanelHeaderLabelClick"
                :day-start-of-week="dayStartOfWeek"
              />
              <WeekPanel
                v-bind="endPanelProps"
                :onHeaderLabelClick="onEndPanelHeaderLabelClick"
                v-on="endPanelOn"
                :day-start-of-week="dayStartOfWeek"
              />
            </template>
            <template v-else-if="mode === 'month'">
              <MonthPanel
                v-bind="startPanelProps"
                v-on="startPanelOn"
                :onHeaderLabelClick="onStartPanelHeaderLabelClick"
              />
              <MonthPanel
                v-bind="endPanelProps"
                v-on="endPanelOn"
                :onHeaderLabelClick="onEndPanelHeaderLabelClick"
              />
            </template>
            <template v-else-if="mode === 'year'">
              <YearPanel
                v-bind="startPanelProps"
                v-on="startPanelOn"
                :onHeaderLabelClick="onStartPanelHeaderLabelClick"
              />
              <YearPanel
                v-bind="endPanelProps"
                v-on="endPanelOn"
                :onHeaderLabelClick="onEndPanelHeaderLabelClick"
              />
            </template>
            <template v-else-if="mode === 'quarter'">
              <QuarterPanel
                v-bind="startPanelProps"
                v-on="startPanelOn"
                :onHeaderLabelClick="onStartPanelHeaderLabelClick"
              />
              <QuarterPanel
                v-bind="endPanelProps"
                v-on="endPanelOn"
                :onHeaderLabelClick="onEndPanelHeaderLabelClick"
              />
            </template>
            <template v-else>
              <DatePanel
                v-bind="startPanelProps"
                v-on="startPanelOn"
                :onHeaderLabelClick="onStartPanelHeaderLabelClick"
                is-range
                :currentView.sync="currentDateView"
                :value="value && value[0]"
                :footer-value="footerValue && footerValue[0]"
                :time-picker-value="timePickerValue && timePickerValue[0]"
                :day-start-of-week="dayStartOfWeek"
                :show-time="showTime"
                :time-picker-props="timePickerProps"
                :disabled-time="getDisabledTimeFunc(0)"
                :disabled="disabled[0]"
                @timePickerSelect="onStartTimePickerSelect"
              />
              <DatePanel
                v-bind="endPanelProps"
                v-on="endPanelOn"
                is-range
                :onHeaderLabelClick="onEndPanelHeaderLabelClick"
                :value="value && value[1]"
                :currentView.sync="currentDateView"
                :footer-value="footerValue && footerValue[1]"
                :time-picker-value="timePickerValue && timePickerValue[1]"
                :day-start-of-week="dayStartOfWeek"
                :show-time="showTime"
                :time-picker-props="timePickerProps"
                :disabled-time="getDisabledTimeFunc(1)"
                :disabled="disabled[1]"
                @timePickerSelect="onEndTimePickerSelect"
              />
            </template>
          </template>
        </div>
      </div>
      <PanelFooter
        :prefix-cls="prefixCls"
        :show-today-btn="false"
        :show-confirm-btn="showConfirmBtn"
        :confirm-btn-disabled="confirmBtnDisabled"
        @confirmBtnClick="onConfirmBtnClick"
      >
        <template v-if="extra || $slots.extra" #extra>
          <slot v-if="$slots.extra" name="extra" />
          <RenderFunction v-else :render-func="extra" />
        </template>
        <template v-if="showShortcuts && shortcutsPosition === 'bottom'" #btn>
          <PanelShortcuts
            :prefixCls="prefixCls"
            :shortcuts="shortcuts"
            @itemClick="onShortcutClick"
            @itemMouseEnter="onShortcutMouseEnter"
            @itemMouseLeave="onShortcutMouseLeave"
          />
        </template>
      </PanelFooter>
    </div>
    <PanelShortcuts
      v-if="showShortcuts && shortcutsPosition === 'right'"
      :prefixCls="prefixCls"
      :shortcuts="shortcuts"
      @itemClick="onShortcutClick"
      @itemMouseEnter="onShortcutMouseEnter"
      @itemMouseLeave="onShortcutMouseLeave"
    />
  </div>
</template>
<script>
import PanelShortcuts from './panels/shortcuts.vue';
import PanelFooter from './panels/footer.vue';
import RenderFunction from './common/render-function.vue';
import DatePanel from './panels/date/index.vue';
import WeekPanel from './panels/week/index.vue';
import MonthPanel from './panels/month/index.vue';
import YearPanel from './panels/year/index.vue';
import QuarterPanel from './panels/quarter/index.vue';

import { isArray, isFunction } from './utils/is';
import { getDayjsValue } from './utils/date';
import { normalizeRangeValue } from './utils/index';

export default {
  name: 'DateRangePikerPanel',
  components: {
    PanelShortcuts,
    PanelFooter,
    RenderFunction,
    DatePanel,
    WeekPanel,
    MonthPanel,
    YearPanel,
    QuarterPanel,
  },
  props: {
    mode: {
      type: String,
      default: 'date',
    },
    value: {
      type: Array,
      default: () => [],
    },
    footerValue: {
      type: Array,
    },
    timePickerValue: {
      type: Array,
    },
    showTime: {
      type: Boolean,
    },
    showConfirmBtn: {
      type: Boolean,
    },
    prefixCls: {
      type: String,
      required: true,
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
      type: Function,
    },
    dateRender: {
      type: Function,
    },
    hideTrigger: {
      type: Boolean,
    },
    startHeaderProps: {
      type: Object,
      default: () => ({}),
    },
    endHeaderProps: {
      type: Object,
      default: () => ({}),
    },
    confirmBtnDisabled: {
      type: Boolean,
    },
    disabled: {
      type: Array,
      default: () => [false, false],
    },
    visible: {
      type: Boolean,
    },
    startHeaderMode: {
      type: String,
    },
    endHeaderMode: {
      type: String,
    },
    showLunar: {
      type: Boolean,
    },
  },
  data() {
    return {
      currentDateView: 'date',
    };
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.currentDateView = 'date';
      }
    },
  },
  computed: {
    showShortcuts() {
      return isArray(this.shortcuts) && this.shortcuts.length;
    },
    classNames() {
      return [
        `${this.prefixCls}-range-container`,
        {
          [`${this.prefixCls}-range-container-panel-only`]: this.hideTrigger,
          [`${this.prefixCls}-range-container-shortcuts-placement-left`]:
            this.showShortcuts && this.shortcutsPosition === 'left',
          [`${this.prefixCls}-range-container-shortcuts-placement-right`]:
            this.showShortcuts && this.shortcutsPosition === 'right',
        },
      ];
    },
    startPanelProps() {
      return {
        ...this.startHeaderProps,
        rangeValues: this.value,
        disabledDate: this.getDisabledDateFunc(0),
        dateRender: this.getDateRenderFunc(0),
        showLunar: this.showLunar,
      };
    },
    startPanelOn() {
      return {
        select:
          this.startHeaderMode && this.startHeaderMode !== 'year'
            ? this.onStartHeaderPanelSelect
            : this.onPanelCellClick,
        cellMouseEnter: this.onPanelCellMouseEnter,
      };
    },
    endPanelProps() {
      return {
        ...this.endHeaderProps,
        rangeValues: this.value,
        disabledDate: this.getDisabledDateFunc(1),
        dateRender: this.getDateRenderFunc(1),
        showLunar: this.showLunar,
      };
    },
    endPanelOn() {
      return {
        select:
          this.endHeaderMode && this.endHeaderMode !== 'year'
            ? this.onEndHeaderPanelSelect
            : this.onPanelCellClick,
        cellMouseEnter: this.onPanelCellMouseEnter,
      };
    },
  },
  methods: {
    getShortcutValue(shortcut) {
      return getDayjsValue(
        normalizeRangeValue(
          isFunction(shortcut.value) ? shortcut.value() : shortcut.value
        ),
        shortcut.format || this.format
      );
    },
    getDisabledDateFunc(index) {
      return isFunction(this.disabledDate)
        ? (current) =>
            this.disabledDate(current, index === 0 ? 'start' : 'end') || false
        : undefined;
    },
    getDisabledTimeFunc(index) {
      return isFunction(this.disabledTime)
        ? (current) =>
            this.disabledTime(current, index === 0 ? 'start' : 'end') || false
        : undefined;
    },
    getDateRenderFunc(index) {
      return isFunction(this.dateRender)
        ? (props) => {
            const mergeProps = {
              ...props,
              type: index === 0 ? 'start' : 'end',
            };
            return this.dateRender(mergeProps);
          }
        : undefined;
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
    onPanelCellClick(date) {
      this.$emit('onCellClick', date);
    },

    onPanelCellMouseEnter(date) {
      this.$emit('onCellMouseEnter', date);
    },

    onConfirmBtnClick() {
      this.$emit('onConfirm');
    },

    onStartTimePickerSelect(time) {
      this.$emit('onTimePickerSelect', time, 'start');
    },

    onEndTimePickerSelect(time) {
      this.$emit('onTimePickerSelect', time, 'end');
    },

    onStartPanelHeaderLabelClick(type) {
      this.$emit('onStartHeaderLabelClick', type);
    },

    onEndPanelHeaderLabelClick(type) {
      this.$emit('onEndHeaderLabelClick', type);
    },

    onStartHeaderPanelSelect(date) {
      this.$emit('onStartHeaderSelect', date);
    },

    onEndHeaderPanelSelect(date) {
      this.$emit('onEndHeaderSelect', date);
    },
  },
};
</script>
