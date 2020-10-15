export default {
   install(Vue) {
      Vue.component("vue-nav-auto", this.VueNavAuto)
   },
   VueNavAuto: {
      props: {
         tag: {
            type: String,
            default: "div"
         },
         offsetHidden: {
            type: Number,
            default: 0
         },
         multipler: {
            type: Number,
            default: 1
         },
         type: {
            type: String,
            default: "top",
            validator(value) {
               return value == "top" || value == "bottom"
            }
         },
         duration: {
            type: String,
            default: ".01s"
         },
         tracker: {
            default: () => window
         }
      },
      data() {
         return {
            defaults: {
               top: undefined,
               bottom: undefined
            },
            top: undefined,
            bottom: undefined
         }
      },
      methods: {
         getHeight() {
            return this.$el.offsetHeight
         },
         resetValueOffset() {
            switch (this.type.toLowerCase()) {
               case "top":
                  this.bottom = undefined
                  this.top = `${this.defaults.top}px`
                  break
               case "bottom":
                  this.top = undefined
                  this.bottom = `${this.defaults.bottom}px`
                  break
            }
         },
         resetValueDefault() { // update default pro
            const styles = window.getComputedStyle(this.$el)

            this.defaults.top = parseFloat(styles["top"]) || 0
            this.defaults.bottom = parseFloat(styles["bottom"]) || 0

            this.resetValueOffset()

         },
         update(newVal, oldVal) {
            const detail = (oldVal - newVal) * this.multipler
            const type = this.type.toLowerCase()

            let top = parseFloat(this[type]) + detail

            if (top < -(this.getHeight() + this.offsetHidden) && detail < 0) {
               top = -this.offsetHidden - this.getHeight()
            }
            if (top > this.defaults[type] && detail > 0) {
               top = this.defaults[type]
            }
            this[type] = `${top}px`
         },
         getOffsetTop(element) {
            let win
            if (element.window === element) {
               win = element
            } else if (element.nodeType === 9) {
               /* if is document */
               win = element.defaultView
            }
            return win ? win.pageYOffset : element.scrollTop
         },
         addEvent() {
            this.resetValueDefault()
            let offsetY = 0
            this.tracker.addEventListener("scroll", this.$options.onScroll = ({ target }) => {
               const pageYOffset = this.getOffsetTop(target)

               this.update(pageYOffset, offsetY)
               offsetY = pageYOffset
            })
         },
         removeEvent() {
            window.removeEventListener("scroll", this.$options.onScroll)
         }
      },
      watch: {
         type() {
            this.resetValueOffset()
            this.update(pageYOffset, pageYOffset)
         },
         tracker() {
            this.removeEvent()
            this.addEvent()
         }
      },
      computed: {
         transition() {
            return `${this.type} ${this.duration} ms`
         }
      },
      mounted() {
         this.addEvent()
      },
      destroyed() {
         this.removeEvent()
      },
      render(h) {
         return h(this.tag, {
            style: {
               top: this.top,
               bottom: this.bottom,
               transition: this.transition
            }
         }, this.$slots.default)
      }
   }
}