import axios from 'axios';
import React from 'react'
import Select from "react-select";
import Loader from '../../../components/Loader/Loader';
import config from "../../../config";

export default function SelectPages({ clear,pages, setSelectedPage, selectedPage, checkLoading, insta, next }) {
    
    function onReset(){
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        axios.put(`${config.hostApi}/v1/users/revise/resetfacebook/${userInfo.user_id}`).then(()=>{
            clear(null)
            localStorage.setItem('userInfo',JSON.stringify({...userInfo,fb_token:undefined}))
        })
    }
    return (
        <>
            <h5 className="card-title">Select Facebook Page</h5>
            <p className="card-text">Please select a page that is connected to instagram.</p>
            <div className="mb-3">
                <label>Facebook Pages</label>

                <Select
                    options={pages.map((item) => {
                        return (
                            {
                                value: item.id,
                                label: item.name
                            }
                        )
                    })}
                    placeholder="Select Page"
                    onChange={(event) => setSelectedPage(event.value)}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                    checkLoading ? <Loader /> : (
                        insta || insta == 0 ? null : <p style={{ color: 'red' }}>Oops, there is no business instagram account found.</p>
                    )
                }
            </div>
            <div className="w-100 justify-content-center">
                <button
                    onClick={onReset}
                    className="btn btn-primary btn-sm"
                >
                    Reset
                </button>
                <button
                    onClick={next}
                    disabled={insta ? false : true}
                    className="btn btn-primary btn-sm"
                >
                    Next
                </button>
            </div>
        </>
    )
}
