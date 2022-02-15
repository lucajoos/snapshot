import { proxy } from 'valtio'
import supabase from './modules/supabase';

const Template = {
  cards: [],
  favicons: {},
  search: '',

  isFullscreen: false,

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
        category: null,
        sync: {
          advanced: {
            supabaseUrl: '',
            supabaseAnonKey: ''
          }
        }
      }
    }
  },

  contextMenu: {
    x: 0,
    y: 0,
    height: 0,

    data: '',
    type: '',

    isFlipped: false,
    isVisible: false,
    isPreventingDefault: import.meta.env.MODE === 'production'
  },

  settings: {
    sync: {
      isSynchronizing: true,
      isRealtime: true,

      advanced: {
        supabaseUrl: '',
        supabaseAnonKey: ''
      }
    },

    behaviour: {
      isFullscreen: false,

      cards: {
        isDeletingPermanently: false,
        isOpeningInWindow: false
      }
    }
  },

  confirm: {
    isVisible: false,
    type: '',
    text: '',
    resolve: () => {},
  },

  session: supabase.auth.session(),
};

const Store = proxy(Template);
export default Store;

export {
  Template
};