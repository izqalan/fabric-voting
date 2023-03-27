import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  FiHome,
  FiTrendingUp,
  FiBarChart,
} from 'react-icons/fi';
import SidebarWithHeader from '@/components/layouts/SidebarWithHeader'
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/date-picker.css'

import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const LinkItems = [
    { name: 'Home', icon: FiHome, route: '/admin/home' },
    { name: 'Pilihan raya', icon: FiTrendingUp, route: '/admin/election' },
    { name: 'Keputusan', icon: FiBarChart, route: '/admin/result' },
  ];
  
  return (
    <ChakraProvider>
      {router.pathname.includes('admin') ? (
        <SidebarWithHeader linkItems={LinkItems}>
          <Component {...pageProps} />
        </SidebarWithHeader>
      ) : (
        <Component {...pageProps} />
      )}
    </ChakraProvider>
  )
}
