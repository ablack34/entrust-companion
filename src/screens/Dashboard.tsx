import React, { useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
  mergeClasses,
  Tooltip,
  Subtitle1,
  Caption1,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowRight16Regular,
  ArrowTrendingLines24Regular,
  People24Regular,
  Mail24Regular,
  CheckmarkCircle16Filled,
  ArrowSync16Filled,
  Clock16Regular,
  DocumentBulletList24Regular,
  Star24Filled,
  Trophy24Regular,
  ArrowUpRight16Filled,
  Circle16Filled,
  Send16Regular,
  ArrowDownload16Regular,
  Eye16Regular,
  Checkmark16Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons';
import { useApp } from '../context/AppContext';
import { ProspectingRun } from '../types';
import {
  mockDashboardStats,
  mockActivityFeed,
  mockTopProspects,
  ActivityItem,
} from '../data/mockData';

/* ─── Animations (keyframes via style tag) ────────────────── */
const ANIMATION_STYLE_ID = 'dashboard-animations';
function ensureAnimations() {
  if (document.getElementById(ANIMATION_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = ANIMATION_STYLE_ID;
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(16px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0, 120, 212, 0.15); }
      50% { box-shadow: 0 0 0 8px rgba(0, 120, 212, 0); }
    }
    @keyframes scoreRing {
      from { stroke-dashoffset: 100; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Styles ──────────────────────────────────────────────── */
const useStyles = makeStyles({
  container: {
    padding: '32px',
    maxWidth: '1280px',
    margin: '0 auto',
  },

  /* ── Hero Section ── */
  hero: {
    borderRadius: '16px',
    padding: '36px 40px',
    marginBottom: '28px',
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 60%, ${tokens.colorPaletteBerryBackground2} 100%)`,
    color: tokens.colorNeutralForegroundOnBrand,
    position: 'relative' as const,
    overflow: 'hidden',
    animationName: 'fadeInUp',
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  heroPattern: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '40%',
    opacity: 0.07,
    backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                       radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                       radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
    backgroundSize: '60px 60px, 80px 80px, 40px 40px',
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  heroGreeting: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '36px',
  },
  heroSubtitle: {
    fontSize: '15px',
    opacity: 0.85,
    maxWidth: '480px',
  },
  heroDate: {
    fontSize: '13px',
    opacity: 0.65,
    marginTop: '4px',
  },
  heroCta: {
    flexShrink: 0,
  },

  /* ── Stats Row ── */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    padding: '20px 24px',
    borderRadius: '12px',
    cursor: 'default',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    animationName: 'fadeInUp',
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  statCardDelay1: { animationDelay: '0.05s' },
  statCardDelay2: { animationDelay: '0.1s' },
  statCardDelay3: { animationDelay: '0.15s' },
  statCardDelay4: { animationDelay: '0.2s' },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  statIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBlue: { backgroundColor: tokens.colorBrandBackground2 },
  statIconGreen: { backgroundColor: tokens.colorPaletteGreenBackground2 },
  statIconPurple: { backgroundColor: tokens.colorPaletteBerryBackground2 },
  statIconOrange: { backgroundColor: tokens.colorPalettePeachBackground2 },
  statTrend: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
    padding: '2px 8px',
    borderRadius: '12px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    display: 'block',
    lineHeight: '38px',
    animationName: 'countUp',
    animationDuration: '0.4s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  statLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },

  /* ── Two Column Layout ── */
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  /* ── Quick Actions  ── */ 
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    animationName: 'fadeInUp',
    animationDuration: '0.5s',
    animationDelay: '0.25s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  actionTile: {
    padding: '24px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: tokens.shadow16,
    },
  },
  actionTilePrimary: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
    color: tokens.colorNeutralForegroundOnBrand,
    border: 'none',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: tokens.shadow16,
    },
  },
  actionIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  actionIconDefault: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  actionTitle: {
    fontWeight: 600,
    fontSize: '15px',
  },
  actionDesc: {
    fontSize: '13px',
    opacity: 0.8,
    lineHeight: '18px',
  },

  /* ── Section Headers ── */
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },

  /* ── Run Cards ── */
  runsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    animationName: 'fadeInUp',
    animationDuration: '0.5s',
    animationDelay: '0.3s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  runCard: {
    padding: '20px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ':hover': {
      transform: 'translateX(4px)',
      boxShadow: tokens.shadow8,
    },
  },
  runStatusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  runStatusComplete: {
    backgroundColor: tokens.colorPaletteGreenBorder2,
  },
  runStatusReview: {
    backgroundColor: tokens.colorPaletteMarigoldBorder2,
    animationName: 'pulseGlow',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
  },
  runStatusOther: {
    backgroundColor: tokens.colorNeutralStroke1,
  },
  runInfo: {
    flex: 1,
    minWidth: 0,
  },
  runName: {
    fontWeight: 600,
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  runMeta: {
    display: 'flex',
    gap: '16px',
    marginTop: '4px',
    alignItems: 'center',
  },
  runMetaItem: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  runArrow: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },

  /* ── Top Prospects ── */
  prospectsCard: {
    borderRadius: '12px',
    padding: '24px',
    animationName: 'slideInRight',
    animationDuration: '0.5s',
    animationDelay: '0.3s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  prospectRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
    ':first-child': {
      paddingTop: 0,
    },
  },
  prospectRank: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    flexShrink: 0,
  },
  rankGold: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  rankSilver: {
    backgroundColor: '#E8E8E8',
    color: '#555',
  },
  rankBronze: {
    backgroundColor: '#FFE8D4',
    color: '#8B5E3C',
  },
  prospectInfo: {
    flex: 1,
    minWidth: 0,
  },
  prospectName: {
    fontWeight: 600,
    fontSize: '14px',
  },
  prospectDetail: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },
  scoreRingWrap: {
    position: 'relative' as const,
    width: '44px',
    height: '44px',
    flexShrink: 0,
  },
  scoreRingSvg: {
    transform: 'rotate(-90deg)',
  },
  scoreRingText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    fontWeight: 700,
    color: tokens.colorBrandForeground1,
  },

  /* ── Activity Feed ── */
  activityCard: {
    borderRadius: '12px',
    padding: '24px',
    animationName: 'slideInRight',
    animationDuration: '0.5s',
    animationDelay: '0.4s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '10px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
    ':first-child': {
      paddingTop: 0,
    },
  },
  activityDot: {
    marginTop: '4px',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '18px',
  },
  activityDesc: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activityTime: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    marginTop: '2px',
  },
});

/* ─── Score Ring Component ─────────────────────────────────── */
const ScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 44 }) => {
  const styles = useStyles();
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className={styles.scoreRingWrap} style={{ width: size, height: size }}>
      <svg className={styles.scoreRingSvg} width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.colorNeutralStroke2}
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.colorBrandBackground}
          strokeWidth={4}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            animationName: 'scoreRing',
            animationDuration: '0.8s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'both',
          }}
        />
      </svg>
      <span className={styles.scoreRingText}>{score}</span>
    </div>
  );
};

/* ─── Activity Icon ───────────────────────────────────────── */
const activityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'run_complete':
      return <CheckmarkCircle16Filled style={{ color: tokens.colorPaletteGreenForeground1 }} />;
    case 'outreach_sent':
      return <Send16Regular style={{ color: tokens.colorBrandForeground1 }} />;
    case 'import':
      return <ArrowDownload16Regular style={{ color: tokens.colorPaletteBerryForeground1 }} />;
    case 'review':
      return <Eye16Regular style={{ color: tokens.colorPaletteMarigoldForeground1 }} />;
    case 'approved':
      return <Checkmark16Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />;
    default:
      return <Circle16Filled style={{ color: tokens.colorNeutralForeground3 }} />;
  }
};

/* ─── Greeting Helper ─────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── Dashboard ───────────────────────────────────────────── */
const Dashboard: React.FC = () => {
  const styles = useStyles();
  const { state, dispatch } = useApp();

  useEffect(() => {
    ensureAnimations();
  }, []);

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

  const handleViewRecommendations = () => {
    const completedRun = state.runs.find((r) => r.status === 'complete');
    if (completedRun) {
      dispatch({ type: 'SET_ACTIVE_RUN', payload: completedRun.id });
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    {
      icon: <People24Regular style={{ color: tokens.colorBrandForeground1 }} />,
      iconStyle: styles.statIconBlue,
      value: mockDashboardStats.totalImported,
      label: 'Accounts Imported',
      trend: '+2.4k this month',
      delay: styles.statCardDelay1,
    },
    {
      icon: <ArrowTrendingLines24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />,
      iconStyle: styles.statIconGreen,
      value: mockDashboardStats.prioritizedThisMonth,
      label: 'Prioritized This Month',
      trend: '+18% vs last month',
      delay: styles.statCardDelay2,
    },
    {
      icon: <Mail24Regular style={{ color: tokens.colorPaletteBerryForeground1 }} />,
      iconStyle: styles.statIconPurple,
      value: mockDashboardStats.outreachPacksSent,
      label: 'Outreach Packs Sent',
      trend: '+12 this week',
      delay: styles.statCardDelay3,
    },
    {
      icon: <Trophy24Regular style={{ color: tokens.colorPalettePeachForeground2 }} />,
      iconStyle: styles.statIconOrange,
      value: `${mockDashboardStats.conversionRate}%`,
      label: 'Conversion Rate',
      trend: '+3.1pp QoQ',
      delay: styles.statCardDelay4,
    },
  ];

  return (
    <div className={styles.container}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <Text className={styles.heroGreeting}>
              {getGreeting()}, Sarah{' '}
              <Sparkle24Regular style={{ verticalAlign: 'middle', marginLeft: 4 }} />
            </Text>
            <Text className={styles.heroSubtitle}>
              You have <strong>{mockDashboardStats.activeRuns} run in review</strong> and{' '}
              <strong>{mockDashboardStats.completedRuns} completed runs</strong> this month.
              Your average prospect score is <strong>{mockDashboardStats.avgScore}</strong>.
            </Text>
            <Text className={styles.heroDate}>{formattedDate}</Text>
          </div>
          <div className={styles.heroCta}>
            <Button
              appearance="secondary"
              size="large"
              icon={<Add24Regular />}
              onClick={handleNewRun}
              style={{ fontWeight: 600 }}
            >
              New Prospecting Pass
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        {stats.map((s, i) => (
          <Card key={i} className={mergeClasses(styles.statCard, s.delay)}>
            <div className={styles.statTop}>
              <div className={mergeClasses(styles.statIconWrap, s.iconStyle)}>{s.icon}</div>
              <span className={styles.statTrend}>
                <ArrowUpRight16Filled style={{ fontSize: 10 }} />
                {s.trend}
              </span>
            </div>
            <span className={styles.statNumber}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </Card>
        ))}
      </div>

      {/* ── Two Column Body ── */}
      <div className={styles.twoCol}>
        <div className={styles.leftCol}>
          {/* Quick Actions */}
          <div>
            <div className={styles.sectionHeader}>
              <Subtitle1>Quick Actions</Subtitle1>
            </div>
            <div className={styles.quickActions}>
              <Card
                className={mergeClasses(styles.actionTile, styles.actionTilePrimary)}
                onClick={handleNewRun}
              >
                <div className={styles.actionIcon}>
                  <Add24Regular />
                </div>
                <Text className={styles.actionTitle}>Start New Run</Text>
                <Text className={styles.actionDesc}>
                  Import accounts and configure AI-powered prioritization
                </Text>
              </Card>
              <Card className={styles.actionTile} onClick={handleViewRecommendations}>
                <div className={mergeClasses(styles.actionIcon, styles.actionIconDefault)}>
                  <Star24Filled style={{ color: tokens.colorBrandForeground1 }} />
                </div>
                <Text className={styles.actionTitle}>View Recommendations</Text>
                <Text className={styles.actionDesc}>
                  Review and approve top accounts from your latest run
                </Text>
              </Card>
              <Card className={styles.actionTile} onClick={handleViewRecommendations}>
                <div className={mergeClasses(styles.actionIcon, styles.actionIconDefault)}>
                  <DocumentBulletList24Regular style={{ color: tokens.colorBrandForeground1 }} />
                </div>
                <Text className={styles.actionTitle}>Outreach Packs</Text>
                <Text className={styles.actionDesc}>
                  Generate personalized outreach emails for approved prospects
                </Text>
              </Card>
            </div>
          </div>

          {/* Recent Runs */}
          <div>
            <div className={styles.sectionHeader}>
              <Subtitle1>Recent Runs</Subtitle1>
              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                {state.runs.length} total
              </Caption1>
            </div>
            <div className={styles.runsGrid}>
              {state.runs.map((run) => (
                <Card
                  key={run.id}
                  className={styles.runCard}
                  onClick={() => handleRunClick(run)}
                >
                  <div
                    className={mergeClasses(
                      styles.runStatusDot,
                      run.status === 'complete'
                        ? styles.runStatusComplete
                        : run.status === 'review'
                        ? styles.runStatusReview
                        : styles.runStatusOther
                    )}
                  />
                  <div className={styles.runInfo}>
                    <Text className={styles.runName}>{run.name}</Text>
                    <div className={styles.runMeta}>
                      <span className={styles.runMetaItem}>
                        <Clock16Regular />
                        {run.date}
                      </span>
                      <span className={styles.runMetaItem}>
                        <People24Regular style={{ fontSize: 14 }} />
                        {run.accountCount.toLocaleString()} accounts
                      </span>
                      <Badge
                        appearance="filled"
                        color={
                          run.status === 'complete'
                            ? 'success'
                            : run.status === 'review'
                            ? 'warning'
                            : 'informative'
                        }
                        size="small"
                        icon={
                          run.status === 'complete' ? (
                            <CheckmarkCircle16Filled />
                          ) : (
                            <ArrowSync16Filled />
                          )
                        }
                      >
                        {run.status === 'complete'
                          ? 'Complete'
                          : run.status === 'review'
                          ? 'In Review'
                          : run.status}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight16Regular className={styles.runArrow} />
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className={styles.rightCol}>
          {/* Top Prospects */}
          <Card className={styles.prospectsCard}>
            <div className={styles.sectionHeader}>
              <Subtitle1>Top Prospects</Subtitle1>
              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                Latest run
              </Caption1>
            </div>
            {mockTopProspects.map((p, i) => (
              <div key={i} className={styles.prospectRow}>
                <div
                  className={mergeClasses(
                    styles.prospectRank,
                    i === 0
                      ? styles.rankGold
                      : i === 1
                      ? styles.rankSilver
                      : styles.rankBronze
                  )}
                >
                  {i + 1}
                </div>
                <div className={styles.prospectInfo}>
                  <Text className={styles.prospectName}>{p.name}</Text>
                  <Text className={styles.prospectDetail}>
                    {p.industry} · {p.contact}
                  </Text>
                </div>
                <Tooltip content={`Score: ${p.score}/100`} relationship="label">
                  <span>
                    <ScoreRing score={p.score} />
                  </span>
                </Tooltip>
              </div>
            ))}
            <Button
              appearance="subtle"
              size="small"
              style={{ marginTop: 12, width: '100%' }}
              onClick={handleViewRecommendations}
            >
              View all recommendations →
            </Button>
          </Card>

          {/* Activity Feed */}
          <Card className={styles.activityCard}>
            <div className={styles.sectionHeader}>
              <Subtitle1>Recent Activity</Subtitle1>
            </div>
            {mockActivityFeed.slice(0, 5).map((a) => (
              <div key={a.id} className={styles.activityItem}>
                <span className={styles.activityDot}>{activityIcon(a.type)}</span>
                <div className={styles.activityContent}>
                  <Text className={styles.activityTitle}>{a.title}</Text>
                  <Text className={styles.activityDesc}>{a.description}</Text>
                  <Text className={styles.activityTime}>{a.relativeTime}</Text>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
