import Footer from './footer'
import Header from './header'

export default function layout (props:any) {
  return (
    <>
      <Header />
      <main>
        { props.children }
      </main>
      <Footer />
    </>

  )
}