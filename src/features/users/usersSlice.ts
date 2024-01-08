import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

type User = {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  image: string
}

type UsersResponse = {
  users: User[]
}

export type UserId = User["id"]
const SLICE_NAME = "users"
export const fetchUsers = createAsyncThunk(
  `${SLICE_NAME}/fetchUsers`,
  async () => {
    const response = await fetch("https://dummyjson.com/users")
    return (await response.json()) as Promise<UsersResponse>
  },
)

type LoadingState = "idle" | "loading" | "failed"

type Normalized<T, KeyType extends number | string | symbol = number> = {
  ids: KeyType[]
  values: Record<KeyType, T>
}

type UsersState = {
  loadingState: LoadingState
  users: Normalized<User>
  filter: string
  filteredIds: UserId[]
}

const initialState: UsersState = {
  loadingState: "idle",
  filter: "",
  filteredIds: [],
  users: {
    ids: [],
    values: {},
  },
}

export const usersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
      const filter = action.payload.toLowerCase()
      if (filter === "") {
        state.filteredIds = state.users.ids
        return
      }
      state.filteredIds = state.users.values
        .filter((user) => {
          return (
            user.firstName.includes(filter) || user.lastName.includes(filter)
          )
        })
        .map((user) => user.id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingState = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingState = "idle"
        action.payload.users.forEach((user) => {
          state.users.ids.push(user.id)
          state.users.values[user.id] = user
        })
        state.filteredIds = state.users.ids
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loadingState = "failed"
        console.error("Failed to fetch users")
      })
  },
})

export const { setFilter } = usersSlice.actions

export const allUserIds = (state: RootState) => state.users.users.ids
export const selectedUserIds = (state: RootState) => state.users.filteredIds
export const getUserFilter = (state: RootState) => state.users.filter
export const getUserById = (state: RootState, id: UserId) =>
  state.users.users.values[id]

export default usersSlice.reducer
