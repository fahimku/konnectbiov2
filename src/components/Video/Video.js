import React, {useEffect, useRef} from "react";

const Video = (props) => {
  let url = props.src;
  const videoRef = useRef();
  const previousUrl = useRef(url);
  useEffect(() => {
    if (previousUrl.current === url) {
      return;
    }
    if (videoRef.current) {
      videoRef.current.load();
    }
    previousUrl.current = url;
  }, [url]);

  return (
    <video ref={videoRef}>
      <source src={url} />
    </video>
  );
};
export default Video;
