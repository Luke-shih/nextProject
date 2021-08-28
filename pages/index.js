import { Button, Tabs } from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import Repo from '../components/Repo'
import Router, { withRouter } from 'next/router'
import { MailOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { cacheArray } from '../lib/repo-basic-cache'

const { publicRuntimeConfig } = getConfig()
const isServer = typeof window === 'undefine'
const api = require('../lib/api')
let cachedUserRepos, cachedUserStarredRepos

function Index ({ userRepos, userStarredRepos, user, router }) {

    const tabKey = router.query.key || 'own'
    const handleTabChange = (activeKey) => {
        Router.push(`/?key=${activeKey}`)
    }

    useEffect(() => {
        if (!isServer) {
            cachedUserRepos = userRepos
            cachedUserStarredRepos = userStarredRepos
            const timeout = setTimeout(() => {
                cachedUserRepos = null
                cachedUserStarredRepos = null
            }, 1000 * 60 * 10)
        }
    }, [userRepos, userStarredRepos])

    useEffect(() => {
        if(!isServer) {
            cacheArray(userRepos)
            cacheArray(userStarredRepos)
        }
    })

    if (!user || !user.id) {
        return <div className="root">
                <p>目前尚未登入</p>
                <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
                    點擊登入
                </Button>
                <style jsx>{`
                    .root {
                        height: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
    }

    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="user avatar" className="avatar" />
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="location"><EnvironmentOutlined style={{ marginRight: 10}} />{user.location}</p>
                <p className="email">
                    <MailOutlined style={{ marginRight: 10}} />
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
                <div className="user-repos">
                    <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
                        <Tabs.TabPane tab="你的倉庫" key="own">
                            {userRepos.map(repo => (
                                <Repo key={repo.id} repo={repo} />
                            ))}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="關注的倉庫" key="Favorite">
                            {userStarredRepos.map(repo => (
                                <Repo key={repo.id} repo={repo} />
                            ))}
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            <style jsx>{`
                .root {
                    display: flex;
                    align-items: flex-start;
                    padding: 40px 0;
                }
                .user-info {
                    width: 280px;
                    margin-Right: 40px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                }
                .login {
                    font-weight: 600;
                    font-size: 26px;
                    margin-top: 16px;
                }
                .name {
                    font-size: 20px;
                    color: #777;
                }
                .bio {
                    font-weight: 400;
                    margin-top: 30px;
                    font-size: 20px;
                    color: #333;
                }
                .location {
                    margin-top: 16px;
                }
                .avatar {
                    width: 100%;
                    border-radius: 150px;
                }
                .user-repos {
                    flex-grow: 1;
                }
            `}</style>
        </div>
    )
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
    const user = reduxStore.getState().user
    console.log(reduxStore)
    if(!user || !user.id) {
        return {
            isLogin: false,
        }
    }

    if (!isServer) {
        if (cachedUserRepos && cachedUserStarredRepos) {
            return {
                userRepos: cachedUserRepos,
                userStarredRepos: cachedUserStarredRepos,
            }
        }
    }
    
    // 使用者 repos
    const userRepos = await api.request({
        url: '/user/repos',
    }, ctx.req, ctx.res)
    // 關注的列表
    const userStarredRepos = await api.request({ 
        url: '/user/starred',
    }, ctx.req, ctx.res)
  
    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStarredRepos: userStarredRepos.data
    }
}

export default withRouter(connect(function mapState(state) {
    return {
        user: state.user
    }
})(Index))