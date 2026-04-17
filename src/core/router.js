import { state, setState } from './state.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || '#trips';
  
  if (hash === '#trips') {
    setState({ screen: 'trips' });
  }
  else if (hash === '#new-trip') {
    setState({ screen: 'trip-form', activeTripId: null });
  }
  else if (hash.startsWith('#trip/')) {
    const id = hash.split('/')[1];
    setState({ screen: 'trip-details', activeTripId: id, detailsTab: 'list' });
  }
  else if (hash.startsWith('#trip/')) {
    const id = hash.split('/')[1];
    setState({ screen: 'trip-details', activeTripId: id });
  }
  else if (hash === '#add-expense') {
    setState({ screen: 'expense-add' });
  }
  else if (hash === '#settings') {
    setState({ screen: 'settings' });
  }
  else {
    setState({ screen: 'trips' });
  }
}

export function navigate(to) {
  window.location.hash = to;
}
