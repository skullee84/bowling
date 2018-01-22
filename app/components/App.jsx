import React from 'react';
import { Switch, Route } from 'react-router-dom';
import classnames from 'classnames';

import Home from 'components/home/Home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}
