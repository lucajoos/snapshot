import { proxy } from 'valtio'

const Store = proxy({
  cards: [],
  favicons: {},
  search: '',
  modal: {
    value: '',
    pickColor: '',
    pickIndex: -1,
    tags: [],
    isShowingIcons: true,
    isUpdatingTabs: false,
    isShowingCustomPick: false,
    id: null
  },
  contextMenu: {
    x: 0,
    y: 0,
    isVisible: false
  },
  isModalVisible: false,
});

export default Store;