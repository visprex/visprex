import mixpanel from 'mixpanel-browser';

mixpanel.init("ef5a8fd8aa0ff739a4a0be87cdcf3e49", { debug: true, track_pageview: true, persistence: 'localStorage' }); 
mixpanel.identify("anonymous")

// Track an event. It can be anything, but in this example, we're tracking a Sign Up event.