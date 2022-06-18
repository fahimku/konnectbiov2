import React from "react";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

function connectInstagram({className}) {
  return (
    <div className={className}>
        <button
          class="btn btn-primary"
          onClick={() => history.push("/app/account/setup")}
        >
         Connect To Instagram
        </button>
      </div>
  );
}

export default connectInstagram;
