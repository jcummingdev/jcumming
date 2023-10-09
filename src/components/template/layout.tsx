import Header from './header'

export default function layout (props) {
  return (
    
    <div>
      <Header/ >
      { props.children }
    </div>
  )
}