<template>
  <component :is="tag">
    <slot></slot>
    <div
      ref="content"
      :class="[`${prefixCls}-popup`, `${prefixCls}-position-${position}`]"
      @after-leave="doDestroy"
    >
      <transition
        :name="transition"
        :enter-active-class="enterActiveClass"
        :leave-active-class="leaveActiveClass"
      >
        <div
          :class="`${prefixCls}-popup-wrapper`"
          v-show="!disabled && showPopper"
        >
          <div :class="[`${prefixCls}-content`]">
            <slot name="content"></slot>
          </div>
          <div
            ref="arrowRef"
            v-if="showArrow"
            :class="[`${prefixCls}-arrow`]"
          />
        </div>
      </transition>
    </div>
  </component>
</template>

<script>
import Popper from 'popper.js';
import { getPrefixCls } from '../utils/config';

function on(element, event, handler, capture = false) {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, capture)
      : element.attachEvent(`on${event}`, handler);
  }
}

function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent(`on${event}`, handler);
  }
}

export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    popupVisible: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: String,
      default: 'hover',
      validator: (value) =>
        ['clickToOpen', 'click', 'hover', 'focus'].indexOf(value) > -1,
    },
    position: {
      type: String,
      default: 'bottom',
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: [String, Number],
      default: 0,
    },
    mouseEnterDelay: {
      type: Number,
      default: 100,
    },
    mouseLeaveDelay: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 持续展示
    forceShow: {
      type: Boolean,
      default: false,
    },
    // 是否挂载在body下
    renderToBody: {
      type: Boolean,
      default: true,
    },
    // 是否卸载节点
    unmountOnClose: {
      type: Boolean,
      default: true,
    },
    transition: {
      type: String,
      default: '',
    },
    enterActiveClass: String,
    leaveActiveClass: String,
    boundariesSelector: String,
    // 弹出挂载容器
    popupContainer: {
      type: [String, Object],
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    preventDefault: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    rootClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      prefixCls: getPrefixCls('trigger') || 'ljc',
      referenceElm: null,
      popperJS: null,
      showPopper: false,
      currentPlacement: '',
      popperOptions: {
        placement: this.position,
        modifiers: { offset: { offset: `0,${this.offset}px` } },
        computeStyle: {
          gpuAcceleration: false,
        },
      },
    };
  },

  watch: {
    showPopper(value) {
      if (value) {
        this.$emit('show', this);
        // eslint-disable-next-line no-unused-expressions
        this.popperJS ? this.popperJS.enableEventListeners() : null;
        this.updatePopper();
      } else {
        // eslint-disable-next-line no-unused-expressions
        this.popperJS ? this.popperJS.disableEventListeners() : null;
        // eslint-disable-next-line no-unused-expressions
        this.unmountOnClose ? this.doDestroy() : null;
        this.$emit('hide', this);
      }
      this.$emit('update:popupVisible', value);
      this.$emit('popupVisibleChange', value);
    },
    // 独立外部-统一由内部处理
    popupVisible(val) {
      this.showPopper = val;
    },

    forceShow: {
      handler(value) {
        this[value ? 'doShow' : 'doClose']();
      },
      immediate: true,
    },

    disabled(value) {
      this.showPopper = !value;
    },
  },

  created() {
    this.appendedArrow = false;
    this.appendedToBody = false;
    this.popperOptions = Object.assign(this.popperOptions, this.options);
  },

  mounted() {
    this.referenceElm = this.$slots.default[0].elm;
    this.popper =
      this.popupContainer || this.$refs.content || this.$slots.content[0].elm;
    switch (this.trigger) {
      case 'clickToOpen':
        on(this.referenceElm, 'click', this.doShow);
        on(document, 'click', this.handleDocumentClick, true);
        on(document, 'touchstart', this.handleDocumentClick);
        break;
      case 'click':
        on(this.referenceElm, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick, true);
        on(document, 'touchstart', this.handleDocumentClick);
        break;
      case 'hover':
        on(this.referenceElm, 'mouseover', this.onMouseOver);
        on(this.popper, 'mouseover', this.onMouseOver);
        on(this.referenceElm, 'mouseout', this.onMouseOut);
        on(this.popper, 'mouseout', this.onMouseOut);
        break;
      case 'focus':
        on(this.referenceElm, 'focus', this.onMouseOver);
        on(this.popper, 'focus', this.onMouseOver);
        on(this.referenceElm, 'blur', this.onMouseOut);
        on(this.popper, 'blur', this.onMouseOut);
        break;
      default:
        break;
    }
  },

  methods: {
    doToggle(event) {
      this.stopPropagation && event.stopPropagation();
      this.preventDefault && event.preventDefault();
      if (!this.forceShow) {
        this.showPopper = !this.showPopper;
      }
    },

    doShow() {
      this.showPopper = true;
    },

    doClose() {
      this.showPopper = false;
    },

    doDestroy() {
      if (this.showPopper) {
        return;
      }

      if (this.popperJS) {
        this.popperJS.destroy();
        this.popperJS = null;
      }

      if (this.appendedToBody) {
        this.appendedToBody = false;
        document.body.removeChild(this.popper);
      }
    },

    createPopper() {
      this.$nextTick(() => {
        if (this.renderToBody && !this.appendedToBody) {
          this.appendedToBody = true;
          document.body.appendChild(this.popper);
        }

        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroy();
        }

        if (this.boundariesSelector) {
          const boundariesElement = document.querySelector(
            this.boundariesSelector
          );

          if (boundariesElement) {
            // eslint-disable-next-line prefer-object-spread
            this.popperOptions.modifiers = Object.assign(
              {},
              this.popperOptions.modifiers
            );
            // eslint-disable-next-line prefer-object-spread
            this.popperOptions.modifiers.preventOverflow = Object.assign(
              {},
              this.popperOptions.modifiers.preventOverflow
            );
            this.popperOptions.modifiers.preventOverflow.boundariesElement =
              boundariesElement;
          }
        }

        this.popperOptions.onCreate = () => {
          this.$emit('created', this);
          this.$nextTick(this.updatePopper);
        };

        this.popperJS = new Popper(
          this.referenceElm,
          this.popper,
          this.popperOptions
        );
      });
    },

    destroyPopper() {
      off(this.referenceElm, 'click', this.doToggle);
      off(this.referenceElm, 'mouseup', this.doClose);
      off(this.referenceElm, 'mousedown', this.doShow);
      off(this.referenceElm, 'focus', this.doShow);
      off(this.referenceElm, 'blur', this.doClose);
      off(this.referenceElm, 'mouseout', this.onMouseOut);
      off(this.referenceElm, 'mouseover', this.onMouseOver);
      off(document, 'click', this.handleDocumentClick);
      this.showPopper = false;
      this.doDestroy();
    },

    updatePopper() {
      this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
    },

    onMouseOver() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = true;
      }, this.mouseEnterDelay);
    },

    onMouseOut() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = false;
      }, this.mouseLeaveDelay);
    },

    handleDocumentClick(e) {
      if (
        !this.$el ||
        !this.referenceElm ||
        this.elementContains(this.$el, e.target) ||
        this.elementContains(this.referenceElm, e.target) ||
        !this.popper ||
        this.elementContains(this.popper, e.target)
      ) {
        return;
      }

      this.$emit('documentClick', this);

      if (this.forceShow) {
        return;
      }
      this.showPopper = false;
    },

    elementContains(elm, otherElm) {
      if (typeof elm.contains === 'function') {
        return elm.contains(otherElm);
      }

      return false;
    },
  },

  destroyed() {
    this.destroyPopper();
  },
};
</script>
