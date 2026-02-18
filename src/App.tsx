import React from 'react';
import { FluentProvider, webLightTheme, makeStyles, tokens } from '@fluentui/react-components';
import { AppProvider, useApp } from './context/AppContext';
import AppHeader from './components/AppHeader';
import Dashboard from './screens/Dashboard';
import ImportAccounts from './screens/ImportAccounts';
import ConfigureRules from './screens/ConfigureRules';
import Recommendations from './screens/Recommendations';
import OutreachPack from './screens/OutreachPack';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

const AppContent: React.FC = () => {
  const styles = useStyles();
  const { state } = useApp();

  const renderScreen = () => {
    switch (state.currentStep) {
      case 1:
        return <ImportAccounts />;
      case 2:
        return <ConfigureRules />;
      case 3:
        return <Recommendations />;
      case 4:
        return <OutreachPack />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={styles.root}>
      <AppHeader />
      {renderScreen()}
    </div>
  );
};

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </FluentProvider>
  );
}

export default App;
