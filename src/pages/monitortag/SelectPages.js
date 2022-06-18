import React from 'react'
import Select from "react-select";
import Loader from '../../components/Loader/Loader';

export default function SelectPages({ pages,setSelectedPage ,selectedPage,checkLoading,insta,next}) {
    return (
        <div className="row justify-content-md-center instaPost-box">

            <div className="col-lg-6">
                <div className="card ">
                    <div className="card-header">
                        Select Facebook Page
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Select Facebook Page</h5>
                        <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <div className="mb-3">
                            <label>Facebook Pages</label>

                            <Select
                                options={pages.map((item)=>{
                                    return (
                                       { value:item.id,
                                        label:item.name}
                                    )
                                })}
                                placeholder="Select Page"
                                onChange={(event) => setSelectedPage(event.value)}
                            />
                        </div>
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            {
                                checkLoading?<Loader/>:(
                                    insta || insta ==0?null:<p style={{color:'red'}}>Oops, there is no business instagram account found.</p>
                                )
                            }
                        </div>
                        <div className="w-100 justify-content-center">
                            <button
                                onClick={next}
                                disabled={insta?false:true}
                                className="btn btn-primary btn-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
