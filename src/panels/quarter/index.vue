<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-inner`">
      <PanelHeader
        mode="quarter"
        v-bind="{ ...headerOperations }"
        :prefix-cls="pickerPrefixCls"
        :title="headerTitle"
        :value="headerValue"
        :onLabelClick="onHeaderLabelClick"
      />
      <PanelBody
        mode="quarter"
        :prefix-cls="pickerPrefixCls"
        :rows="rows"
        :value="value"
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
import { dayjs, padStart } from '../../utils/date';

import PanelHeader from '../header.vue';
import PanelBody from '../body.vue';

export default {
  name: 'QuarterPanel',
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
  },
  data() {
    return {
      pickerPrefixCls: getPrefixCls('picker'),
    };
  },
  computed: {
    prefixCls() {
      return getPrefixCls('panel-quarter');
    },
    headerTitle() {
      return this.headerValue.format('YYYY');
    },
    rows() {
      const year = this.headerValue.year();
      return [
        [1, 2, 3, 4].map((q) => ({
          label: `Q${q}`,
          value: dayjs(`${year}-${padStart((q - 1) * 3 + 1, 2, '0')}-01`),
        })),
      ];
    },
  },
  methods: {
    isSameTime(current, target) {
      return (
        current.isSame(target, 'month') ||
        (current.isSame(target, 'year') &&
          Math.floor(current.month() / 3) === Math.floor(target.month() / 3))
      );
    },
    onCellClick(cellData) {
      console.log('收到', cellData);
      this.$emit('select', cellData.value);
    },
    onCellMouseEnter(cellData) {
      this.$emit('cellMouseEnter', cellData.value);
    },
  },
};
</script>
