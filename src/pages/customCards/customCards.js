import React from 'react'
import { Accordion, Card, Carousel } from "react-bootstrap";
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function customCards() {
    return (
        <div className="container-fluid mb-4">
            <div className="row">
                {array.map((item, i) => {
                    return <div className="mt-4 card-column col-xl-3 col-sm-12 col-md-6 col-lg-6 col-xs-12" key={i}>
                        <div className="card-main-container" key={i}>
                            <div className="card p-3" key={i}>
                                <div className="inside-card" key={i}>
                                    <a href='https://google.com' target='_blank'>
                                        {i == 2 ?
                                            <video controls>
                                                <source src="https://video-lga3-2.cdninstagram.com/v/t50.2886-16/205290916_482454936182775_6992469025986643363_n.mp4?_nc_cat=109&vs=17872264235430437_1043598455&_nc_vs=HBksFQAYJEdLUjlQQXozWHhkTHlyWUJBS01GMnd5SVBRcGhia1lMQUFBRhUAAsgBABUAGCRHRWpnUEF4NUdTX1dXVVFCQUxUdTN4R2RZTFpwYmtZTEFBQUYVAgLIAQAoABgAGwGIB3VzZV9vaWwBMRUAACasspOp%2BvrGQBUCKAJDMywXQBszMzMzMzMYEmRhc2hfYmFzZWxpbmVfMV92MREAdeoHAA%3D%3D&ccb=1-5&_nc_sid=59939d&efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjgyOC5mZWVkIn0%3D&_nc_ohc=1dVTQoQqIJYAX-wm9bH&_nc_ht=video-lga3-2.cdninstagram.com&edm=AM6HXa8EAAAA&oh=00_AT9n_lMe5z58zTgfDSKJMtebbnQarMsZYIMYyD509vRnww&oe=61D2181F&_nc_rid=777901682a" type="video/mp4" />
                                            </video>

                                            : i == 1 ?
                                                <Carousel  fade indicators={false}>
                                                    <Carousel.Item>
                                                        <img
                                                            className="d-block w-100"
                                                            src="https://scontent-lga3-2.cdninstagram.com/v/t51.2885-15/209606016_3697925846978761_2639944579563936133_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=8ae9d6&_nc_ohc=tk3SmZqJpxUAX_WYp6l&_nc_ht=scontent-lga3-2.cdninstagram.com&edm=AM6HXa8EAAAA&oh=00_AT-Vri73y2UuCS_Czm1iwJ5umjgCFNTFtenCSeMA0Y08bg&oe=61D6BA32"
                                                            alt="First slide"
                                                        />
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img
                                                            className="d-block w-100"
                                                            src="https://scontent-lga3-2.cdninstagram.com/v/t51.2885-15/266318879_882157739141954_8634794592988738799_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=8ae9d6&_nc_ohc=GrxR8S2bRcIAX_5hlz6&_nc_ht=scontent-lga3-2.cdninstagram.com&edm=AM6HXa8EAAAA&oh=00_AT_wXK4PkJsK6hHID1poMb2SNmyqFruJ1XdRSGBaiAPj2Q&oe=61D632D0"
                                                            alt="Second slide"
                                                        />
                                                    </Carousel.Item>
                                                </Carousel>
                                                :
                                                <img src="https://scontent-lga3-2.cdninstagram.com/v/t51.2885-15/266318879_882157739141954_8634794592988738799_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=8ae9d6&_nc_ohc=GrxR8S2bRcIAX_5hlz6&_nc_ht=scontent-lga3-2.cdninstagram.com&edm=AM6HXa8EAAAA&oh=00_AT_wXK4PkJsK6hHID1poMb2SNmyqFruJ1XdRSGBaiAPj2Q&oe=61D632D0"
                                                    className="card-img-top"
                                                    alt="Sample Image"
                                                />

                                        }
                                    </a>
                                </div>
                                <Accordion className="mt-4">
                                    <Card>
                                        <Accordion.Toggle className="d-flex justify-content-between" as={Card.Header} eventKey="0">
                                            <i className="fa fa-thumbs-up">&nbsp;1599</i>
                                            <i className="fa fa-comment">&nbsp;155</i>
                                            <i className="fa fa-date">&nbsp;Mon Dec 2021</i>
                                            <i className={`fa fa-chevron-down   d-flex justify-content-end`}></i>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>Your new favorite pants. Designed with breathable fibers to keep you feeling and looking cool</Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div >
    )
}