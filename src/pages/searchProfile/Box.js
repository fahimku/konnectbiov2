import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import numeral from "numeral";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
// import Carousel from "react-material-ui-carousel";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Box({ data }) {
  const [expanded, setExpanded] = React.useState(false);
  const [videoIcon, setVideoIcon] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function Pauseplay(e, id) {
    e.preventDefault();

    var testvideo = document.getElementById(id);

    if (testvideo.paused) {
      testvideo.play();
      setVideoIcon(true);
    } else {
      testvideo.pause();
      setVideoIcon(false);
    }
  }

  function renderMedia(item) {
    if (item.media_type === "IMAGE") {
      return (
        <CardMedia
          component="img"
          height="400"
          sx={{ objectFit: "cover", borderRadius: 2 }}
          image={
            item.media_type === "CAROUSEL_ALBUM"
              ? item.children?.data[0].media_url
              : item.media_url
          }
          alt="Paella dish"
        />
      );
    }
    if (item.media_type === "VIDEO") {
      return (
        <>
          <button
            onClick={(e) => Pauseplay(e, item.id)}
            className="btn-link btn-play"
          >
            {!videoIcon ? (
              <i class="fa fa-play" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-pause" aria-hidden="true"></i>
            )}
          </button>
          <CardMedia
            component="video"
            sx={{ objectFit: "cover", borderRadius: 2 }}
            autoPlay={false}
            // controls={true}
            // loop
            height="400"
            image={item.media_url}
            alt="Paella dish"
            id={item.id}
          />
        </>
      );
    }
    return null;
  }

  function renderCarousel(item) {
    return (
      <>
        {/* <Carousel className="cr-album" navButtonsAlwaysVisible={true}  navButtonsProps={{style: {backgroundColor: "rgba(87, 87, 87, 0.4)",},}} indicators={false} swipe={true}> */}
        {item.children.data.map((it2, i) => {
          if (i === 0) {
            if (it2.media_type === "IMAGE") {
              return (
                <a target="_blank" rel="noreferrer" href={data.permalink}>
                  <CardMedia
                    component="img"
                    height="400"
                    sx={{ objectFit: "cover", borderRadius: 2 }}
                    image={it2.media_url}
                    alt="Paella dish"
                  />
                </a>
              );
            }
            if (it2.media_type === "VIDEO") {
              return (
                <a target="_blank" rel="noreferrer" href={data.permalink}>
                  <CardMedia
                    component="video"
                    sx={{ objectFit: "cover", borderRadius: 2 }}
                    autoPlay={false}
                    controls
                    //    loop
                    height="400"
                    image={it2.media_url}
                    alt="Paella dish"
                  />
                </a>
              );
            }
          }
        })}

        {/* </Carousel> */}
      </>
    );
  }

  return (
    <>
      <Card elevation={1}>
        <div className="media-box-post" style={{ padding: "15px" }}>
          {data.media_type === "CAROUSEL_ALBUM" ? (
            renderCarousel(data)
          ) : (
            <a target="_blank" rel="noreferrer" href={data.permalink}>
              {renderMedia(data)}
            </a>
          )}
        </div>

        <CardActions disableSpacing>
          {!expanded ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: 10,
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <ThumbUpIcon sx={{ color: "#b3b3b3", fontSize: 16 }} />
                <Typography
                  variant="h6"
                  style={{ color: "#b3b3b3", marginTop: 3, marginLeft: 5 }}
                >
                  {numeral(data.like_count ? data.like_count : 0).format("0,0")}
                </Typography>
              </div>
              <div
                style={{ width: 2, height: 20, backgroundColor: "lightgrey" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <CommentIcon sx={{ color: "#b3b3b3", fontSize: 16 }} />
                <Typography
                  variant="h6"
                  style={{ color: "#b3b3b3", marginTop: 3, marginLeft: 5 }}
                >
                  {numeral(
                    data.comments_count ? data.comments_count : 0
                  ).format("0,0")}
                </Typography>
              </div>
              <Typography
                variant="body"
                sx={{ fontSize: "12px", marginLeft: "15px" }}
                color="gray"
                textAlign="center"
              >
                {new Date(data.timestamp).toDateString()}
              </Typography>
            </div>
          ) : null}
          <div
            style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
          >
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>{data.caption}</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <ThumbUpIcon sx={{ color: "#b3b3b3", fontSize: 16 }} />
                <Typography
                  variant="h6"
                  style={{ color: "#b3b3b3", marginTop: 3, marginLeft: 5 }}
                >
                  {numeral(data.like_count ? data.like_count : 0).format("0,0")}
                </Typography>
              </div>
              <div
                style={{ width: 2, height: 20, backgroundColor: "lightgrey" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <CommentIcon sx={{ color: "#b3b3b3", fontSize: 16 }} />
                <Typography
                  variant="h6"
                  style={{ color: "#b3b3b3", marginTop: 3, marginLeft: 5 }}
                >
                  {numeral(
                    data.comments_count ? data.comments_count : 0
                  ).format("0,0")}
                </Typography>
              </div>
            </div>
            <Typography
              variant="body"
              sx={{ fontSize: "14px", marginRight: "15px" }}
              color="gray"
              textAlign="right"
            >
              {new Date(data.timestamp).toDateString()}
            </Typography>
          </CardActions>
        </Collapse>
      </Card>
    </>
  );
}
