import '../styles/globals.css'
import 'antd/dist/antd.css'
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// export default MyApp

// !important without SSR
import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});