import { useEffect, useState } from 'react';
import CalendarMonthView from '../../components/calendar/CalendarMonthView.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listContents } from '../../lib/crmApi';

export default function ClientCalendarPage() {
  const { profile } = useAuth();
  const [state, setState] = useState({ contents: [], loading: true, error: '' });
  useEffect(() => {
    listContents({ client_id: profile.client_id })
      .then((contents) => setState({ contents, loading: false, error: '' }))
      .catch((err) => setState({ contents: [], loading: false, error: err.message }));
  }, [profile.client_id]);

  if (state.loading) return <LoadingState />;
  return <div><PageTitle title="Calendario" description="Il tuo calendario contenuti." /><ErrorState message={state.error} /><CalendarMonthView contents={state.contents} /></div>;
}
