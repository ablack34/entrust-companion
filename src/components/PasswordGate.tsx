import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Title1,
  Body1,
  Input,
  Button,
  Card,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { LockClosedFilled } from '@fluentui/react-icons';

const ACCESS_CODE = 'Entrust2026';
const SESSION_KEY = 'entrust-companion-auth';

const useStyles = makeStyles({
  backdrop: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '24px',
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorBrandForeground1,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
});

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const styles = useStyles();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (code === ACCESS_CODE) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAuthenticated(true);
        setError(false);
      } else {
        setError(true);
      }
    },
    [code]
  );

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.backdrop}>
      <Card className={styles.card}>
        <LockClosedFilled className={styles.icon} />
        <Title1>Access Required</Title1>
        <Body1 align="center">
          Enter the access code to view this prototype.
        </Body1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Access code"
            value={code}
            onChange={(_, data) => setCode(data.value)}
            size="large"
            autoFocus
          />
          {error && (
            <MessageBar intent="error">
              <MessageBarBody>Incorrect access code. Please try again.</MessageBarBody>
            </MessageBar>
          )}
          <Button type="submit" appearance="primary" size="large">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PasswordGate;
