import { proxy } from 'valtio'

const Store = proxy({
  cards: []
});

export default Store;