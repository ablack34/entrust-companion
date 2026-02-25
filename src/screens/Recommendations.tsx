import React, { useMemo, useState } from 'react';
import {
  Card,
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
  ProgressBar,
  Dropdown,
  Option,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Divider,
  CounterBadge,
  Input,
  Textarea,
  Label,
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  Checkmark24Regular,
  CheckmarkCircle24Regular,
  Dismiss24Regular,
  Edit24Regular,
  Save24Regular,
  Warning16Filled,
  Person16Regular,
  Bot24Regular,
  ArrowRight24Regular,
  Search24Regular,
  Database16Regular,
  Globe16Regular,
  QuestionCircle16Regular,
  Link16Regular,
  MailWarning16Regular,
} from '@fluentui/react-icons';
import { useApp, useActiveRun } from '../context/AppContext';
import { AccountRecommendation } from '../types';

const useStyles = makeStyles({
  container: {
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  stepper: {
    marginBottom: '24px',
  },
  stepperLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  summaryBar: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  recCard: {
    marginBottom: '16px',
    padding: '20px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '8px',
    transition: 'box-shadow 0.2s',
    '&:hover': {
      boxShadow: tokens.shadow8,
    },
  },
  recCardNeedsReview: {
    marginBottom: '16px',
    padding: '20px',
    border: `2px solid ${tokens.colorPaletteYellowBorder2}`,
    borderRadius: '8px',
    backgroundColor: tokens.colorPaletteYellowBackground1,
  },
  recHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  rankBadge: {
    fontSize: '14px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground5,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0,
  },
  scoreBadge: {
    fontSize: '20px',
    fontWeight: 700,
    color: tokens.colorBrandForeground1,
  },
  scoreBar: {
    marginTop: '4px',
    width: '80px',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  reasoningBlock: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '6px',
  },
  factorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
    marginBottom: '16px',
  },
  factorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  factorLabel: {
    flex: '0 0 120px',
    fontSize: '12px',
  },
  factorBar: {
    flex: 1,
  },
  factorValue: {
    flex: '0 0 35px',
    textAlign: 'right' as const,
    fontSize: '12px',
    fontWeight: 600,
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  contactProvenanceRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '6px',
    marginBottom: '12px',
  },
  provenanceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  provenanceMatched: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  provenancePartial: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    color: tokens.colorPaletteYellowForeground2,
  },
  provenanceInferred: {
    backgroundColor: tokens.colorPaletteMarigoldBackground1,
    color: tokens.colorPaletteMarigoldForeground1,
  },
  provenanceNotFound: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
  },
  discoveryNote: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '1.4',
    marginTop: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    padding: '16px 0',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  paginationControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  needsReviewWarning: {
    marginBottom: '12px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  editFormRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
});

const PAGE_SIZE = 5;

