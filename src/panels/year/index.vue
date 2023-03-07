<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-inner`">
      <PanelHeader
        v-bind="{ ...headerOperations }"
        :prefix-cls="pickerPrefixCls"
        :title="headerTitle"
      />
      <PanelBody
        mode="year"
        :prefix-cls="pickerPrefixCls"
        :rows="rows"
        :value="value"
        :range-values="rangeValues"
        :disabled-date="disabledDate"
        :show-lunar="showLunar"
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

const ROW_COUNT = 4;
const COL_COUNT = 3;
const CELL_COUNT = ROW_COUNT * COL_COUNT;
const SPAN = 10;

export default {
  name: 'YearPanel',
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
      isSameTime: (current, target) => current.isSame(target, 'year'),
    };
  },
  computed: {
    prefixCls() {
      return getPrefixCls('panel-year');
    },
    rows() {
      const startYear = Math.floor(this.headerValue.year() / SPAN) * SPAN - 1;
      const flatData = this.newArray(CELL_COUNT).map((_, index) => ({
        label: startYear + index,
        value: dayjs(`${startYear + index}`, 'YYYY'),
        isPrev: index < 1,
        isNext: index > SPAN,
      }));
      const rows = this.newArray(ROW_COUNT).map((_, index) =>
        flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT)
      );
      return rows;
    },
    headerTitle() {
      return `${this.rows[0][1].label}-${
        this.rows[ROW_COUNT - 1][COL_COUNT - 1].label
      }`;
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
  },
};
</script>
