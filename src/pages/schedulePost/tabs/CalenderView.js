import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import CalendarComponent from "./Calender"
import * as schedulePostActions from "../../../actions/schedulePost";

function CalenderView({ schedulePosts,title,getSchedulePosts }) {

    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        getSchedulePosts()
        .then(()=>{
            setLoading(false)
        })
    },[])
    return (
        <React.Fragment>
            <div className="container-fluid">
                <h4 className="page-title">{title}</h4>
                <div className="brand_container_main">
                    {
                        loading?(
                            <Loader size={30}/>
                        ):(
                            <CalendarComponent
                            data={schedulePosts.map((item,i)=>{
                                return           {
                                    title: item.caption,
                                    editable:false,
                                    start: new Date(item.publish_date),
                                    extendedProps:{
                                      url: item.media_url,
                                      ...item
                                    },
                                  }
                            })}
                            reload={getSchedulePosts}
                            />
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    );
}
function mapStateToProps({ schedulePosts }) {
    return { schedulePosts };
}
export default connect(mapStateToProps, schedulePostActions)(CalenderView);