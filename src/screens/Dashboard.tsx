import React from 'react';
import {
  Card,
  CardHeader,
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
  Divider,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowRight16Regular,
  CheckmarkCircle16Filled,
  ArrowSync16Filled,
} from '@fluentui/react-icons';
import { useApp } from '../context/AppContext';
import { ProspectingRun } from '../types';
import { mockDashboardStats } from '../data/mockData';

const useStyles = makeStyles({
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  greeting: {
    marginBottom: '24px',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 200px',
    padding: '24px',
    textAlign: 'center',
    borderTop: `3px solid ${tokens.colorBrandBackground}`,
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 700,
    color: tokens.colorBrandForeground1,
    display: 'block',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
  },
  ctaSection: {
    marginBottom: '32px',
  },
  runsSection: {
    marginTop: '16px',
  },
  statusBadge: {
    cursor: 'default',
  },
  clickableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const { state, dispatch } = useApp();

  const handleNewRun = () => {
    const id = `run-${Date.now()}`;
    dispatch({ type: 'CREATE_RUN', payload: { id, name: 'New Prospecting Pass' } });
    dispatch({ type: 'SET_ACTIVE_RUN', payload: id });
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const handleRunClick = (run: ProspectingRun) => {
    dispatch({ type: 'SET_ACTIVE_RUN', payload: run.id });
    if (run.status === 'complete' || run.status === 'review') {
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  const columns: TableColumnDefinition<ProspectingRun>[] = [
    createTableColumn<ProspectingRun>({
      columnId: 'name',
      renderHeaderCell: () => 'Run',
      renderCell: (item) => <Text weight="semibold">{item.name}</Text>,
      compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<ProspectingRun>({
      columnId: 'date',
      renderHeaderCell: () => 'Date',
      renderCell: (item) => <Text>{item.date}</Text>,
      compare: (a, b) => a.date.localeCompare(b.date),
    }),
    createTableColumn<ProspectingRun>({
      columnId: 'accounts',
      renderHeaderCell: () => 'Accounts',
      renderCell: (item) => <Text>{item.accountCount.toLocaleString()}</Text>,
      compare: (a, b) => a.accountCount - b.accountCount,
    }),
    createTableColumn<ProspectingRun>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item) => (
        <Badge
          appearance="filled"
          color={item.status === 'complete' ? 'success' : 'informative'}
          icon={item.status === 'complete' ? <CheckmarkCircle16Filled /> : <ArrowSync16Filled />}
          className={styles.statusBadge}
        >
          {item.status === 'complete' ? 'Complete' : item.status === 'review' ? 'In Review' : item.status}
        </Badge>
      ),
    }),
    createTableColumn<ProspectingRun>({
      columnId: 'action',
      renderHeaderCell: () => '',
      renderCell: () => <ArrowRight16Regular />,
    }),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.greeting}>
        <Text size={800} weight="bold" block>
          Welcome back, Sarah
        </Text>
        <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>
          Entrust Prospect Prioritization Companion
        </Text>
      </div>

      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <span className={styles.statNumber}>
            {mockDashboardStats.totalImported.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Accounts Imported</span>
        </Card>
        <Card className={styles.statCard}>
          <span className={styles.statNumber}>
            {mockDashboardStats.prioritizedThisMonth.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Prioritized This Month</span>
        </Card>
        <Card className={styles.statCard}>
          <span className={styles.statNumber}>
            {mockDashboardStats.outreachPacksSent.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Outreach Packs Sent</span>
        </Card>
      </div>

      <div className={styles.ctaSection}>
        <Button
          appearance="primary"
          size="large"
          icon={<Add24Regular />}
          onClick={handleNewRun}
        >
          Start New Prospecting Pass
        </Button>
      </div>

      <Divider />

      <div className={styles.runsSection}>
        <Text size={500} weight="semibold" block style={{ marginBottom: '12px' }}>
          Recent Runs
        </Text>
        <DataGrid
          items={state.runs}
          columns={columns}
          getRowId={(item) => item.id}
          sortable
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<ProspectingRun>>
            {({ item, rowId }) => (
              <DataGridRow<ProspectingRun>
                key={rowId}
                className={styles.clickableRow}
                onClick={() => handleRunClick(item)}
              >
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    </div>
  );
};

export default Dashboard;
