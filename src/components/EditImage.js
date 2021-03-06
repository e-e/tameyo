import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setView,
  addImageTag,
  removeImageTag,
  removeImage,
  clearActiveImage,
  setSlideIndex,
  GALLERY_INDEX
} from '../actions';

import { is_video } from '../utils';

import ConfirmationButton from 'react-confirmation-button';
import ConfirmButton from './ConfirmButton';
import ContentSection from './ContentSection';
import Tag from './Tag';
import MediaElement from './MediaElement';
import CopyTextButton from './CopyTextButton';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';

import '../styles/EditImage.css';

class EditImage extends Component {
  constructor(props) {
    super(props);
    this.state = { newTag: '' };

    this.onNewTagChange = this.onNewTagChange.bind(this);
    this.checkForEnterKey = this.checkForEnterKey.bind(this);
    this.onBackClicked = this.onBackClicked.bind(this);
  }
  onNewTagChange(e) {
    this.setState({ newTag: e.target.value });
  }
  addNewTag() {
    this.props.addImageTag(this.props.image, this.state.newTag);
    this.setState({ newTag: '' });
  }
  checkForEnterKey(e) {
    if (e.key === 'Enter') {
      this.addNewTag();
      // e.target.blur();
    }
  }
  renderTags() {
    return this.props.image.tags.map(tag => (
      <Chip
        key={tag}
        onRequestDelete={() => this.props.removeImageTag(this.props.image, tag)}
      >
        {tag}
      </Chip>
    ));
  }
  onBackClicked() {
    this.props.setSlideIndex(GALLERY_INDEX);
    this.props.clearActiveImage();
  }
  render() {
    return (
      <div className="edit-image">
        <ContentSection className="button-group sp-btw">
          <FlatButton label="Back to Gallery" onClick={this.onBackClicked} />
          <ConfirmButton
            onConfirm={() => this.props.removeImage(this.props.image)}
          />
        </ContentSection>
        <ContentSection>
          <div className="image-container">
            <MediaElement className="media" media={this.props.image} />
          </div>
        </ContentSection>
        <ContentSection>
          <div className="links">
            <CopyTextButton
              text={this.props.image.src}
              label={
                (is_video(this.props.image.src) ? 'Video' : 'Image') + ' URL'
              }
            />
            {this.props.image.src === this.props.image.pageUrl ? null : (
              <CopyTextButton
                text={this.props.image.pageUrl}
                label="Source Page"
              />
            )}
            {!!!this.props.image.base64 ? null : (
              <CopyTextButton
                text={this.props.image.base64}
                label="Base64"
              />
            )}
          </div>
          <div className="click-top-copy">Click to copy</div>
        </ContentSection>
        <ContentSection>
          <TextField
            hintText="Add a new tag"
            floatingLabelText="Image Tags"
            value={this.state.newTag}
            onChange={this.onNewTagChange}
            onKeyPress={this.checkForEnterKey}
          />
        </ContentSection>
        <ContentSection>
          <div className="edit-image-tags">{this.renderTags()}</div>
        </ContentSection>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    image: state.activeImage
  };
};
export default connect(mapStateToProps, {
  setView,
  addImageTag,
  removeImageTag,
  removeImage,
  clearActiveImage,
  setSlideIndex
})(EditImage);
