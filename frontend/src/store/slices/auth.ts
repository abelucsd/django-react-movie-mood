import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { AccountResponse } from "../../types"

type State = {
    account: AccountResponse | null;
    token: string | null;
    refreshToken: string | null;
}

const initialState: State = {account: null, token: null, refreshToken: null}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccount(state: State, action: PayloadAction<AccountResponse>) {
            state.account = action.payload
        },
        setAuthTokens(state: State, action: PayloadAction<{token: string; refreshToken: string;}>) {
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
        },
        logout(state: State) {
            state.account = null            
        }
    }
})

export default authSlice