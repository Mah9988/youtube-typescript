import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearVideos,
  getHomePageVideos,
} from "../../store/slices/YouTubeSlice";
import { HomePageVideos } from "../../Type";
import Card from "../../components/Card/Card";
const Home = () => {
  const dispatch = useAppDispatch();
  const videos = useAppSelector((state) => state.youTube.videos);

  useEffect(() => {
    return () => {
      dispatch(clearVideos());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getHomePageVideos(false));
  }, [dispatch]);

  return videos.length ? (
    <InfiniteScroll
      dataLength={videos.length}
      next={() => dispatch(getHomePageVideos(true))}
      hasMore={videos.length < 500}
      loader={<Spinner />}
      height={875}
    >
      <div className="grid gap-y-12 gap-x-12 grid-cols-5 p-8 ">
        {videos.map((item: HomePageVideos) => {
          return <Card data={item} key={item.videoId} />;
        })}
      </div>
    </InfiniteScroll>
  ) : (
    <Spinner />
  );
};
export default Home;
