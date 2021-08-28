import { render } from 'react-dom'
import { async } from 'regenerator-runtime'
import createStore from '../store/store'
import React from 'react'
const isServer = typeof window === 'undefined' 
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'
function getOrCreateStroe (initialState) {
    if (isServer) {
        return createStore(initialState)
    }
    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}
export default Comp => {     // 下面這兩個是來自_app.js <23行>
    class WithReduxApp extends React.Component {
        constructor(props) {
            super(props)
            this.reduxStore = getOrCreateStroe(props.initailReduxState)
        }

        render() {
            const { Component, pageProps, ...rest } = this.props
            if (pageProps) {
                pageProps.test = '123'
            }
            return (
                <Comp
                    Component={Component}
                    pageProps={pageProps}
                    {...rest}
                    reduxStore={this.reduxStore} 
                />
            ) 
        }
    }
    WithReduxApp.getInitialProps = async ctx => {

        let reduxStore

        if (isServer) {
            const { req } = ctx.ctx
            const session = req.session
            
            if(session && session.userInfo) {  // 獲取 state
                reduxStore = getOrCreateStroe({
                    user: session.userInfo,
                })
            }else {
                reduxStore = getOrCreateStroe()
            }
        }else{
            reduxStore = getOrCreateStroe()
        }

        ctx.reduxStore = reduxStore

        // let appProps = {}
        // if (typeof Comp.getInitialProps === 'function') {
        //     appProps = await Comp.getInitialProps(ctx)
        // }
        let appProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx)
        }

        return {
            ...appProps,
            initailReduxState: reduxStore.getState()
        }
    }
    return WithReduxApp
}

// // example 1 
// export default (Comp) => {
//     return function TestHocComp(props) {
//         return <Comp {...props} />
//     }               // 把所有接收到的props都直接傳遞到要渲染的Comp上
// }                   // 這樣接收到額外的props都會直接傳遞給Comp
//                     // 而不需要在在裡面進行處理

// // example 2
// export default (Comp) => {
//     return function TestHocComp( {name, ...rest} ) {
//         const name = name + '123'
//         return <Comp {...rest} name={name} />
//     }
// }

// // example 3
// export default Comp => {     // 下面這兩個是來自_app.js <23行>
//     function TestHocComp( {Component, pageProps, ...rest }) {
//         console.log(Component, pageProps)
//         if (pageProps) {
//             pageProps.test = '123'
//         }
//         return <Comp Component={Component} pageProps={pageProps} {...rest} />
//     }
//     TestHocComp.getInitialProps = Comp.getInitialProps // getInitialProps來自_app.js<18行>

//     return TestHocComp
// }