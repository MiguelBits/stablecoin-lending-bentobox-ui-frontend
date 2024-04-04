import { extendTheme } from '@chakra-ui/react';

import Accordion from 'theme/components/Accordion';
import Alert from 'theme/components/Alert';
import Badge from 'theme/components/Badge';
import Button from 'theme/components/Button';
import Card from 'theme/components/Card';
import Drawer from 'theme/components/Drawer';
import Input from 'theme/components/Input';
import Menu from 'theme/components/Menu';
import Modal from 'theme/components/Modal';
import Progress from 'theme/components/Progress';
import Slider from 'theme/components/Slider';
import Table from 'theme/components/Table';
import Tabs from 'theme/components/Tabs';
import Tooltip from 'theme/components/Tooltip';
import Switch from 'theme/components/Switch';

const theme = extendTheme({
  breakpoints: {
    sm: '480px', // Small screens (e.g., smartphones)
    md: '768px', // Tablets
    lg: '1024px', // Desktops and small laptops
    xl: '1280px', // Large screens and laptops
    '2xl': '1536px', // Extra-large screens and high-resolution displays
  },
  fonts: {
    heading: `'Instrument Serif', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  fontSizes: {
    xs: '12px', // Extra-small font
    sm: '14px', // Small font
    md: '16px', // Medium font (often considered the base size)
    lg: '18px', // Large font
    xl: '20px', // Extra-large font
    '2xl': '24px', // Larger desktop font
  },
  config: {
    // Initially use dark mode
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  shadows: {},
  colors: {
    brand: {
      primary: '#041019', //green/crypto noir
      secondary: '#e8b96a', //golden chain
      accent: {
        one: '#d8d8d8', //silver screen
        two: '#ff6b6b', //red hot crypto
      },
      yellow: {
        50: '#F7EF8A',
        100: '#EDC967',
        200: '#D2AC47',
        300: '#AE8625',
      },
      gray: '#222222',
    },
    system: {
      success: '#17e8a1',
    },
    text: {
      secondary: '#9EA1A8',
    },
    background: {
      primary: '#0F0B05',
      secondary: '#322410', //lighter golden chain
      tertiary: '#292011',
    },
  },
  components: {
    Accordion,
    Alert,
    Badge,
    Button,
    Card,
    Drawer,
    Input,
    Menu,
    Modal,
    Progress,
    Slider,
    Table,
    Tabs,
    Tooltip,
    Switch,
  },
  styles: {
    global: () => {
      return {
        'html, body': {
          bg: 'white',
        },
      };
    },
  },
});

export default theme;
