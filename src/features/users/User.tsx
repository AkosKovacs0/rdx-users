import { connect } from "react-redux"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { User, UserId, deleteById, getUserById } from "./usersSlice"
import { EntityId } from "@reduxjs/toolkit"

type UserProps = {
  id: EntityId
  // user: User
}
// type StateProps = {
//   user: User
// }
export default function UserView({ id }: UserProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => getUserById(state, id))
  if (!user) {
    return null
  }

  const name = `${user.firstName} ${user.lastName}`
  console.log("Rending user: ", user.email)
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
      <p>
        <button onClick={() => dispatch(deleteById(id))}>Delete</button>
      </p>
    </div>
  )
}

// function mapStateToProps(state: RootState, ownProps: UserProps) {
//   return {
//     user: getUserById(state, ownProps.id),
//   }
// }

// export default connect(mapStateToProps)(UserView)
