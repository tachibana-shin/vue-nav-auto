# vue-nav-auto
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nguyenthanh1995/vue-i18n-filters/blob/master/LICENSE)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

**Allows your navbar to be automatically hidden, just like Android.**


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

``` bash
npm install vue-nav-auto
```

``` bash
yarn add vue-nav-auto
```

or if you prefer CDN

``` html
<script type="text/javascript" src="https://unpkg.com/vue-nav-auto@latest/dist/vue-nav-auto.js"></script>
```

## Usage

### Global

``` JavaScript
import { use } from "vue"
import VueNavAuto from "vue-nav-auto"

use(VueNavAuto)

```

``` vue.js
<vue-nav-auto type="top" class="header">
   <!-- Content -->
</vue-nav-auto>

<style lang="scss" scoped>
   .header {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1024;
   }
</style>
```

### Private

``` vue.js
<vue-nav-auto type="top" class="header*>
   <!-- Content -->
</vue-nav-auto>
<style lang="scss" scoped>
   .header {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1024;
   }
</style> 
<script>
   import { VueNavAuto } from "vue-nav-auto"
   
   export default {
      components: { VueNavAuto }
   }
</script>
```

### Configuration

| Property | Type | Default | Description |
|:-|:-|:-|:-|
| tag | String | "div" | A tag name for component |
| type | String | "top" | will leave the nav bar at the "top" or "bottom" |
| offset-hidden | Number | 0 | this determines how much away the screen after hiding the navbar (px) |
| tracker | Any | window | This will be the object tracking navbar's scroll events like document, window ... |
| duration | String | "0.01s" | This is the effect smoothing time.  It is really not necessary but you should leave it to 10 seconds (0.01s). |
| multipler | Number | 1 | This is a very special option.  it will amplify, shrink or even reverse whether the navbar will be hidden when scrolling up or down. See the example to understand better. |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
