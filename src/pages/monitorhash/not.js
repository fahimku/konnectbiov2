{/* <div style={{ width: '100%', display: 'flex', marginTop: 20 ,marginLeft:10}}>
<div style={{ width: '70%' }}>
    <input onChange={e => setText(e.target.value)} class="form-control" id="exampleDataList" placeholder="Type to search..." />
</div>
<div style={{ marginLeft: 10 }}>
    <button class="btn btn-primary" onClick={()=>onSearch('recent_media')}>Recent</button>
    <button onClick={()=>onSearch('top_media')} class="btn btn-primary">Top</button>
</div>
</div>
<div style={{marginTop:20}}>
{loading?(
    <div style={{height:300,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <Loader size={30}/>
    </div>
):(
    data?(
        data.filter((item)=>item.media_type=="IMAGE" || item.media_type=="VIDEO").length>0?(
            <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 1300: 3}}
        >
            <Masonry gutter="15px">
            {
                data.filter((item)=>item.media_type=="IMAGE" || item.media_type=="VIDEO").map((item)=>{
                    return (
                        <Box data={item}/>
                    )
                })
            // data.filter((item)=>item.media_type=="IMAGE" || item.media_type=="VIDEO").map((item,i) => {
            //         return (
            //                 <div class="card" style={{margin:10}}>
            //                     <div class="card-body">
            //                     <p class="card-text">{item.caption}</p>
            //                         {renderMedia(item)}
            //                     </div>
            //                     <div class="card-header d-flex justify-content-between">
            //                         <h5>likes: {item.like_count?item.like_count:0}</h5>
            //                         <h5>Comments: {item.comments_count?item.comments_count:0}</h5>
            //                     </div>
            //                     {/* <button
            //                     onClick={() => {
            //                         history.push(`/app/postDetails/${item.id}`)
            //                     }}
            //                     type="button"
            //                     class="btn btn-primary"
            //                     style={{ width: '100%', margin: '0px' }}
            //                 >View Details</button> */}
            //                 </div>
            //         )
            //     })
        }
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
</div> */}




