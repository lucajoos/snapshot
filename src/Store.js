import { proxy } from 'valtio'
import supabase from './modules/supabase';

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

      profile: {
        email: '',
        password: '',
        error: null,
        isPasswordVisible: false,
        isSigningIn: true,
        isLoading: false
      },

      settings: {
        category: null
      }
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

  settings: {},
  session: supabase.auth.session()
});

export default Store;