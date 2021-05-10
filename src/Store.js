import { proxy } from 'valtio'

const Store = proxy({
  buttons: []
});

export default Store;