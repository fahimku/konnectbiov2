import React, {useEffect} from "react";
function Iframe(props) {
    useEffect(() => {
      
  }, [props]);

  return (
    <div>
      <iframe  src={props.src}></iframe>
    </div>
  );
}

export default Iframe;
