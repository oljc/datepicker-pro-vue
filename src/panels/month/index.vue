<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-inner`">
      <PanelHeader
        v-bind="{ ...headerOperations }"
        :prefix-cls="pickerPrefixCls"
        :title="headerTitle"
        mode="month"
        :value="headerValue"
        :onLabelClick="onHeaderLabelClick"
      />
      <PanelBody
        mode="month"
        :prefix-cls="pickerPrefixCls"
        :rows="rows"
        :value="value"
        :show-lunar="showLunar"
        :range-values="rangeValues"
        :disabled-date="disabledDate"
        :is-same-time="isSameTime"
        :date-render="dateRender"
        @cellClick="onCellClick"
        @cellMouseEnter="onCellMouseEnter"
      />
    </div>
  </div>
</template>

<script>
import { getPrefixCls } from '../../utils/config';
import { dayjs } from '../../utils/date';
import PanelHeader from '../header.vue';
import PanelBody from '../body.vue';

const CELL_COUNT = 12;
const ROW_COUNT = 4;
const COL_COUNT = 3;
const MONTH_LIST = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

export default {
  name: 'MonthPanel',
  components: {
    PanelHeader,
    PanelBody,
  },
  props: {
    headerValue: {
      type: Object,
      required: true,
    },
    headerOperations: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
    },
    disabledDate: {
      type: Function,
    },
    rangeValues: {
      type: Array,
    },
    dateRender: {
      type: Function,
    },
    onHeaderLabelClick: {
      type: Function,
    },
    showLunar: {
      type: Boolean,
    },
  },
  data() {
    return {
      pickerPrefixCls: getPrefixCls('picker'),
    };
  },
  computed: {
    prefixCls() {
      return getPrefixCls('panel-month');
    },
    headerTitle() {
      return this.headerValue.format('YYYY');
    },
    rows() {
      const year = this.headerValue.year();
      const flatData = this.newArray(CELL_COUNT).map((_, index) => ({
        label: MONTH_LIST[index],
        value: dayjs(`${year}-${index + 1}`, 'YYYY-M'),
      }));

      const rows = this.newArray(ROW_COUNT).map((_, index) =>
        flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT)
      );
      return rows;
    },
  },
  methods: {
    newArray(length) {
      return [...Array(length)];
    },
    onCellClick(cellData) {
      this.$emit('select', cellData.value);
    },
    onCellMouseEnter(cellData) {
      this.$emit('cellMouseEnter', cellData.value);
    },
    isSameTime(current, target) {
      return current.isSame(target, 'month');
    },
  },
};
</script>

<style></style>
