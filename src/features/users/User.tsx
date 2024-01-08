import { useAppSelector } from "../../app/hooks"
import { UserId, getUserById } from "./usersSlice"

type UserProps = {
  id: UserId
}
export default function User({ id }: UserProps) {
  // const dispatch = useAppDispatch()
  const user = useAppSelector((state) => getUserById(state, id))
  const name = `${user.firstName} ${user.lastName}`
  return (
    <div>
      <p>
        <strong>{name}</strong>
      </p>
      <p>
        <i>{user.email}</i>
      </p>
      <p>
        <img src={user.image} alt={name} />
      </p>
    </div>
  )
}
