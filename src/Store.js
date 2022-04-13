import { proxy } from 'valtio'
import supabase from './modules/supabase';

const Template = {
  cards: [],
  favicons: {},
  search: '',

  isFullscreen: false,
  isScrolling: false,

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
        done: () => {},
        isPasswordVisible: false,
        isSignIn: true,
        isLoading: false
      },

      settings: {
        category: null,
        sync: {
          advanced: {
            applicationUrl: ''
          },

          supabase: {
            supabaseUrl: '',
            supabaseAnonKey: ''
          }
        }
      },

      share: {
        id: '',
        url: '',
        isPublic: false
      },

      tabs: {
        tabs: [],
        resolve: ()=>{},
        id: '',
        current: 'default',
        isEditing: true,
        isFetching: false,
        view: {
          url: '',
          title: '',
          favicon: '',
          index: -1
        }
      }
    }
  },

  contextMenu: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,

    data: '',
    type: '',

    isFlippedY: false,
    isFlippedX: false,

    isVisible: false,
    isPreventingDefault: import.meta.env.MODE === 'production'
  },

  settings: {
    sync: {
      isSynchronizing: true,
      isRealtime: true,

      advanced: {
        applicationUrl: ''
      },

      supabase: {
        supabaseUrl: '',
        supabaseAnonKey: ''
      }
    },

    behavior: {
      isFullscreen: false,
      isRenderingEffects: true,

      cards: {
        isDeletingPermanently: false,
        isOpeningInWindow: false
      }
    }
  },

  dialogue: {
    isVisible: false,
    type: '',
    text: '',
    resolve: () => {},
  },

  privacy: {
    isVisible: false,
    resolve: () => {},
  },

  palette: ['orange', 'pink', 'green', 'violet', 'blue'],
  isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),
  environment: import.meta.env.VITE_APP_ENVIRONMENT,
  session: supabase.auth.session(),
};

const Store = proxy(Template);
export default Store;

export {
  Template
};