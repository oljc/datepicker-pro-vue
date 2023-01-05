<template>
  <div :class="`${prefixCls}-body`">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      :class="[
        `${prefixCls}-row`,
        {
          [`${prefixCls}-row-week`]: isWeek,
        },
      ]"
    >
      <template v-for="(cell, colIndex) in row">
        <template v-if="isWeek && colIndex === 0">
          <div
            :key="colIndex"
            :class="[`${prefixCls}-cell`, `${prefixCls}-cell-week`]"
          >
            <div :class="`${prefixCls}-date`">
              <div :class="`${prefixCls}-date-value`">{{ cell.label }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            :key="colIndex"
            :class="getCellClassName(cell)"
            @mouseenter="
              () => {
                onCellMouseEnter(cell);
              }
            "
            @mouseleave="
              () => {
                onCellMouseLeave(cell);
              }
            "
            @click="
              () => {
                onCellClick(cell);
              }
            "
          >
            <RenderFunction
              v-if="dateRender"
              :render-func="dateRender"
              :date="getDateValue(cell.value)"
            />
            <div v-else :class="`${prefixCls}-date`">
              <div :class="`${prefixCls}-date-value`">
                {{ cell.label }}
              </div>
              <div :class="`${prefixCls}-date-lunar`" v-if="showLunar">{{
                getLunar(cell.value)
              }}</div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { getDateValue, getNow, getSortedDayjsArray } from '../utils/date';
import { isDayjs } from '../utils/is';
import LunarCalendar from '../utils/calendarCN';
import RenderFunction from '../common/render-function.vue';

export default {
  name: 'PanelBody',
  components: {
    RenderFunction,
  },
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    rows: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
    },
    disabledDate: {
      type: Function,
    },
    isSameTime: {
      type: Function,
      required: true,
    },
    mode: {
      type: String,
    },
    rangeValues: {
      type: Array,
    },
    dateRender: {
      type: Function,
    },
    showLunar: {
      type: Boolean,
    },
  },
  computed: {
    isWeek() {
      return this.mode === 'week';
    },
    sortedRangeValues() {
      return this.rangeValues && this.rangeValues.every(isDayjs)
        ? getSortedDayjsArray(this.rangeValues)
        : this.rangeValues;
    },
    rangeStart() {
      return this.sortedRangeValues?.[0];
    },
    rangeEnd() {
      return this.sortedRangeValues?.[1];
    },
  },
  methods: {
    getLunar(date) {
      if (!this.showLunar) return '';
      const year = date.format('YYYY');
      const month = date.format('MM');
      const day = date.format('DD');
      const lunarCalendar = LunarCalendar.solarToLunar(year, month, day);
      if (this.mode === 'date' || this.mode === 'week') {
        return lunarCalendar?.lunarFestival || lunarCalendar?.lunarDayName;
      }
      if (this.mode === 'year') {
        return lunarCalendar?.GanZhiYear;
      }
      if (this.mode === 'month') {
        return lunarCalendar?.GanZhiMonth || lunarCalendar?.lunarMonthName;
      }
      return '';
    },
    isCellDisabled(cellData) {
      if (typeof this.disabledDate === 'function' && this.disabledDate) {
        return this.disabledDate(getDateValue(cellData.value));
      }
      return false;
    },
    getCellClassName(cellData) {
      const disabled = this.isCellDisabled(cellData);
      return this.useCellClassName(cellData, disabled);
    },
    useCellClassName(cellData, disabled) {
      const isInView = !cellData.isPrev && !cellData.isNext;
      const isToday = this.isSameTime(cellData.value, getNow());
      const isSelected =
        this.value && this.isSameTime(cellData.value, this.value);
      const isRangeStart =
        isInView &&
        this.rangeStart &&
        this.isSameTime(cellData.value, this.rangeStart);
      const isRangeEnd =
        isInView &&
        this.rangeEnd &&
        this.isSameTime(cellData.value, this.rangeEnd);
      const isInRange =
        isInView &&
        this.rangeStart &&
        this.rangeEnd &&
        (isRangeStart ||
          isRangeEnd ||
          cellData.value.isBetween(this.rangeStart, this.rangeEnd, null, '[]'));
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-cell-in-view`]: isInView,
          [`${this.prefixCls}-cell-today`]: isToday,
          [`${this.prefixCls}-cell-selected`]: isSelected,
          [`${this.prefixCls}-cell-range-start`]: isRangeStart,
          [`${this.prefixCls}-cell-range-end`]: isRangeEnd,
          [`${this.prefixCls}-cell-in-range`]: isInRange,
          [`${this.prefixCls}-cell-lunar`]: this.showLunar,
          [`${this.prefixCls}-cell-disabled`]: disabled,
        },
        cellData.classNames,
      ];
    },
    onCellClick(cellData) {
      const disabled = this.isCellDisabled(cellData);
      if (disabled) return;
      this.$emit('cellClick', cellData);
    },
    onCellMouseEnter(cellData) {
      const disabled = this.isCellDisabled(cellData);
      if (disabled) return;
      this.$emit('cellMouseEnter', cellData);
    },
    onCellMouseLeave(cellData) {
      const disabled = this.isCellDisabled(cellData);
      if (disabled) return;
      this.$emit('cellMouseEnter', cellData);
    },
  },
};
</script>
