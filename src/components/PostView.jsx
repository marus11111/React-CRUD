import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import find from 'core-js/fn/array/find';
import Comments from './Comments.jsx';
import fetchData from '../actions/ajax/fetchData';
import formatDate from '../helpers/formatDate';

class PostView extends Component {

  componentDidMount() {
    let {
      fetchData,
      params: {
        postId
      }
    } = this.props;
    fetchData('comments', postId);
  }

  render() {
    let {
      authorizedUser,
      usersEqual,
      imageUrl,
      posts,
      postsLoading,
      params: {
        user,
        postId
      }
    } = this.props;
    let title, body, date;

    let post = posts.find((post) => {
      return `${post.id}` === postId;
    });
    if (post) {
      title = post.title;
      body = post.body;
      date = formatDate(post.timestamp, 'post');
    }

    return (
      <div className='postview row row-center'>
        {post &&
        <div className='col-xs-12 col-sm-9 col-md-7 col-centered'>
          <div className={`postview__title__wrapper ${!imageUrl && 'postview__title__wrapper--no-image'}`}>
            <time 
              className='postview__date'
              dateTime={date.iso}> 
              {date.display}
            </time>
            <h1 
              className='postview__title'
              dangerouslySetInnerHTML={{__html: title}}/> 
          </div>
          <p 
            className='postview__body'
            dangerouslySetInnerHTML={{__html: body}}/> 
          <Comments 
            postId={post.id} 
            linkUser={user}
            authorizedUser={authorizedUser}
            usersEqual={usersEqual}/>
        </div>
        }
        {!post && !postsLoading &&
        <div>
          <h1>Post not found</h1>
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
    postsLoading: state.posts.loading
  }
}

export default connect(mapStateToProps, {
  fetchData
})(PostView);
