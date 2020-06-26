import { AppProps } from 'next/app'
import 'leaflet/dist/leaflet.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
