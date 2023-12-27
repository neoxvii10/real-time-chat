import { useState } from "react";

type MediaShow = {};
const MediaState: React.FC<MediaShow> = ({}) => {
  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
  };
  return (
    <div>
      <div className="media-container">
        <div className="header">
          <p
            className={`media-topic ${
              mediaClicked === "Media" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Media
          </p>
          <p
            className={`media-topic ${
              mediaClicked === "Files" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Files
          </p>
          <p
            className={`media-topic ${
              mediaClicked === "Links" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Links
          </p>
          <p
            className={`media-topic ${
              mediaClicked === "Music" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Music
          </p>
          <p
            className={`media-topic ${
              mediaClicked === "Group" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Group
          </p>
        </div>
        <div className="body">
          <p></p>
        </div>
      </div>
      <div className="media-show"></div>
    </div>
  );
};
export default MediaState;
