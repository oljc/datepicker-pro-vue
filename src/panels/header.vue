<template>
  <div :class="`${prefixCls}-header`">
    <div :class="getIconClassName(showSuperPrev)" @click="onSuperPrev">
      <template v-if="showSuperPrev">
        <IconCommon use="doubleLeft" />
      </template>
    </div>
    <div :class="getIconClassName(showPrev)" @click="() => onPrev && onPrev()">
      <template v-if="showPrev">
        <IconCommon use="left" />
      </template>
    </div>
    <div :class="`${prefixCls}-header-title`">
      <template v-if="onLabelClick && (year || month)">
        <span
          v-if="year"
          :class="`${prefixCls}-header-label`"
          @click="() => onLabelClick && onLabelClick('year')"
          >{{ year }}</span
        >
        <span v-if="year && month">-</span>
        <span
          v-if="month"
          :class="`${prefixCls}-header-label`"
          @click="() => onLabelClick && onLabelClick('month')"
          >{{ month }}</span
        >
      </template>
      <template v-else>{{ title }}</template>
    </div>
    <div :class="getIconClassName(showNext)" @click="() => onNext && onNext()">
      <template v-if="showNext">
        <IconCommon use="right" />
      </template>
    </div>
    <div :class="getIconClassName(showSuperNext)" @click="onSuperNext">
      <template v-if="showSuperNext">
        <IconCommon use="doubleRight" />
      </template>
    </div>
  </div>
</template>

<script>
import { isFunction } from '../utils/is';
import IconCommon from '../icon/icon-common.vue';

export default {
  name: 'PanelHeader',
  components: {
    IconCommon,
  },
  props: {
    prefixCls: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: 'date',
    },
    value: {
      type: Object,
    },
    onPrev: {
      type: Function,
    },
    onSuperPrev: {
      type: Function,
    },
    onNext: {
      type: Function,
    },
    onSuperNext: {
      type: Function,
    },
    onLabelClick: {
      type: Function,
    },
  },
  computed: {
    showPrev() {
      return isFunction(this.onPrev);
    },
    showSuperPrev() {
      return isFunction(this.onSuperPrev);
    },
    showNext() {
      return isFunction(this.onNext);
    },
    showSuperNext() {
      return isFunction(this.onSuperNext);
    },
    year() {
      return ['date', 'quarter', 'month', 'week'].includes(this.mode) &&
        this.value
        ? this.value.format('YYYY')
        : '';
    },
    month() {
      return ['date', 'week'].includes(this.mode) && this.value
        ? this.value.format('MM')
        : '';
    },
  },
  methods: {
    getIconClassName(show) {
      return [
        `${this.prefixCls}-header-icon`,
        {
          [`${this.prefixCls}-header-icon-hidden`]: !show,
        },
      ];
    },
  },
};
</script>
