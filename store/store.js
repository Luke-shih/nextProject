import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk' // ReduxThunk就是redux的Middleware(中間件)
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'


const userInitialState = {}

const LOGOUT = 'LOGOUT'

function userReducer(state = userInitialState, action) {
    switch (action.type) {
        case LOGOUT: {
            return {}
        }
        default:
            return state
    }
}

const allReducers = combineReducers({
    user: userReducer,
})

// action creators

export function logout() {
    return dispatch => {
        axios.post('logout')
        .then(resp => {
            if (resp.status === 200){
                dispatch({
                    type: LOGOUT
                })
            }else{
                console.log('logout failed', resp)
            }
        }).catch(err => {
            console.log('logout failed', err)
        })
    }
}


// const store = createStore(
//     allReducers, 
//     {
//         user: userInitialState,
//     },
//     composeWithDevTools(applyMiddleware(ReduxThunk)),
// )
// console.log(store) 
// // console.log出來會有個 {count: 0}，執行上面createStore的時候會默認初始化執行一遍function reducer
// // {type:}就是action
// // 另一個console.log結果initialState是，裡面的dispatch跟getState(獲取最新state的方式)
// console.log(store.getState()) 
// // 更新store裡面的數據
// console.log(store.getState()) // 這個數據是舊的

// export出去是一個方法，在每次渲染都去創建一個store
export default function initializeStore(state) {
    const store = createStore(
      allReducers,
      Object.assign(
        {},
        {
          user: userInitialState,
        },
        state,
      ),
      composeWithDevTools(applyMiddleware(ReduxThunk)),
    )

    return store
}
