import { proxy } from 'valtio'

const Store = proxy({
  cards: [],
  favicons: {},
  search: '',
  modal: {
    value: '',
    pickColor: '',
    pickIndex: -1,
    isShowingIcons: true,
    isUpdatingTabs: false,
    isShowingCustomPick: false,
    id: null
  },
  isModalVisible: false,
});

export default Store;