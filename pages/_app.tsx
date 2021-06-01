import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import NavBar from '../components/NavBar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <NavBar/>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
