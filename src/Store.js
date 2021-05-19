import { proxy } from 'valtio'

const Store = proxy({
  cards: [],
  isModalVisible: false
});

export default Store;