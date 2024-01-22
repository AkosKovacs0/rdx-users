import { useEffect, useReducer } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchUsers,
  getUserById,
  getUserFilter,
  selectedUserIds,
  setFilter,
} from "./usersSlice"
import User from "./User"

export default function Users() {
  const dispatch = useAppDispatch()
  const userIds = useAppSelector(selectedUserIds)
  const filter = useAppSelector(getUserFilter)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  console.log("Rendering users", userIds, filter)

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={filter}
        onChange={(e) => dispatch(setFilter(e.currentTarget.value as string))}
      />
      {userIds.map((id) => (
        <User key={id} id={id} />
      ))}
    </div>
  )
}
