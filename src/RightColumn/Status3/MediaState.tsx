import { useState } from "react";
type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};
type MediaInfor = {
  id: string;
  link: string;
};
type FileInfor = {
  id: string;
  link: string;
};
type linkInfor = {
  id: string;
  link: string;
};
type MusicInfor = {
  id: string;
  link: string;
};
type GroupInfor = {
  id: string;
  link: string;
};
type MediaProp = {
  Media: MediaInfor[];
  Files: FileInfor[];
  Links: linkInfor[];
  Music: MusicInfor[];
  Groups: GroupInfor[];
};

type MediaShow = {
  userProp: UserProp;
  stateMedia: string;
};
const MediaState: React.FC<MediaShow> = ({ userProp, stateMedia }) => {
  const [mediaClicked, setMediaClick] = useState<string>(stateMedia);
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
          <p>
            {" "}
            this {mediaClicked} of {userProp.name}{" "}
          </p>
        </div>
      </div>
      <div className="media-show"></div>
    </div>
  );
};
export default MediaState;
