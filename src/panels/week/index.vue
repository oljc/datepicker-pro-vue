<template>
  <DatePanel
    v-bind="$attrs"
    mode="week"
    is-week
    :show-lunar="showLunar"
    :day-start-of-week="dayStartOfWeek"
    :is-same-time="isSameTime"
    @select="onSelect"
    @cellMouseEnter="onCellMouseEnter"
  />
</template>

<script>
import { methods } from '../../utils/date';
import DatePanel from '../date/index.vue';

export default {
  name: 'WeekPanel',
  components: {
    DatePanel,
  },
  props: {
    dayStartOfWeek: {
      type: Number,
      default: 0,
    },
    showLunar: {
      type: Boolean,
    },
  },
  methods: {
    isSameTime(current, target) {
      return methods.isSameWeek(current, target, this.dayStartOfWeek, 'zh-CN');
    },

    onSelect(value) {
      const startDateOfWeek = methods.startOf(value, 'week');
      this.$emit('select', startDateOfWeek);
    },
    onCellMouseEnter(value) {
      const startDateOfWeek = methods.startOf(value, 'week');
      this.$emit('cellCouseEnter', startDateOfWeek);
    },
  },
};
</script>
