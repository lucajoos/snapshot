import { proxy } from 'valtio'

const Store = proxy({
  cards: [],
  value: '',
  isModalVisible: false
});

export default Store;