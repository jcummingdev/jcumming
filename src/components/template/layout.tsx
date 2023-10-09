import Header from './header'

export default function layout (props:any) {
  return (
    
    <div>
      <Header/ >
      { props.children }
    </div>
  )
}