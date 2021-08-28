import { useState, useCallback } from 'react'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import { logout } from '../store/store'
import axios from 'axios'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'

import { GithubOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

import Container from './Container'

const { publicRuntimeConfig } = getConfig()

const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20,
}

const inputSearchStyle = {
    position: 'relative',
    top: 16,
}

const footerStyle = {
    textAlign: 'center'
}

const Comp = ({ color, children, style}) => <div style={{ color, ...style }}>{children}</div>

function MyLayout ({ children, user, logout, router }) {

    const urlQuery = router.query && router.query.query

    const [search, setSearch] = useState(urlQuery)

    const handleSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [setSearch])

    const handleOnSearch = useCallback(() => {
        router.push(`/search?query=${search}`)
    }, [search])

    const handleLogout = useCallback(() => {
        logout()
    }, [logout])

    const handleGotoOAuth = useCallback((e) => {
        e.preventDefault()
        axios.get(`/prepare-auth?url=${router.asPath}`).then(resp => {
            if (resp.status === 200 ){
                location.href = publicRuntimeConfig.OAUTH_URL
            }else {
                console.log('prepare auth failed', resp)
            }
        }).catch(err => {
            console.log('prepare auth failed', err)
        })
    }, [])
        
    
    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)" onClick={handleLogout}>
                    登出
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner" />}>
                    <div className="header-left">
                        <div className="logo">
                            <Link href="/">
                                <GithubOutlined style={githubIconStyle} />
                            </Link>
                        </div>
                        <div>
                            <Input.Search placeholder="搜尋" value={search} onChange={handleSearchChange} onSearch={handleOnSearch} style={inputSearchStyle}/>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {
                                user && user.id ? (
                                    <Dropdown overlay={userDropDown} >
                                    <a href="/">
                                        <Avatar size={40} src={user.avatar_url} />
                                    </a>
                                    </Dropdown>
                                ) : (
                                    <Tooltip title="點擊登入" >                              
                                    <a href={`/prepare-auth?url=${router.asPath}`}>
                                        <Avatar size={40} icon="user" />
                                    </a>
                                    </Tooltip>  
                                )
                            }
                            
                        </div>
                    </div>
                </Container>
            </Header>
            <Content>
                <Container>
                    {children}
                </Container>
            </Content>
            <Footer style={footerStyle}>
                Develop by luke @<a href="mailto:s1415937@gmail.com">s1415937@gmail.com</a>
            </Footer>
            <style jsx>{`
                .header-inner {
                    display: flex;
                    justify-content: space-between;
                }
                .header-left {
                    display: flex;
                    justify-content: stretch;
                }
                .content {
                    color: red;
                }
            `}</style>
            <style jsx global>{`
                #__next {
                    height: 100%;
                }    
                .ant-layout {
                    min-height: 100%;
                }
                .ant-layout-header{
                    padding-left: 0;
                    padding-right: 0;
                }
                .ant-layout-content {
                    background: #fff;
                }
            `}</style>
        </Layout>
    )
}

export default connect(function mapState(state) {
    return {
        user: state.user
    }
}, function mapReducer(dispatch) {
    return {
        logout: () => dispatch(logout()),
    }
})(withRouter(MyLayout)) 