import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import SearchCard from "../../components/SearchCard/SearchCard";
import Spinner from "../../components/Spinner/Spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearVideos,
  getSearchPageVideos,
} from "../../store/slices/YouTubeSlice";
import { HomePageVideos } from "../../Type";

const Search = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const videos = useAppSelector((state) => state.youTube.videos);
  const searchTerm = useAppSelector((state) => state.youTube.searchTerm);

  useEffect(() => {
    dispatch(clearVideos());
    if (searchTerm === "") {
      navigate("/");
    } else {
      dispatch(getSearchPageVideos(false));
    }
  }, [dispatch, navigate, searchTerm]);

  return videos.length ? (
    <div className="pm-8 pl-8 flex flex-col gap-5 w-full">
      <InfiniteScroll
        dataLength={videos.length}
        next={() => dispatch(getSearchPageVideos(true))}
        hasMore={videos.length < 500}
        loader={<Spinner />}
        height={875}
      >
        <div className="my-5 ">
          {videos.map((item: HomePageVideos) => {
            return <SearchCard data={item} key={item.videoId} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  ) : (
    <Spinner />
  );
};

export default Search;