const Recommendations: React.FC = () => {
  const styles = useStyles();
  const { dispatch } = useApp();
  const activeRun = useActiveRun();
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [editingRank, setEditingRank] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    contactName: string;
    contactTitle: string;
    contactEmail: string;
    reasoning: string;
  }>({ contactName: '', contactTitle: '', contactEmail: '', reasoning: '' });

  const recommendations = useMemo(() => activeRun?.recommendations ?? [], [activeRun?.recommendations]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'high':
        return recommendations.filter((r) => r.overallScore >= 85);
      case 'review':
        return recommendations.filter((r) => r.needsReview);
      case 'approved':
        return recommendations.filter((r) => r.status === 'approved');
      default:
        return recommendations;
    }
  }, [recommendations, filter]);

  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const approvedCount = recommendations.filter((r) => r.status === 'approved').length;
  const highPriorityCount = recommendations.filter((r) => r.overallScore >= 85).length;
  const needsReviewCount = recommendations.filter((r) => r.needsReview).length;

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const updateStatus = (rank: number, status: AccountRecommendation['status']) => {
    if (activeRun) {
      dispatch({
        type: 'UPDATE_RECOMMENDATION_STATUS',
        payload: { runId: activeRun.id, rank, status },
      });
    }
  };

  const startEditing = (rec: AccountRecommendation) => {
    setEditingRank(rec.rank);
    setEditForm({
      contactName: rec.bestContact.name,
      contactTitle: rec.bestContact.title,
      contactEmail: rec.bestContact.email ?? '',
      reasoning: rec.reasoning,
    });
  };

  const cancelEditing = () => {
    setEditingRank(null);
  };

  const saveEdit = (rank: number) => {
    if (activeRun) {
      dispatch({
        type: 'UPDATE_RECOMMENDATION',
        payload: {
          runId: activeRun.id,
          rank,
          updates: {
            reasoning: editForm.reasoning,
            bestContact: {
              name: editForm.contactName,
              title: editForm.contactTitle,
              email: editForm.contactEmail || null,
            },
          },
        },
      });
    }
    setEditingRank(null);
  };

  const handleGenerateOutreach = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return tokens.colorPaletteGreenForeground1;
    if (score >= 70) return tokens.colorPaletteYellowForeground2;
    return tokens.colorPaletteRedForeground1;
  };

  const renderFactorBar = (label: string, value: number, note?: string) => (
    <div className={styles.factorRow}>
      <Text className={styles.factorLabel}>{label}</Text>
      <div className={styles.factorBar}>
        <ProgressBar value={value / 100} thickness="large" color={value >= 70 ? 'brand' : 'warning'} />
      </div>
      <Text className={styles.factorValue} style={{ color: getScoreColor(value) }}>
        {value}%
      </Text>
      {note && (
        <Text size={100} style={{ color: tokens.colorNeutralForeground4, marginLeft: '4px' }}>
          ({note})
        </Text>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={handleBack} />
        <Text size={700} weight="bold">
          Recommendations
        </Text>
        {activeRun && (
          <Text size={400} style={{ color: tokens.colorNeutralForeground3 }}>
            — {activeRun.name}
          </Text>
        )}
      </div>

      <div className={styles.stepper}>
        <ProgressBar value={1} thickness="large" color="brand" />
        <div className={styles.stepperLabels}>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>1. Import</Text>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>2. Configure</Text>
          <Text weight="bold" style={{ color: tokens.colorBrandForeground1 }}>
            3. Review
          </Text>
        </div>
      </div>

      {/* Summary */}
      <div className={styles.summaryBar}>
        <Text>
          <strong>{recommendations.length}</strong> accounts analyzed
        </Text>
        <Text>·</Text>
        <Text>
          <CounterBadge count={highPriorityCount} color="brand" appearance="filled" size="small" />{' '}
          high-priority
        </Text>
        <Text>·</Text>
        <Text>
          <CounterBadge count={needsReviewCount} color="danger" appearance="filled" size="small" />{' '}
          needs review
        </Text>
        <Text>·</Text>
        <Text>
          <CounterBadge count={approvedCount} color="informative" appearance="filled" size="small" />{' '}
          approved
        </Text>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <Search24Regular style={{ color: tokens.colorNeutralForeground3 }} />
        <Dropdown
          value={filter === 'all' ? 'All' : filter === 'high' ? 'High Priority' : filter === 'review' ? 'Needs Review' : 'Approved'}
          onOptionSelect={(_, data) => {
            setFilter(data.optionValue ?? 'all');
            setPage(0);
          }}
          style={{ minWidth: '180px' }}
        >
          <Option value="all">All</Option>
          <Option value="high">High Priority (85+)</Option>
          <Option value="review">Needs Review</Option>
          <Option value="approved">Approved</Option>
        </Dropdown>
      </div>

      {/* Recommendation Cards */}
      {pageItems.map((rec) => (
        <Card
          key={rec.rank}
          className={rec.needsReview ? styles.recCardNeedsReview : styles.recCard}
        >
          <div className={styles.recHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={styles.rankBadge}>#{rec.rank}</div>
              <div>
                <Text size={500} weight="bold">
                  {rec.accountName}
                </Text>
                <Text size={200} block style={{ color: tokens.colorNeutralForeground3 }}>
                  {rec.domain}
                </Text>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text className={styles.scoreBadge}>{rec.overallScore}</Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>/100</Text>
              <div className={styles.scoreBar}>
                <ProgressBar
                  value={rec.overallScore / 100}
                  thickness="large"
                  color={rec.overallScore >= 85 ? 'success' : rec.overallScore >= 70 ? 'warning' : 'error'}
                />
              </div>
            </div>
          </div>

          {/* Best Contact + Data Provenance */}
          <div className={styles.contactRow}>
            <Person16Regular />
            <Text weight="semibold">{rec.bestContact.name}</Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {rec.bestContact.title}
            </Text>
            {rec.bestContact.email && (
              <Text size={200} style={{ color: tokens.colorBrandForeground1 }}>
                {rec.bestContact.email}
              </Text>
            )}
            {!rec.bestContact.email && (
              <Badge appearance="outline" color="warning" size="small" icon={<MailWarning16Regular />}>
                Email not available
              </Badge>
            )}
          </div>

          {/* Contact Discovery Provenance */}
          <div className={styles.contactProvenanceRow}>
            <Link16Regular style={{ color: tokens.colorNeutralForeground3, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Data source badge */}
                <span className={`${styles.provenanceBadge} ${
                  rec.bestContact.source === 'salesforce' ? styles.provenanceMatched :
                  rec.bestContact.source === 'goodfit' ? styles.provenancePartial :
                  rec.bestContact.source === 'inferred' ? styles.provenanceInferred :
                  styles.provenanceNotFound
                }`}>
                  {rec.bestContact.source === 'salesforce' && <><Database16Regular /> Salesforce CRM</>}
                  {rec.bestContact.source === 'goodfit' && <><Globe16Regular /> Goodfit Enrichment</>}
                  {rec.bestContact.source === 'inferred' && <><QuestionCircle16Regular /> Inferred (not CRM-validated)</>}
                  {rec.bestContact.source === 'none' && <><QuestionCircle16Regular /> No contact found</>}
                </span>
                {/* Discovery confidence badge */}
                <span className={`${styles.provenanceBadge} ${
                  rec.bestContact.discovery === 'matched' ? styles.provenanceMatched :
                  rec.bestContact.discovery === 'partial' ? styles.provenancePartial :
                  rec.bestContact.discovery === 'inferred' ? styles.provenanceInferred :
                  styles.provenanceNotFound
                }`}>
                  {rec.bestContact.discovery === 'matched' && '✓ Domain matched'}
                  {rec.bestContact.discovery === 'partial' && '⚠ Partial match'}
                  {rec.bestContact.discovery === 'inferred' && '? Inferred'}
                  {rec.bestContact.discovery === 'not-found' && '✗ Not found'}
                </span>
                {/* Email source */}
                {rec.bestContact.email && rec.bestContact.emailSource !== rec.bestContact.source && (
                  <span className={`${styles.provenanceBadge} ${
                    rec.bestContact.emailSource === 'salesforce' ? styles.provenanceMatched :
                    rec.bestContact.emailSource === 'inferred' ? styles.provenanceInferred :
                    styles.provenancePartial
                  }`}>
                    Email: {rec.bestContact.emailSource === 'salesforce' ? 'CRM-verified' :
                            rec.bestContact.emailSource === 'inferred' ? 'Pattern-guessed' :
                            rec.bestContact.emailSource}
                  </span>
                )}
              </div>
              <Text className={styles.discoveryNote}>
                {rec.bestContact.discoveryNote}
              </Text>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className={styles.reasoningBlock}>
            <Bot24Regular style={{ color: tokens.colorBrandForeground1, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <Text size={200} weight="semibold" block style={{ marginBottom: '4px', color: tokens.colorBrandForeground1 }}>
                AI Reasoning
              </Text>
              <Text size={300}>{rec.reasoning}</Text>
            </div>
          </div>

          {/* Factor Bars */}
          <div className={styles.factorsGrid}>
            {renderFactorBar('Persona fit', rec.factors.personaFit)}
            {renderFactorBar('Size match', rec.factors.companySizeMatch)}
            {renderFactorBar('Industry', rec.factors.industryRelevance)}
            {renderFactorBar('CRM signals', rec.factors.crmSignals, rec.factors.crmSignals < 50 ? 'limited' : undefined)}
            {renderFactorBar('Web signals', rec.factors.webIntentSignals)}
          </div>

          {/* Needs Review Warning */}
          {rec.needsReview && rec.reviewReason && (
            <div className={styles.needsReviewWarning}>
              <MessageBar intent="warning" icon={<Warning16Filled />}>
                <MessageBarBody>
                  <MessageBarTitle>Needs Review</MessageBarTitle>
                  {rec.reviewReason}
                </MessageBarBody>
              </MessageBar>
            </div>
          )}

          {/* Inline Edit Form */}
          {editingRank === rec.rank && (
            <div className={styles.editForm}>
              <Text size={400} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>
                Edit Recommendation
              </Text>
              <div className={styles.editFormRow}>
                <div className={styles.editField}>
                  <Label htmlFor={`edit-name-${rec.rank}`}>Contact Name</Label>
                  <Input
                    id={`edit-name-${rec.rank}`}
                    value={editForm.contactName}
                    onChange={(_, data) => setEditForm((f) => ({ ...f, contactName: data.value }))}
                  />
                </div>
                <div className={styles.editField}>
                  <Label htmlFor={`edit-title-${rec.rank}`}>Contact Title</Label>
                  <Input
                    id={`edit-title-${rec.rank}`}
                    value={editForm.contactTitle}
                    onChange={(_, data) => setEditForm((f) => ({ ...f, contactTitle: data.value }))}
                  />
                </div>
              </div>
              <div className={styles.editField}>
                <Label htmlFor={`edit-email-${rec.rank}`}>Contact Email</Label>
                <Input
                  id={`edit-email-${rec.rank}`}
                  type="email"
                  value={editForm.contactEmail}
                  onChange={(_, data) => setEditForm((f) => ({ ...f, contactEmail: data.value }))}
                  placeholder="email@company.com"
                />
              </div>
              <div className={styles.editField}>
                <Label htmlFor={`edit-reasoning-${rec.rank}`}>Notes / Reasoning</Label>
                <Textarea
                  id={`edit-reasoning-${rec.rank}`}
                  value={editForm.reasoning}
                  onChange={(_, data) => setEditForm((f) => ({ ...f, reasoning: data.value }))}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button appearance="subtle" size="small" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  size="small"
                  icon={<Save24Regular />}
                  onClick={() => saveEdit(rec.rank)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <Divider />
          <div className={styles.actionRow}>
            {rec.status === 'approved' ? (
              <>
                <Badge appearance="filled" color="success" size="large">
                  Approved
                </Badge>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => updateStatus(rec.rank, 'pending')}
                >
                  Undo
                </Button>
              </>
            ) : rec.status === 'dismissed' ? (
              <>
                <Badge appearance="filled" color="danger" size="large">
                  Dismissed
                </Badge>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => updateStatus(rec.rank, 'pending')}
                >
                  Undo
                </Button>
              </>
            ) : rec.status === 'edited' ? (
              <>
                <Badge appearance="filled" color="informative" size="large" icon={<CheckmarkCircle24Regular />}>
                  Edited
                </Badge>
                <Button
                  appearance="primary"
                  size="small"
                  icon={<Checkmark24Regular />}
                  onClick={() => updateStatus(rec.rank, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  appearance="outline"
                  size="small"
                  icon={<Edit24Regular />}
                  onClick={() => startEditing(rec)}
                >
                  Edit Again
                </Button>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Dismiss24Regular />}
                  onClick={() => updateStatus(rec.rank, 'dismissed')}
                >
                  Dismiss
                </Button>
              </>
            ) : editingRank === rec.rank ? null : (
              <>
                <Button
                  appearance="primary"
                  size="small"
                  icon={<Checkmark24Regular />}
                  onClick={() => updateStatus(rec.rank, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  appearance="outline"
                  size="small"
                  icon={<Edit24Regular />}
                  onClick={() => startEditing(rec)}
                >
                  Edit
                </Button>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Dismiss24Regular />}
                  onClick={() => updateStatus(rec.rank, 'dismissed')}
                >
                  Dismiss
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationControls} style={{ justifyContent: 'center', marginTop: '16px' }}>
          <Button
            appearance="outline"
            size="small"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </Button>
          <Text>
            Page {page + 1} of {totalPages}
          </Text>
          <Button
            appearance="outline"
            size="small"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className={styles.footer}>
        <Text>
          <strong>{approvedCount}</strong> accounts · approved for outreach
        </Text>
        <Button
          appearance="primary"
          size="large"
          icon={<ArrowRight24Regular />}
          iconPosition="after"
          disabled={approvedCount === 0}
          onClick={handleGenerateOutreach}
        >
          Generate Outreach Pack
        </Button>
      </div>
    </div>
  );
};

export default Recommendations;
