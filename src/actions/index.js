/* global chrome */
import * as utils from '../utils';

export const ADD_IMAGE = 'ADD_IMAGE';
export const SET_IMAGES_FROM_LOCAL_STORAGE = 'SET_IMAGES_FROM_LOCAL_STORAGE';
export const SET_VIEW = 'SET_VIEW';
export const CLEAR_ALL_IMAGES = 'CLEAR_ALL_IMAGES';
export const SET_ACTIVE_IMAGE = 'SET_ACTIVE_IMAGE';
export const CLEAR_ACTIVE_IMAGE = 'CLEAR_ACTIVE_IMAGE';
export const NEXT_GALLERY_PAGE = 'NEXT_GALLERY_PAGE';
export const PREV_GALLERY_PAGE = 'PREV_GALLERY_PAGE';
export const ADDED_IMAGE_TAG = 'ADDED_IMAGE_TAG';
export const REMOVED_IMAGE_TAG = 'REMOVED_IMAGE_TAG';
export const ADD_FILTER_TAG = 'ADD_FILTER_TAG';
export const SET_SLIDE_INDEX = 'SET_SLIDE_INDEX';

export const SET_SETTINGS_DARK_THEME_TOGGLE = 'SET_SETTINGS_DARK_THEME_TOGGLE';

export const GALLERY_INDEX = 0;
export const EDIT_INDEX = 1;
export const SETTINGS_INDEX = 2;

export function loadImagesFromLocalStorage() {
  return dispatch => {
    utils.get_images().then(images => {
      utils.getStorageInfo().then(storage => {
        dispatch({
          type: SET_IMAGES_FROM_LOCAL_STORAGE,
          payload: images,
          storage
        });
      });
    });
  };
}

export function setView(view) {
  return {
    type: SET_VIEW,
    payload: view
  };
}

export function addImage(srcUrl) {
  const image = {
    id: utils.guid(),
    src: srcUrl,
    tags: []
  };
  return dispatch => {
    utils
      .get_images()
      .then(images => {
        // don't add images with same src url
        if (!utils.image_src_exists(image, images)) {
          images = [...images, image];
        }
        return utils.set_images(images);
      })
      .then(images => {
        utils.getStorageInfo().then(storage => {
          dispatch({
            type: SET_IMAGES_FROM_LOCAL_STORAGE,
            payload: images,
            storage
          });
        });
      });
  };
}

export function clearAllImages() {
  return dispatch => {
    chrome.storage.local.clear(function () {
      dispatch({
        type: CLEAR_ALL_IMAGES
      });
    });
  };
}

export function removeImage(image) {
  return dispatch => {
    utils.remove_image(image).then(images => {
      utils.getStorageInfo().then(storage => {
        dispatch({
          type: SET_IMAGES_FROM_LOCAL_STORAGE,
          payload: images,
          removeImage: true,
          storage
        });
      });
    });
  };
}

export function setActiveImage(image) {
  return {
    type: SET_ACTIVE_IMAGE,
    payload: image
  };
}

export function clearActiveImage() {
  return {
    type: CLEAR_ACTIVE_IMAGE
  };
}

export function nextGalleryPage() {
  return {
    type: NEXT_GALLERY_PAGE
  };
}

export function prevGalleryPage() {
  return {
    type: PREV_GALLERY_PAGE
  };
}

export function addImageTag(image, tag) {
  return dispatch => {
    utils.add_tag(image, tag).then(image => {
      dispatch({
        type: ADDED_IMAGE_TAG,
        payload: { image, tag }
      });
      // loadImagesFromLocalStorage();
    });
  };
}

export function removeImageTag(image, tag) {
  console.log(image, tag);
  return dispatch => {
    utils.remove_tag(image, tag).then(image => {
      dispatch({
        type: REMOVED_IMAGE_TAG,
        payload: image
      });
    });
  };
}

export function addFilterTag(tag) {
  console.log('ACTIONS#addFilterTag', tag);
  return {
    type: ADD_FILTER_TAG,
    payload: tag
  };
}

export function setSlideIndex(index) {
  return {
    type: SET_SLIDE_INDEX,
    payload: index
  };
}

export function toggleDarkTheme(darkTheme = false) {
  return {
    type: SET_SETTINGS_DARK_THEME_TOGGLE,
    payload: darkTheme
  };
}
