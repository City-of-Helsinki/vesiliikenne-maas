import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Ferry</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
        <style>{`
          html, body {
            margin: 0;
            font-family: Roboto, sans-serif;
            padding: 0;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
