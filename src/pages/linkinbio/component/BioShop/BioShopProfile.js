import React from "react";

function BioShopProfile({ profile }) {
  return (
    <>
      <div className="bio-profile">
        {profile.profile_image_url && (
          <img
            alt="image"
            src={
              profile.profile_image_url === ""
                ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg=="
                : profile.profile_image_url
            }
            style={{ width: "150px", height: "150px" }}
            className="rounded-circle profile-icon"
          />
        )}
        <div className="profile-heading">{profile.name}</div>
        <p className="profile-bio">{profile.bio}</p>
      </div>
    </>
  );
}

export default BioShopProfile;
