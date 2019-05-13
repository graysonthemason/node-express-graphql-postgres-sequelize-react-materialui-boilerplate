import React, { Component } from 'react';
import GoogleAnalytics from 'react-ga';
const ga_account = '';

GoogleAnalytics.initialize(ga_account); // add google analytics

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    GoogleAnalytics.set({
      page,
      ...options
    });
    GoogleAnalytics.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      const { location } = this.props;
      const page = location.pathname + location.search;
      trackPage(page);
    }

    componentDidUpdate(prevProps) {
      const { location } = this.props;
      const currentPage =
        prevProps.location.pathname + prevProps.location.search;
      const nextPage = location.pathname + location.search;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withTracker;
