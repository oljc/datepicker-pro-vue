<template>
  <div :class="`${prefixCls}-week-list`">
    <div
      v-for="key in weekList"
      :key="key"
      :class="`${prefixCls}-week-list-item`"
      >{{ labelList[key] || '' }}</div
    >
  </div>
</template>

<script>
export default {
  name: 'PanelWeekList',
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    weekList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    labelList: ['日', '一', '二', '三', '四', '五', '六'],
  }),
};
</script>
