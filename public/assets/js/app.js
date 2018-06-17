import VueRouter from 'vue-router';
import PageLanding from 'vue/pages/Landing';
import PageGameList from 'vue/pages/GameList';
import PageGameActive from 'vue/pages/GameActive';
import PageNotFound from 'vue/pages/NotFound';
import { VueEvent, SocketEvent } from 'vue/utils/event';
import Cookies from 'js-cookie';
import axios from 'axios';

var router = new VueRouter({
    //mode: 'history',
    routes: [
        { path: '/', component: PageLanding },
        { path: '/games', component: PageGameList },
        { path: '/games/:gameId', component: PageGameActive },
        { path: '*', component: PageNotFound }
    ]
});
// Make sure a player can only be in one game at a time
router.beforeEach(function (to, from, next) {
    next(function (vm) {
        if (vm.$parent.player.gameId && vm.$parent.player.id) {
            vm.$router.push("/games/" + vm.$parent.player.gameId);
        }
    });
});
var script = {
    router,
    data: function () {
        return {
            title: 'Ergo Online',
            subTitle: 'Do you event exist? Prove it!',
            cookieName: 'ergo-player',
            player: {
                id: null,
                name: null,
                gameId: null
            },
            isLoaded: false
        };
    },
    mounted: function () {
        SocketEvent.fire('connected', null);
        SocketEvent.on('games-list-update', console.log);
        this.init();
    },
    methods: {
        init: function () {
            var _this = this;
            var playerCookie = Cookies.get(this.cookieName);
            if (playerCookie !== undefined) {
                this.player.id = playerCookie.split('|')[1] || null;
                this.player.name = playerCookie.split('|')[2] || null;
                this.player.gameId = playerCookie.split('|')[0] || null;
            }
            // check if player is in game that has not ended
            if (this.player.id !== null) {
                axios
                    .post('/api/game/connect', {
                    gameId: this.player.gameId,
                    playerId: this.player.id
                })
                    .then(function (res) {
                    _this.isLoaded = true;
                    if (res.data.success) {
                        _this.$router.push("/games/" + _this.player.gameId);
                    }
                })
                    .catch(function (e) { return console.error; });
            }
            else {
                this.isLoaded = true;
            }
        },
        updatePlayerData: function (data) {
            if (data && data.gameId) {
                this.player.id = data.id;
                this.player.name = data.name;
                this.player.gameId = data.gameId;
                this.updatePlayerCookie(data);
            }
            else {
                this.player.id = null;
                this.player.name = null;
                this.player.gameId = null;
                this.deletePlayerCookie();
            }
        },
        updatePlayerCookie: function (data) {
            Cookies.set(this.cookieName, data.gameId + "|" + data.id + "|" + data.name, {
                expires: 7, path: '/'
            });
        },
        deletePlayerCookie: function () {
            Cookies.remove(this.cookieName);
        }
    },
    watch: {
        isLoaded: function (val) {
            if (val)
                VueEvent.fire('app-ready');
        }
    },
    computed: {
        isLandingPage: function () {
            return this.$route.path === '/';
        }
    }
};

const __vue_script__ = script;
            
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _vm.isLandingPage
        ? _c("section", { staticClass: "hero is-info is-medium" }, [
            _c("div", { staticClass: "hero-body" }, [
              _c("div", { staticClass: "container has-text-centered" }, [
                _c("div", { staticClass: "columns" }, [
                  _c("div", { staticClass: "column" }, [
                    _c("h1", {
                      staticClass: "title",
                      domProps: { textContent: _vm._s(_vm.title) }
                    }),
                    _vm._v(" "),
                    _c("h2", {
                      staticClass: "subtitle",
                      domProps: { textContent: _vm._s(_vm.subTitle) }
                    })
                  ])
                ])
              ])
            ])
          ])
        : _c("section", { staticClass: "hero is-info" }, [
            _c("div", { staticClass: "hero-body" }, [
              _c("div", { staticClass: "container" }, [
                _c("div", { staticClass: "columns" }, [
                  _c("div", { staticClass: "column" }, [
                    _c("h1", {
                      staticClass: "title is-4",
                      domProps: { textContent: _vm._s(_vm.title) }
                    }),
                    _vm._v(" "),
                    _c("h2", {
                      staticClass: "subtitle is-6",
                      domProps: { textContent: _vm._s(_vm.subTitle) }
                    })
                  ])
                ])
              ])
            ])
          ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c("div", { staticClass: "container" }, [_c("router-view")], 1)
      ]),
      _vm._v(" "),
      _c("ModalNewGame"),
      _vm._v(" "),
      _c("ModalJoinGame"),
      _vm._v(" "),
      _c("ModalError")
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

const __vue_template__ = typeof __vue_render__ !== 'undefined'
  ? { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }
  : {};
/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return
  inject("data-v-d7ac04b0_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

};
/* scoped */
const __vue_scope_id__ = undefined;
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* component normalizer */
function __vue_normalize__(
  template, style, script$$1,
  scope, functional, moduleIdentifier,
  createInjector, createInjectorSSR
) {
  const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

  {
    component.__file = "C:\\Users\\nicek\\Developer\\ergo-online3\\public\\assets\\ts\\vue\\App.vue";
  }

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;

    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    let hook;
    if (style) {
      hook = function(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        const originalRender = component.render;
        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context)
        };
      } else {
        // inject component registration as beforeCreate hook
        const existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component
}
/* style inject */
function __vue_create_injector__() {
  const head = document.head || document.getElementsByTagName('head')[0];
  const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
  const isOldIE =
    typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

    if (!style.ids.includes(id)) {
      let code = css.source;
      let index = style.ids.length;

      style.ids.push(id);

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        const el = style.element = document.createElement('style');
        el.type = 'text/css';

        if (css.media) el.setAttribute('media', css.media);
        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts
          .filter(Boolean)
          .join('\n');
      } else {
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
        else style.element.appendChild(textNode);
      }
    }
  }
}
/* style inject SSR */


var App = __vue_normalize__(
  __vue_template__,
  __vue_inject_styles__,
  typeof __vue_script__ === 'undefined' ? {} : __vue_script__,
  __vue_scope_id__,
  __vue_is_functional_template__,
  __vue_module_identifier__,
  typeof __vue_create_injector__ !== 'undefined' ? __vue_create_injector__ : function () {},
  typeof __vue_create_injector_ssr__ !== 'undefined' ? __vue_create_injector_ssr__ : function () {}
);

export default App;
