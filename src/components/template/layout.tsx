import Footer from './footer'
import Header from './header'
import { useAppContext } from './appContext'
import { ReactNode } from 'react'

interface ChildrenProps {
  children?: ReactNode
}

export default function Layout ({ children }: ChildrenProps) {

  const globalState = useAppContext()

  return (
    <div className={globalState?.darkMode? 'darkMode' : ''}>
      <Header />
      <main>
        { children }
      </main>
      <Footer />
    </div>
  )
}