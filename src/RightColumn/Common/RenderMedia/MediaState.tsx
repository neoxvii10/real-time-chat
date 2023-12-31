import { useState, useEffect } from "react";
import "./MediaState.css";

import ChannelApi from "../../../Api/ChannelApi";
import { channel } from "diagnostics_channel";

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type Image = {
  id: number;
  message_type: string;
  content: string;
  create_at: string;
  member: number;
  channel: number;
  reply: number;
};

type MediaShow = {
  channel: ChannelType;
};
const MediaState: React.FC<MediaShow> = ({ channel }) => {
  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
  };

  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImage = async (channelId: number) => {
    try {
      const response = await ChannelApi.getChannelMediaList(channelId); // Replace with your API endpoint
      setData(response.data);
    } catch (error) {
      console.error(error);
      // Handle errors appropriately
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage(channel.id);
  }, [channel.id]);

  return (
    <div>
      <div className="media-container">
        <div className="media-header">
          <p
            className={`media-topic ${
              mediaClicked === "Media" ? "media-clicked" : ""
            }`}
            onClick={(e) => {
              handleClickOnMedia(e);
            }}
          >
            Photos
          </p>
        </div>
        <div className="media-body">
          <div>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <div className="media-grid-container">
                {data.map((image) => (
                  <a href={image.content} target="_blank">
                    <img key={image.id} src={image.content} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MediaState;
