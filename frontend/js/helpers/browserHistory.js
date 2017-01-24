//creates browser history to be used by router and also menu component
//sets basename necessary for server redirects to work properly

import {
  createHistory,
  useBasename
} from 'history';

export default useBasename(createHistory)({ basename: '/project2' });
