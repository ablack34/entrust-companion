import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Avatar,
  ToolbarButton,
  Tooltip,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { Home24Regular, DocumentBulletList24Regular } from '@fluentui/react-icons';
import { useApp } from '../context/AppContext';
import { docsRegistry } from '../data/docsRegistry';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '48px',
    backgroundColor: '#6B2FA0',
    color: '#FFFFFF',
    boxShadow: tokens.shadow4,
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '-0.3px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

const AppHeader: React.FC = () => {
  const styles = useStyles();
  const { dispatch } = useApp();

  const goHome = () => {
    dispatch({ type: 'SET_STEP', payload: 0 });
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Tooltip content="Go to Dashboard" relationship="label">
          <ToolbarButton
            icon={<Home24Regular style={{ color: tokens.colorNeutralForegroundOnBrand }} />}
            onClick={goHome}
            style={{ minWidth: 'auto' }}
          />
        </Tooltip>
        <Text className={styles.logo}>Entrust Prospect Prioritization Companion</Text>
      </div>
      <div className={styles.right}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Tooltip content="Documentation" relationship="label">
              <ToolbarButton
                icon={<DocumentBulletList24Regular style={{ color: tokens.colorNeutralForegroundOnBrand }} />}
                style={{ minWidth: 'auto' }}
              />
            </Tooltip>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {docsRegistry.map((doc) => (
                <MenuItem
                  key={doc.slug}
                  onClick={() => dispatch({ type: 'SHOW_DOC', payload: doc.slug })}
                >
                  {doc.title}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
        <Avatar name="Sarah Chen" size={28} color="platinum" />
      </div>
    </div>
  );
};

export default AppHeader;
