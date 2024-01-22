import {
  EntityId,
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export type User = {
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

const usersAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (user: User) => user.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.id - b.id,
})

type UsersState = {
  loadingState: LoadingState
  // users: Normalized<User>
  users: EntityState<User>
  filter: string
  filteredIds: UserId[]
}

const initialState: UsersState = {
  loadingState: "idle",
  filter: "",
  filteredIds: [],
  users: usersAdapter.getInitialState(),
}

export const usersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    deleteById: (state, action: PayloadAction<EntityId>) => {
      usersAdapter.removeOne(state.users, action.payload)
    },
    setFilter: (state, action: PayloadAction<string>) => {
      // const term = action.payload.toLowerCase()
      // if (term === "") {
      //   state.filter = ""
      //   state.filteredIds = state.users.ids
      // } else {
      //   state.filter = action.payload
      //   state.filteredIds = state.users.ids.filter((id) => {
      //     const user = state.users.values[id]
      //     return (
      //       user.firstName.toLowerCase().includes(term) ||
      //       user.lastName.toLowerCase().includes(term) ||
      //       user.email.toLowerCase().includes(term)
      //     )
      //   })
      // }
      console.log("not implemented", action)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingState = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingState = "idle"
        usersAdapter.setAll(state.users, action.payload.users);
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loadingState = "failed"
        console.error("Failed to fetch users")
      })
  },
})

export const { setFilter, deleteById } = usersSlice.actions

export const usersSelectors = usersAdapter.getSelectors()

export const allUserIds = (state: RootState) =>
  usersSelectors.selectIds(state.users.users)
export const selectedUserIds = (state: RootState) => allUserIds(state)
export const getUserFilter = (state: RootState) => state.users.filter
export const getUserById = (state: RootState, id: EntityId) =>
  usersSelectors.selectById(state.users.users, id)

export default usersSlice.reducer
