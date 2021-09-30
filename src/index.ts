import {
  App,
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  Plugin,
  PropType,
  reactive,
  ref,
  useSlots,
  watch,
} from "vue";

export const VueNavAuto = defineComponent({
  props: {
    tag: {
      type: String,
      default: "div",
    },
    offsetHidden: {
      type: Number,
      default: 0,
    },
    slipCoff: {
      type: Number,
      default: 1,
    },
    type: {
      type: String as PropType<"top" | "bottom">,
      default: "top",
    },
    duration: {
      type: String,
      default: "0s",
    },
    tracker: {
      type: [Window, Element] as PropType<Window | Element>,
      default: () => window,
    },
  },
  setup(props) {
    const slots = useSlots();

    const defaults = reactive<{
      // eslint-disable-next-line functional/prefer-readonly-type
      top: number | null;
      // eslint-disable-next-line functional/prefer-readonly-type
      bottom: number | null;
    }>({
      top: null,
      bottom: null,
    });
    const top = ref<number | null>(null);
    const bottom = ref<number | null>(null);

    const el = ref<HTMLElement | null>(null);

    watch(
      () => props.type,
      () => {
        resetValueOffset();
        update(scrollY, scrollY);
      }
    );
    watch(
      () => props.tracker,
      () => {
        removeEvent();
        addEvent();
      }
    );

    const transition = computed<string>(
      () => `${props.type} ${props.duration}`
    );

    onMounted(() => void addEvent());
    onBeforeUnmount(() => void removeEvent());

    function resetValueOffset() {
      switch (props.type) {
        case "top":
          // eslint-disable-next-line functional/immutable-data
          bottom.value = null;
          // eslint-disable-next-line functional/immutable-data
          top.value = defaults.top;
          break;
        case "bottom":
          // eslint-disable-next-line functional/immutable-data
          top.value = null;
          // eslint-disable-next-line functional/immutable-data
          bottom.value = defaults.bottom;
          break;
      }
    }
    function resetValueDefault() {
      // update default pro
      const styles = window.getComputedStyle(el.value as HTMLElement);

      // eslint-disable-next-line functional/immutable-data
      defaults.top = parseFloat(styles["top"]) || 0;
      // eslint-disable-next-line functional/immutable-data
      defaults.bottom = parseFloat(styles["bottom"]) || 0;

      resetValueOffset();
    }
    function getHeight(): number {
      return el.value?.offsetHeight || 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isWindow(el: any): el is Window {
      return el?.window === el;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isDocument(el: any): el is typeof document {
      return el?.nodeType === 9;
    }
    function getOffsetTop(
      element: typeof window | typeof document | HTMLElement
    ): number {
      // eslint-disable-next-line functional/no-let
      let win;
      if (isWindow(element)) {
        win = element;
      } else if (isDocument(element)) {
        /* if is document */
        win = element.defaultView;
      }
      return win ? win.pageYOffset : (element as HTMLElement).scrollTop;
    }
    function update(newVal: number, oldVal: number) {
      const detail = (oldVal - newVal) * props.slipCoff;
      const type = props.type;

      // eslint-disable-next-line functional/no-let
      let valueNow = (type === "top" ? top.value : bottom.value) || 0 + detail;

      if (valueNow < -(getHeight() + props.offsetHidden) && detail < 0) {
        valueNow = -props.offsetHidden - getHeight();
      }
      if (valueNow > (defaults[type] || 0) && detail > 0) {
        valueNow = defaults[type] || 0;
      }

      if (type === "top") {
        // eslint-disable-next-line functional/immutable-data
        top.value = valueNow;
      } else {
        // eslint-disable-next-line functional/immutable-data
        bottom.value = valueNow;
      }
    }

    // eslint-disable-next-line functional/no-let
    let offsetY = 0;
    function onScroll({ target }: Event) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageYOffset = getOffsetTop(target as any);

      update(pageYOffset, offsetY);
      offsetY = pageYOffset;
    }
    function onResize() {
      resetValueDefault();
    }
    function addEvent() {
      resetValueDefault();
      props.tracker.addEventListener("scroll", onScroll);
      props.tracker.addEventListener("resize", onResize);
    }
    function removeEvent() {
      props.tracker.removeEventListener("scroll", onScroll);
      props.tracker.removeEventListener("resize", onResize);
    }

    return () =>
      h(
        props.tag,
        {
          ref: el,
          style: {
            position: "fixed",
            zIndex: 1204,
            top: top.value === null ? undefined : `${top.value}px`,
            bottom: bottom.value === null ? undefined : `${bottom.value}px`,
            transition: transition.value,
          },
        },
        [
          slots.default?.({
            top: top.value,
            bottom: bottom.value,
            defaults: defaults,
          }),
        ]
      );
  },
});

export default {
  install: (app: App) => {
    app.component("vue-nav-auto", defineComponent);
  },
} as Plugin;
