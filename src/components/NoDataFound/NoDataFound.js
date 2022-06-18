import React from 'react';

export default function NoDataFound() {
    return <div className="no-result-found">
        <div class="result-inner">
            <h2>No Data Available</h2>
            <p className="text-muted">Sorry But The Data You Are Looking For Does Not Exist.</p>
        </div>
    </div>;
}
