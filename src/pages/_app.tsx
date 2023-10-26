import { SessionProvider } from "next-auth/react"
import Layout from '../components/template/layout'
import { AppProps } from "next/app"
import AppContext from "@/components/template/appContext"
import '../styles/globals.css'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

NProgress.configure({ easing: 'ease', speed: 500 });

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {

  return (
    <AppContext>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>                  
      </SessionProvider>      
    </AppContext>
  )
}