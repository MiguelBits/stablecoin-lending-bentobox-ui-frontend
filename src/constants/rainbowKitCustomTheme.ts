import { Theme } from '@rainbow-me/rainbowkit';

export const rainbowKitCustomTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  colors: {
    accentColor: 'none',
    accentColorForeground: '#e8b96a',
    actionButtonBorder: '#e8b96a',
    actionButtonBorderMobile: '#e8b96a',
    actionButtonSecondaryBackground: '...',
    closeButton: 'rgba(232, 185, 106, 0.5)',
    closeButtonBackground: '#0F0B05',
    connectButtonBackground: 'none',
    connectButtonBackgroundError: 'none',
    connectButtonInnerBackground: 'none',
    connectButtonText: 'rgba(255, 255, 255, 0.48)',
    connectButtonTextError: '#ff6b6b',
    connectionIndicator: '...',
    downloadBottomCardBackground: '...',
    downloadTopCardBackground: '...',
    error: '#ff6b6b',
    generalBorder: '#322410',
    generalBorderDim: '#322410',
    menuItemBackground: '#e8b96a',
    modalBackdrop: 'none',
    modalBackground: '#0F0B05',
    modalBorder: '#322410',
    modalText: '#fff',
    modalTextDim: '#222222',
    modalTextSecondary: 'rgba(255,255,255,0.48)',
    profileAction: '#E8B96A',
    profileActionHover: '#e8b96a',
    profileForeground: '#0F0B05',
    selectedOptionBorder: '#e8b96a',
    standby: 'none',
  },
  fonts: {
    body: `'Roboto', sans-serif`,
  },
  radii: {
    actionButton: '5px',
    connectButton: '6px',
    menuButton: '6px',
    modal: '6px',
    modalMobile: '6px',
  },
  shadows: {
    connectButton: 'none',
    dialog: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
    profileDetailsAction: 'none',
    selectedOption: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
    selectedWallet: '0px 0px 10px 0px rgba(232, 185, 106, 0.15)',
    walletLogo: 'none',
  },
};