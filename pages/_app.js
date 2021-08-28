import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import Layout from '../components/Layout'
import testHoc from '../lib/with-redux'
import PageLoading from '../components/PageLoading'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'

class MyApp extends App {
    state = {
        context: 'value',
        loading: false
    } 

    startLoading = () => {
        this.setState({
            loading: true
        })
    }

    stopLoading = () => {
        this.setState({
            loading: false
        })
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading)
        Router.events.on('routeChangeComplete', this.stopLoading)
        Router.events.on('routeChangeError', this.stopLoading)
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading)
        Router.events.off('routeChangeComplete', this.stopLoading)
        Router.events.off('routeChangeError', this.stopLoading)
    }

    static async getInitialProps(ctx){
        const { Component } = ctx
        console.log('app init')
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }
    render() {
        const { Component, pageProps, reduxStore} = this.props
        return (
            <Provider store={reduxStore}> {/* 這個store為連接store/store.js */}
                { this.state.loading ? <PageLoading /> : null }
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        )
    }
}

export default testHoc(MyApp)