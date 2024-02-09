import { redirect } from 'next/navigation'
const Redirection = ({params}) => {
  return redirect(`/api?uid=${params.uid}`)
;}
export default Redirection