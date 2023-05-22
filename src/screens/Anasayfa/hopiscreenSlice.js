import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

const initialState = {
  DShopImages: [],
  banners: [],
  myOffers: [],
  clickWinItems: [],
  lovemarks: [],
  imageNumber: 1,
  anketImage: [],
};

export const getDShopImagesAsync = createAsyncThunk(
  "hopiscreen/getDShopImagesAsync",
  async () => {
    const imagesRef = collection(db, "DShopImages");
    const q = query(imagesRef, orderBy("id"));
    return getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, doc.data().image);
          data.push({ id: doc.id, image: doc.data().image });
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export const getMyOffersAsync = createAsyncThunk(
  "hopiscreen/getMyOffersAsync",
  async () => {
    const imagesRef = collection(db, "myOffers");
    const q = query(imagesRef, orderBy("id"));
    return getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            brandName: doc.data().brandName,
            imageUrl: doc.data().imageUrl,
            title: doc.data().title,
            description: doc.data().description,
          });
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export const getClickWinItemsAsync = createAsyncThunk(
  "hopiscreen/getClickWinItemsAsync",
  async () => {
    const imagesRef = collection(db, "clickWinItems");
    const q = query(imagesRef, orderBy("id"));
    return getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            brandName: doc.data().brandName,
            imageUrl: doc.data().imageUrl,
            description: doc.data().description,
          });
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export const getLoveMarksAsync = createAsyncThunk(
  "hopiscreen/getLoveMarksAsync",
  async () => {
    const imagesRef = collection(db, "lovemarks");
    const q = query(imagesRef, orderBy("id"));
    return getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            brandName: doc.data().brandName,
            imageUrl: doc.data().imageUrl,
          });
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export const getAnketImageAsync = createAsyncThunk(
  "hopiscreen/getAnketImageAsync",
  async () => {
    const listRef = ref(storage);
    const res = await listAll(listRef);
    let url = null;
    for (const item of res.items) {
      if (item.name === "anket2.png") {
        const downloadURL = await getDownloadURL(ref(storage, item.name));
        url = downloadURL;
        break;
      }
    }
    return url;
  }
);

const hopiscreenSlice = createSlice({
  name: "hopiscreen",
  initialState,
  reducers: {
    handleChangeImageNumber: (state, action) => {
      state.imageNumber = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDShopImagesAsync.fulfilled, (state, action) => {
        state.DShopImages = state.DShopImages.concat(action.payload);
      })
      .addCase(getMyOffersAsync.fulfilled, (state, action) => {
        state.myOffers = state.myOffers.concat(action.payload);
      })
      .addCase(getClickWinItemsAsync.fulfilled, (state, action) => {
        state.clickWinItems = state.clickWinItems.concat(action.payload);
      })
      .addCase(getLoveMarksAsync.fulfilled, (state, action) => {
        state.lovemarks = state.lovemarks.concat(action.payload);
      })
      .addCase(getAnketImageAsync.fulfilled, (state, action) => {
        state.anketImage = state.anketImage.concat(action.payload);
      });
  },
});

export const { handleChangeImageNumber } = hopiscreenSlice.actions;

export const selectDShopImages = (state) => state.hopiscreen.DShopImages;
export const selectMyOffers = (state) => state.hopiscreen.myOffers;
export const selectClickWinItems = (state) => state.hopiscreen.clickWinItems;
export const selectLoveMarks = (state) => state.hopiscreen.lovemarks;
export const selectImageNumber = (state) => state.hopiscreen.imageNumber;
export const selectAnketImage = (state) => state.hopiscreen.anketImage;

export default hopiscreenSlice.reducer;
