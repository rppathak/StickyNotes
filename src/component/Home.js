
import AddNote from './AddNote';

export default function Home(props) {

  const{showAlert}=props

  return (
    <div>
      <AddNote showAlert ={showAlert}/>
    </div>
  )
}
