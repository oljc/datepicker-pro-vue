<template>
  <div :class="classNames">
    <div v-if="showDateView" :class="`${prefixCls}-inner`">
      <PanelHeader
        v-bind="{ ...headerOperations }"
        :prefix-cls="pickerPrefixCls"
        :title="headerTitle"
        :mode="mode"
        :value="headerValue"
        :on-label-click="onHeaderLabelClick"
      />
      <PanelWeekList :prefix-cls="pickerPrefixCls" :week-list="weekList" />
      <PanelBody
        :mode="mode"
        :prefix-cls="pickerPrefixCls"
        :rows="rows"
        :value="isRange ? undefined : value"
        :range-values="rangeValues"
        :disabled-date="disabledDate"
        :show-lunar="showLunar"
        :is-same-time="mergedIsSameTime"
        :date-render="dateRender"
        @cellClick="onCellClick"
        @cellMouseEnter="onCellMouseEnter"
      />
    </div>
    <div v-if="showTimeView" :class="timeClassName">
      <header :class="`${prefixCls}-timepicker-title`">选择时间</header>
      <TimePanel
        v-bind="{
          ...timePickerProps,
          ...disabledTimeProps,
        }"
        hide-footer
        :value="value || isRange ? timePickerValue : undefined"
        :disabled="disabled"
        @select="onTimePanelSelect"
      />
    </div>
    <div v-if="showViewTabs" :class="`${prefixCls}-footer`">
      <div :class="`${prefixCls}-view-tabs`">
        <div
          :class="[
            `${prefixCls}-view-tab-pane`,
            { [`${prefixCls}-view-tab-pane-active`]: showDateView },
          ]"
          @click="() => changeViewTo('date')"
        >
          <IconCommon use="calendar" />
          <span :class="`${prefixCls}-view-tab-pane-text`">
            {{ footerValue && footerValue.format('YYYY-MM-DD') }}
          </span>
        </div>
        <div
          :class="[
            `${prefixCls}-view-tab-pane`,
            { [`${prefixCls}-view-tab-pane-active`]: showTimeView },
          ]"
          @click="() => changeViewTo('time')"
        >
          <IconCommon use="clockCircle" />
          <span :class="`${prefixCls}-view-tab-pane-text`">
            {{ timePickerValue && timePickerValue.format('HH:mm:ss') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrefixCls } from '../../utils/config';
import { getDateValue, getNow, methods } from '../../utils/date';
import { isUndefined } from '../../utils/is';

import PanelHeader from '../header.vue';
import PanelBody from '../body.vue';
import PanelWeekList from '../week-list.vue';
import TimePanel from '../time-picker/panel.vue';
import IconCommon from '../../icon/icon-common.vue';

const ROW_COUNT = 6;
const COL_COUNT = 7;
const CELL_COUNT = ROW_COUNT * COL_COUNT;

function getCellData(time) {
  return {
    label: time.date(),
    value: time,
  };
}
export default {
  name: 'DatePanel',
  components: {
    PanelHeader,
    PanelBody,
    PanelWeekList,
    TimePanel,
    IconCommon,
  },
  props: {
    isRange: {
      type: Boolean,
    },
    value: {
      type: Object,
    },
    rangeValues: {
      type: Array,
    },
    headerValue: {
      type: Object,
      required: true,
    },
    footerValue: {
      type: Object,
    },
    timePickerValue: {
      type: Object,
    },
    headerOperations: {
      type: Object,
      default: () => ({}),
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
    isSameTime: {
      type: Function,
    },
    mode: {
      type: String,
      default: 'date',
    },
    showTime: {
      type: Boolean,
    },
    showLunar: {
      type: Boolean,
    },
    timePickerProps: {
      type: Object,
    },
    currentView: {
      type: String,
    },
    dateRender: {
      type: Function,
    },
    disabled: {
      type: Boolean,
    },
    onHeaderLabelClick: {
      type: Function,
    },
  },
  data() {
    return {
      pickerPrefixCls: getPrefixCls('picker'),
      localCurrentView: !isUndefined(this.currentView)
        ? this.currentView
        : 'date',
    };
  },
  watch: {
    currentView(newVal) {
      if (isUndefined(newVal)) {
        this.localValue = undefined;
      }
    },
  },
  computed: {
    isWeek() {
      return this.mode === 'week';
    },
    prefixCls() {
      return getPrefixCls(this.mode === 'week' ? 'panel-week' : 'panel-date');
    },
    showViewTabs() {
      return this.showTime && this.isRange;
    },
    showDateView() {
      return (
        !this.showTime || !this.showViewTabs || this.localCurrentView === 'date'
      );
    },
    showTimeView() {
      return (
        this.showTime &&
        (!this.showViewTabs || this.localCurrentView === 'time')
      );
    },
    classNames() {
      return [
        this.prefixCls,
        {
          [`${this.prefixCls}-with-view-tabs`]: this.showViewTabs,
        },
      ];
    },
    timeClassName() {
      return [
        `${this.prefixCls}-timepicker`,
        {
          [`${this.prefixCls}-lunar`]: this.showLunar,
        },
      ];
    },
    headerTitle() {
      return this.headerValue.format('YYYY-MM');
    },
    disabledTimeProps() {
      return (
        (this.showTime &&
          this.disabledTime &&
          this.disabledTime(getDateValue(this.footerValue || getNow()))) ||
        {}
      );
    },
    weekList1() {
      const list = [0, 1, 2, 3, 4, 5, 6];
      const index = Math.max(this.dayStartOfWeek % 7, 0);
      return [...list.slice(index), ...list.slice(0, index)];
    },
    weekList() {
      return this.isWeek ? [-1, ...this.weekList1] : this.weekList1;
    },
    rows() {
      const startDate = methods.startOf(this.headerValue, 'month');
      const startDay = startDate.day();
      const days = startDate.daysInMonth();
      const startIndex = this.weekList1.indexOf(startDay);
      const flatData = this.newArray(CELL_COUNT);

      for (let i = 0; i < flatData.length; i++) {
        const cellData = getCellData(
          methods.add(startDate, i - startIndex, 'day')
        );
        flatData[i] = {
          ...cellData,
          isPrev: i < startIndex,
          isNext: i > startIndex + days - 1,
        };
      }

      const rows = this.newArray(ROW_COUNT).map((_, index) => {
        const row = flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT);
        if (this.isWeek) {
          // 取第一个作为周 cell 的值
          const valueOfWeek = row[0].value;
          row.unshift({
            label: valueOfWeek.week(),
            value: valueOfWeek,
          });
        }
        return row;
      });
      return rows;
    },
    mergedIsSameTime() {
      return (
        this.isSameTime ||
        ((current, target) => {
          return current.isSame(target, 'day');
        })
      );
    },
  },
  methods: {
    newArray(length) {
      return [...Array(length)];
    },
    onCellClick(cellData) {
      this.$emit('select', cellData.value);
    },
    onTimePanelSelect(time) {
      this.$emit('timePickerSelect', time);
    },
    onCellMouseEnter(cellData) {
      this.$emit('cellMouseEnter', cellData.value);
    },
    changeViewTo(newView) {
      this.$emit('currentViewChange', newView);
      this.$emit('update:currentView', newView);
      this.localCurrentView = newView;
    },
  },
};
</script>
