import { proxy } from 'valtio'

const Store = proxy({
  cards: [],
  favicons: {},
  search: '',

  modal: {
    isVisible: false,
    content: '',
    data: {
      snapshot: {
        value: '',
        pickColor: '',
        pickIndex: -1,
        previousPickIndex: -1,
        tags: [],
        isShowingIcons: true,
        isUpdatingTabs: false,
        isShowingCustomPick: false,
        id: null
      },

      settings: {}
    }
  },

  contextMenu: {
    x: 0,
    y: 0,
    data: '',
    type: 'card',
    isVisible: false,
    isPreventingDefault: import.meta.env.MODE === 'production'
  },

  settings: {}
});

export default Store;