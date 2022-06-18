import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useHistory } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import Box from './tabs/Box'


export default function Content({ insta, accessToken }) {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(false)
    const [text, setText] = useState("warpweftworld")

    useEffect(() => {
        if (insta) {
            onSearch()
        }
    }, [insta])

    function onSearch() {
        axios.get(`https://graph.facebook.com/v12.0/${insta}/tags?fields=id,caption,comments_count,like_count,media_type,media_url,owner,username&access_token=${accessToken}`)
            .then(res => {
                const promisesArray = res.data.data.map(item => {
                    return axios.get(`https://graph.facebook.com/v12.0/${insta}?fields=business_discovery.username(${item.username}){followers_count,media_count}&access_token=${accessToken}`)
                })
                Promise.allSettled(promisesArray)
                    .then((res2) => {
                        const updatedData = res2.map((item, i) => {
                            if (item != "rejected") {
                                return {
                                    business_discovery: { followers_count: 0 },
                                    ...item.value?.data
                                }
                            } else {
                                return {
                                    business_discovery: {}
                                }
                            }
                        })
                        const dataUpdate = res.data.data.map((item, i) => {
                            return {
                                ...item,
                                userInfo: updatedData[i]
                            }
                        }).sort((a, b) => b.userInfo.business_discovery.followers_count - a.userInfo.business_discovery.followers_count)
                        setData(dataUpdate)
                        setLoading(false)
                    })
            })
    }

    return (
        <div>
            <div>
                {loading ? (
                    <div style={{ height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader size={30} />
                    </div>
                ) : (
                    data ? (
                        data.length > 0 ? (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{ 350: 1, 700: 2, 1100: 3, 1500: 4 }}
                            >
                                <Masonry gutter="15px">
                                    {data.map((item, i) => {
                                        return (
                                            <Box data={item} />
                                        )
                                    })}
                                </Masonry>
                            </ResponsiveMasonry>
                        ) : (
                            <NoDataFound/>
                        )
                    ) : (
                        <div style={{ height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{ textAlign: 'center', color: 'gray' }}>Search Now</h1>
                        </div>
                    )
                )}
            </div>
        </div>
    )

}