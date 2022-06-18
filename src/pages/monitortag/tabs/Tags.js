import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Loader from '../../../components/Loader/Loader'

export default function Tags({data,loading}) {

    function renderMedia(item) {
        if (item.media_type == "IMAGE" || item.media_type == "CAROUSEL_ALBUM") {
            return <img src={item.media_url} class="card-img-top" alt="..." />
        }
        if (item.media_type == "VIDEO") {
            return <video class="card-img-top" controls autoPlay src={item.media_url} />
        }
        return null
    }

    return (
        <div>
        {loading?(
            <div style={{height:300,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Loader size={30}/>
            </div>
        ):(
            data?(
                data.length>0?(
                    <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 2, 1300: 3}}
                >
                    <Masonry gutter="15px">
                    {data.map((item,i) => {
                            return (
                                <Box data={item}/>
                            )
                        })}
                    </Masonry>
                </ResponsiveMasonry>
                ):(
                    <div style={{height:300,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <h1 style={{textAlign:'center'}}>No result Found</h1>
                    </div>
                )
            ):(
                <div style={{height:300,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <h1 style={{textAlign:'center',color:'gray'}}>Search Now</h1>
                </div>
            )
        )}
    </div>
    )
}
