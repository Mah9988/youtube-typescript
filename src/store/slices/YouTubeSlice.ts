import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { YOUTUBE_API_URL } from "../../constants";
import { HomePageVideos, InitialState, RecommendedVideos } from "../../Type";
import { parseData, parseRecommendedData } from "../../utils";
import { RootState } from "../index";
import { parseDataVideo } from "../../utils/parseDataVideo";

const API_KEY_YOUTUBE = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

const INITIAL_STATE: InitialState = {
  videos: [],
  currentPlaying: null,
  searchTerm: "",
  searchresults: [],
  nextPageToken: null,
  recommendedVideos: [],
};

// ** reducers : **
export const getHomePageVideos = createAsyncThunk(
  "YouTube/getHomePageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youTube: { nextPageToken: nextPageTokenFormState, videos },
    } = getState() as RootState;

    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?maxResults=20&q="reactjs projects"&key=${API_KEY_YOUTUBE}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFormState}` : ""
      }`
    );
    const parsedData: HomePageVideos[] = await parseData(items);
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);

export const getSearchPageVideos = createAsyncThunk(
  "YouTube/getSearchPageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youTube: { nextPageToken: nextPageTokenFormState, videos, searchTerm },
    } = getState() as RootState;

    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?q=${searchTerm}&key=${API_KEY_YOUTUBE}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFormState}` : ""
      }`
    );
    const parsedData: HomePageVideos[] = await parseData(items);
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);

export const getRecommendedVideos = createAsyncThunk(
  "YouTube/getRecommendedVideos",
  async (videoId: string, { getState }) => {
    const {
      youTube: {
        currentPlaying: {
          channelInfo: { id: channelId },
        },
      },
    } = getState() as RootState;

    const {
      data: { items },
    } = await axios.get(
      `${YOUTUBE_API_URL}/activities?key=${API_KEY_YOUTUBE}&channelId=${channelId}&part=snippet,contentDetails&maxResults=20&type=video&videoId=${videoId}`
    );

    const parsedData: RecommendedVideos[] = await parseRecommendedData(
      items,
      videoId
    );

    return { parsedData };
  }
);

export const getVideoDetails = createAsyncThunk(
  "YouTube/videoDetails",
  async (id: string) => {
    const {
      data: { items },
    } = await axios.get(
      `${YOUTUBE_API_URL}/videos?key=${API_KEY_YOUTUBE}&part=snippet,statistics&type=video&id=${id}`
    );

    return parseDataVideo(items[0]);
  }
);

// ** slice : **
const YouTubeSlice = createSlice({
  name: "YouTube",
  initialState: INITIAL_STATE,
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = null;
    },
    changeSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });
    builder.addCase(getSearchPageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });
    builder.addCase(getVideoDetails.fulfilled, (state, action) => {
      state.currentPlaying = action.payload;
    });
    builder.addCase(getRecommendedVideos.fulfilled, (state, action) => {
      state.recommendedVideos = action.payload.parsedData;
    });
  },
});

export const { clearVideos, changeSearchTerm, clearSearchTerm } =
  YouTubeSlice.actions;

export default YouTubeSlice.reducer;
