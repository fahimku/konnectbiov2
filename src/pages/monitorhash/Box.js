import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import numeral from "numeral";
import { useHistory } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import Carousel from "react-material-ui-carousel";
import CarouselIcon from "../../images/carouselIcon.svg";
import NoImage from "../../images/no-image.png";

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
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);

  const [videoIcon, setVideoIcon] = React.useState(false);

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
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function renderMedia(item) {
    if (item.media_type === "IMAGE") {
      return (
        <CardMedia
          component="img"
          height="450"
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
            onClick={(e) => Pauseplay(e, item._id)}
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
            sx={{ objectFit: "cover", borderRadius: 1 }}
            autoPlay={false}
            controls
            //loop
            height="450"
            image={item.media_url}
            id={item._id}
            alt="Paella dish"
          />
        </>
      );
    }
    return null;
  }

  function renderCarousel(item) {
    return (
      <>
        {/*<Carousel
        className="cr-album"
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(87, 87, 87, 0.4)",
          },
        }}
        indicators={false}
        swipe={true}
      >
      */}
        {item.children.data.length === 0 ? (
          <a target="_blank" href={data.permalink}>
            <button className="btn-link btn-play btn-carousel">
              <img src={CarouselIcon} alt="CarouselIcon" />
            </button>
            <CardMedia
              component="img"
              height="450"
              sx={{ objectFit: "cover", borderRadius: 2 }}
              image={NoImage}
              alt="Paella dish"
            />
          </a>
        ) : (
          item.children.data.map((it2, i) => {
            if (i === 0) {
              if (it2.media_type === "IMAGE") {
                return (
                  <a target="_blank" href={data.permalink}>
                    <button className="btn-link btn-play btn-carousel">
                      <img src={CarouselIcon} alt="CarouselIcon" />
                    </button>
                    <CardMedia
                      component="img"
                      height="450"
                      sx={{ objectFit: "cover", borderRadius: 2 }}
                      image={it2.media_url}
                      alt="Paella dish"
                    />
                  </a>
                );
              }
              if (it2.media_type === "VIDEO") {
                return (
                  <a target="_blank" href={data.permalink}>
                    <CardMedia
                      component="video"
                      sx={{ objectFit: "cover", borderRadius: 2 }}
                      autoPlay={false}
                      controls
                      //  loop
                      height="450"
                      image={it2.media_url}
                      alt="Paella dish"
                    />
                  </a>
                );
              }
            }
          })
        )}
        {/*</Carousel>*/}
      </>
    );
  }

  return (
    <>
      <Card elevation={1}>
        <CardHeader
          avatar={
            <Avatar
              alt={data.username}
              src={data.userInfo?.business_discovery?.profile_picture_url}
            />
          }
          action={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <GroupIcon sx={{ color: "gray", fontSize: 25 }} />
              <Typography
                variant="h6"
                style={{ color: "gray", marginTop: 3, marginLeft: 5 }}
              >
                {numeral(
                  data.userInfo?.business_discovery?.followers_count
                ).format("0,0")}
              </Typography>
            </div>
          }
          title={
            <Typography variant="body" color="#010b40">
              <a
                style={{ color: "#010b40", fontSize: 14, fontWeight: "bold" }}
                target="_blank"
                href={`https://www.instagram.com/${data.username}`}
              >
                {data.username}
              </a>
            </Typography>
          }
          subheader={`#${data.hashtag}`}
        />
        <Divider />
        <div className="media-box-post" style={{ padding: "15px" }}>
          {data.media_type === "CAROUSEL_ALBUM" ? (
            <a target="_blank" href={data.permalink}>
              {renderCarousel(data)}
            </a>
          ) : (
            <a target="_blank" href={data.permalink}>
              {renderMedia(data)}
            </a>
          )}
        </div>

        <CardActions disableSpacing>
          {!expanded ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                // marginLeft: 10,
                alignItems: "center",
                flexGrow: 1,
              }}
            >
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
        </CardActions>
      </Card>
    </>
  );
}
