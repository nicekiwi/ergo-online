let ModalError = Vue.component('ModalError', {
    mounted () {
      VueEvent.on('modal-open-error', data => {
        this.modalOpen = true
        this.title = data.title
        this.message = data.message
      });
    },
    data() {
      return {
        modalOpen: false,
        title: 'Error',
        message: ''
      }
    },
    methods: {
      closePopup() {
        this.modalOpen = false
        this.title = ''
        this.message = ''
      }
    },
    template: `
      <div :class="'modal' + (modalOpen ? ' is-active' : '')">
        <div class="modal-background"></div>
        <div class="modal-content box">
          <div class="columns">
            <div class="column">
              <h2 class="title is-3" v-text="title"></h2>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <p v-text="message"></p>
            </div>
          </div>
        </div>
        <button v-on:click="closePopup()" class="modal-close is-large" aria-label="close"></button>
      </div>
    `
  });