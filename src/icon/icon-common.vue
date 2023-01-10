<template>
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    :class="prefixCls"
    :stroke-width="4"
    stroke-linecap="butt"
    stroke-linejoin="miter"
    v-html="icon[use]"
  ></svg>
</template>

<script>
import { getPrefixCls } from '../utils/config';

export default {
  name: 'IconCommon',
  props: ['use'],
  data() {
    return {
      prefixCls: getPrefixCls('icon'),
      icon: {
        calendar: `<path d="M7 22h34M14 5v8m20-8v8M8 41h32a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1Z"></path>`,
        circle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
        close: `<path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>`,
        clockCircle: `<path d="M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z"></path>`,
        doubleLeft: `<path d="M36.857 9.9 22.715 24.042l14.142 14.142M25.544 9.9 11.402 24.042l14.142 14.142"></path>`,
        doubleRight: `<path d="m11.143 38.1 14.142-14.142L11.143 9.816M22.456 38.1l14.142-14.142L22.456 9.816"></path>`,
        left: `<path d="M32 8.4 16.444 23.956 32 39.513"></path>`,
        right: `<path d="m16 39.513 15.556-15.557L16 8.4"></path>`,
      },
    };
  },
};
</script>
