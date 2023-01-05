<template>
  <div>
    <div :class="prefixCls">
      <TimeColumn
        v-if="columns.includes('H') || columns.includes('h')"
        :value="selectedHour"
        :list="hours"
        :prefix-cls="prefixCls"
        :visible="visible"
        @select="
          (value) => {
            onSelect(value, 'hour');
          }
        "
      />
      <TimeColumn
        v-if="columns.includes('m')"
        :value="selectedMinute"
        :list="minutes"
        :prefix-cls="prefixCls"
        :visible="visible"
        @select="
          (value) => {
            onSelect(value, 'minute');
          }
        "
      />
      <TimeColumn
        v-if="columns.includes('s')"
        :value="selectedSecond"
        :list="seconds"
        :prefix-cls="prefixCls"
        :visible="visible"
        @select="
          (value) => {
            onSelect(value, 'second');
          }
        "
      />
      <TimeColumn
        v-if="computedUse12Hours"
        :value="selectedAmpm"
        :list="ampmList"
        :prefix-cls="prefixCls"
        :visible="visible"
        @select="
          (value) => {
            onSelect(value, 'ampm');
          }
        "
      />
    </div>
    <div
      v-if="$slots['extra-footer']"
      :class="`${prefixCls}-footer-extra-wrapper`"
    >
      <slot name="extra-footer"></slot>
    </div>
    <div v-if="!hideFooter" :class="`${prefixCls}-footer-btn-wrapper`">
      <Button v-if="!isRange" size="mini" @click="onSelectNow">此刻</Button>
      <Button
        type="primary"
        size="mini"
        :disabled="confirmBtnDisabled || !selectedValue"
        @click="onConfirm"
        >确定</Button
      >
    </div>
  </div>
</template>

<script>
import TimeColumn from './time-column.vue';
import Button from '../../common/button.vue';
import { getPrefixCls } from '../../utils/config';
import { isUndefined, isArray } from '../../utils/is';
import { dayjs, padStart } from '../../utils/date';
import { getColumnsFromFormat, isDisabledTime } from '../../utils/index';

export default {
  name: 'TimePickerPanel',
  components: {
    TimeColumn,
    Button,
  },
  props: {
    value: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
    format: {
      type: String,
      default: 'HH:mm:ss',
    },
    use12Hours: {
      type: Boolean,
    },
    step: {
      type: Object,
    },
    disabledHours: {
      type: Function,
    },
    disabledMinutes: {
      type: Function,
    },
    disabledSeconds: {
      type: Function,
    },
    hideDisabledOptions: {
      type: Boolean,
    },
    hideFooter: {
      type: Boolean,
    },
    isRange: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      prefixCls: getPrefixCls('timepicker'),
      columns: [],
      computedUse12Hours: false,
      computedFormat: undefined,
      selectedValue: this.value,
    };
  },
  watch: {
    visible(newVal) {
      if (!newVal) return;
      this.selectedValue = this.value;
    },
    value(newVal) {
      this.selectedValue = newVal;
    },
  },
  computed: {
    selectedHour() {
      const _hour = this.selectedValue?.hour();
      if (isUndefined(_hour) || !this.computedUse12Hours) return _hour;
      // 12小时制
      if (_hour > 12) return _hour - 12;
      if (_hour === 0) return 12;
      return _hour;
    },
    selectedMinute() {
      return this.selectedValue?.minute();
    },
    selectedSecond() {
      return this.selectedValue?.second();
    },
    selectedAmpm() {
      const _hour = this.selectedValue?.hour();
      return !isUndefined(_hour) && _hour >= 12 ? 'pm' : 'am';
    },
    // 小时
    hours() {
      const { hour: hourStep = 1 } = this.step || {};
      const disabledList = (this.disabledHours && this.disabledHours()) || [];
      let list = [];
      for (let i = 0; i < (this.computedUse12Hours ? 12 : 24); i += hourStep) {
        list.push(i);
      }
      if (this.computedUse12Hours) {
        list[0] = 12;
      }
      if (this.hideDisabledOptions && disabledList.length) {
        list = list.filter((h) => disabledList.indexOf(h) < 0);
      }
      return list.map((h) => ({
        label: padStart(h, 2, '0'),
        value: h,
        selected: this.selectedHour === h,
        disabled: this.disabled || disabledList.includes(h),
      }));
    },
    // 分钟
    minutes() {
      const { minute: minuteStep = 1 } = this.step || {};
      const disabledList =
        (this.disabledMinutes && this.disabledMinutes(this.selectedHour)) || [];
      let list = [];
      for (let i = 0; i < 60; i += minuteStep) {
        list.push(i);
      }
      if (this.hideDisabledOptions && disabledList.length) {
        list = list.filter((m) => disabledList.indexOf(m) < 0);
      }
      return list.map((m) => ({
        label: padStart(m, 2, '0'),
        value: m,
        selected: this.selectedMinute === m,
        disabled: this.disabled || disabledList.includes(m),
      }));
    },
    // 秒
    seconds() {
      const { second: secondStep = 1 } = this.step || {};
      const disabledList =
        (this.disabledSeconds &&
          this.disabledSeconds(this.selectedHour, this.selectedMinute)) ||
        [];
      let list = [];
      for (let i = 0; i < 60; i += secondStep) {
        list.push(i);
      }
      if (this.hideDisabledOptions && disabledList.length) {
        list = list.filter((s) => disabledList.indexOf(s) < 0);
      }
      return list.map((s) => ({
        label: padStart(s, 2, '0'),
        value: s,
        selected: this.selectedSecond === s,
        disabled: this.disabled || disabledList.includes(s),
      }));
    },
    ampmList() {
      const AMPM = ['am', 'pm'];
      const isUpperCase = getColumnsFromFormat(
        this.computedFormat
      ).list.includes('A');
      return AMPM.map((a) => ({
        label: isUpperCase ? a.toUpperCase() : a,
        value: a,
        selected: this.selectedAmpm === a,
        disabled: this.disabled,
      }));
    },
    confirmBtnDisabled() {
      const value = this.selectedValue;
      return isArray(value)
        ? value.some((i) => this.isDisabled(i))
        : this.isDisabled(value);
    },
  },
  created() {
    const configFromFormat = getColumnsFromFormat(this.useformat());
    this.columns = configFromFormat.list;
    this.computedUse12Hours = !!(
      this.use12Hours || configFromFormat.use12Hours
    );
    this.computedFormat = this.useformat();
  },
  methods: {
    useformat() {
      let res = this.format || undefined;
      if (!res || !getColumnsFromFormat(res).list.length) {
        res = this.use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
      }
      return res;
    },
    isDisabled(value) {
      return isDisabledTime(value, {
        disabledHours: this.disabledHours,
        disabledMinutes: this.disabledMinutes,
        disabledSeconds: this.disabledSeconds,
      });
    },
    emitConfirm(value) {
      if (isUndefined(value)) return;
      this.emit('confirm', value);
    },
    emitSelect(value) {
      this.selectedValue = value;
      this.$emit('select', value);
    },
    // 选中谁就更新谁
    onSelect(value, type = 'hour') {
      let newValue;
      const hour = this.selectedHour || '00';
      const minute = this.selectedMinute || '00';
      const second = this.selectedSecond || '00';
      const ampm = this.selectedAmpm || 'am';

      switch (type) {
        case 'hour':
          newValue = `${value}:${minute}:${second}`;
          break;
        case 'minute':
          newValue = `${hour}:${value}:${second}`;
          break;
        case 'second':
          newValue = `${hour}:${minute}:${value}`;
          break;
        case 'ampm':
          newValue = `${hour}:${minute}:${second} ${value}`;
          break;
        default:
          newValue = '00:00:00';
      }

      let valueFormat = 'HH:mm:ss';
      if (this.computedUse12Hours) {
        valueFormat = 'HH:mm:ss a';
        if (type !== 'ampm') {
          newValue = `${newValue} ${ampm}`;
        }
      }
      newValue = dayjs(newValue, valueFormat);
      this.emitSelect(newValue);
    },
    onSelectNow() {
      const newValue = dayjs(new Date());
      this.emitSelect(newValue);
    },
    onConfirm() {
      this.emitConfirm(this.selectedValue);
    },
  },
};
</script>
